import MaterialsModel from '../models/materials.js';
import { MeasurementModel } from '../models/measurement.js';
import { calculateTotalSheets, mongoIdVerifier, sheetToUnitConverter } from '../middlewares/helpers.js';

const getMaterial = async (req, res) => {
    try {
        const materials = await MaterialsModel.find().populate('measurementId');

        const data = materials?.map(val => {
            const sheetsPerUnit = val?.measurementId?.sheetsPerUnit
            const totalSheets = val?.totalSheets


            const unitsSheets = sheetToUnitConverter({ sheetsPerUnit, totalSheets })
            return {
                _id: val?._id,
                name: val?.name,
                measurement: val?.measurementId?.name || 'No unit',
                unitQuantity: unitsSheets?.unitQuantity,
                extraSheets: unitsSheets?.extraSheets,
                measurementId: val?.measurementId?._id,
                thresholdUnits: val?.thresholdUnits / sheetsPerUnit || 1
            }
        })

        res.status(200).json({
            success: true,
            message: 'Materials fetched successfully',
            materials: data
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
        let { name, measurementId, unitQuantity = 0, extraSheets = 0, thresholdUnits = 1 } = req.body;

        const trimmedName = name?.trim();

        const sheetsPerUnit = req?.measure?.sheetsPerUnit
        const totalSheets = calculateTotalSheets({ unitQuantity, sheetsPerUnit, extraSheets })

        const existingMaterial = await MaterialsModel.findOne({ name: trimmedName });
        if (existingMaterial) {
            return res.status(409).json({
                success: false,
                message: 'Material already exists with this name'
            });
        }

        const newMaterial = new MaterialsModel({
            name: trimmedName,
            measurementId: measurementId || null,
            totalSheets,
            thresholdUnits: thresholdUnits * sheetsPerUnit
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
        let { name, measurementId, unitQuantity, extraSheets, thresholdUnits = 1 } = req.body;

        const trimmedName = name?.trim();

        const sheetsPerUnit = req?.measure?.sheetsPerUnit
        const totalSheets = calculateTotalSheets({ unitQuantity, sheetsPerUnit, extraSheets })

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
                totalSheets,
                thresholdUnits: thresholdUnits * sheetsPerUnit
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
        if (!mongoIdVerifier(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id'
            });
        }

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

export const getMaterialsCount = async (req, res) => {
    try {
        const count = await MaterialsModel.countDocuments();

        res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        console.error('Error counting materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get materials count',
        });
    }
};

export const getLowStockMaterials = async (req, res) => {
    try {
        const materials = await MaterialsModel.find({
            $expr: { $lt: ['$totalSheets', '$thresholdUnits'] },
        }).populate('measurementId', 'name sheetsPerUnit');

        res.status(200).json({
            success: true,
            count: materials.length,
            data: materials,
        });
    } catch (error) {
        console.error('Error fetching low stock materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch low stock materials',
        });
    }
};

export const getMaterialForDashboard = async (req, res) => {
    try {
        const materials = await MaterialsModel.find().populate('measurementId').limit(7);

        const data = materials?.map(val => {
            const sheetsPerUnit = val?.measurementId?.sheetsPerUnit
            const totalSheets = val?.totalSheets


            const unitsSheets = sheetToUnitConverter({ sheetsPerUnit, totalSheets })
            return {
                _id: val?._id,
                name: val?.name,
                measurement: val?.measurementId?.name || 'No unit',
                unitQuantity: unitsSheets?.unitQuantity,
                extraSheets: unitsSheets?.extraSheets,
                measurementId: val?.measurementId?._id,
                thresholdUnits: val?.thresholdUnits / sheetsPerUnit || 1
            }
        })

        res.status(200).json({
            success: true,
            message: 'Materials fetched successfully',
            materials: data
        });
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching materials'
        });
    }
}



export { getMaterial, createMaterial, updateMaterial, deleteMaterial };