import MaterialsModel from '../models/materials.js';
import { MeasurementModel } from '../models/measurement.js';
import { calculateTotalSheets, sheetToUnitConverter } from '../middlewares/helpers.js';

const getMaterial = async (req, res) => {
    try {
        const materials = await MaterialsModel.find().populate('measurementId');

        const data = materials?.map(val=>{
            const sheetsPerUnit = val?.measurementId?.sheetsPerUnit
            const totalSheets = val?.totalSheets


            const unitsSheets = sheetToUnitConverter({sheetsPerUnit, totalSheets})
            return {
                _id : val?._id,
                name : val?.name,
                measurement : val?.measurementId?.name || 'No unit',
                unitQuantity : unitsSheets?.unitQuantity,
                extraSheets : unitsSheets?.extraSheets
            }
        })

        res.status(200).json({
            success: true,
            message: 'Materials fetched successfully',
            materials : data
        });
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching materials'
        });
    }
}

const createMaterial = async (req, res) => {
    try {
        let { name, measurementId, unitQuantity = 0, extraSheets = 0 } = req.body;

        const trimmedName = name?.trim();

        if (!trimmedName) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const sheetsPerUnit = req?.measure?.sheetsPerUnit
        const totalSheets = calculateTotalSheets({unitQuantity, sheetsPerUnit, extraSheets})

        const existingMaterial = await MaterialsModel.findOne({ name: trimmedName });
        if (existingMaterial) {
            return res.status(409).json({
                success: false,
                message: 'Material already exists with this name'
            });
        }

        const newMaterial = new MaterialsModel({
            name: trimmedName,
            measurementId : measurementId || null,
            totalSheets
        });

        await newMaterial.save();

        res.status(201).json({
            success: true,
            message: 'Material created successfully',
            material: newMaterial
        });
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating material'
        });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, measurementId, unitQuantity, extraSheets } = req.body;

        const trimmedName = name?.trim();

        if (!trimmedName) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const sheetsPerUnit = req?.measure?.sheetsPerUnit
        const totalSheets = calculateTotalSheets({unitQuantity, sheetsPerUnit, extraSheets})

        const existingMaterial = await MaterialsModel.findOne({
            name: trimmedName,
            _id: { $ne: id }
        });

        if (existingMaterial) {
            return res.status(409).json({
                success: false,
                message: 'Material with this name already exists'
            });
        }

        const updatedMaterial = await MaterialsModel.findByIdAndUpdate(
            id,
            {
                name: trimmedName,
                measurementId,
                totalSheets
            },
            { new: true }
        );

        if (!updatedMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Material updated successfully',
            material: updatedMaterial
        });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating material'
        });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted_material = await MaterialsModel.findByIdAndDelete(id);
        if (!deleted_material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Material deleted successfully',
            deleted_material
        });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting material'
        });
    }
}

export { getMaterial, createMaterial, updateMaterial, deleteMaterial };