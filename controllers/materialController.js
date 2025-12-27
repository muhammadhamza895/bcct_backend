import MaterialsModel from '../models/materials.js';
import { MeasurementModel } from '../models/measurement.js';

const getMaterial = async (req, res) => {
    try {
        const materials = await MaterialsModel.find();
        res.status(200).json({
            success: true,
            message: 'Materials fetched successfully',
            materials
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
        let { name, measurement, unitQuantity = 0, extraSheets = 0 } = req.body;

        const trimmedName = name?.trim();

        if (!trimmedName) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        if (!measurement) {
            return res.status(400).json({
                success: false,
                message: 'Measurement unit is required'
            });
        }

        if (unitQuantity < 0 || extraSheets < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantities cannot be negative'
            });
        }

        const measure = await MeasurementModel
            .findById(measurement)
            .select('sheetsPerUnit')
            .lean();

        if (!measure) {
            return res.status(400).json({
                success: false,
                message: 'Measure unit not found'
            });
        }

        const { sheetsPerUnit } = measure;

        if (typeof sheetsPerUnit !== 'number' || sheetsPerUnit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid measurement configuration'
            });
        }

        if (extraSheets >= sheetsPerUnit) {
            const extraNumberOfUnits = Math.floor(extraSheets / sheetsPerUnit);
            unitQuantity += extraNumberOfUnits;
            extraSheets -= extraNumberOfUnits * sheetsPerUnit;
        }

        const existingMaterial = await MaterialsModel.findOne({ name: trimmedName });
        if (existingMaterial) {
            return res.status(409).json({
                success: false,
                message: 'Material already exists'
            });
        }

        const newMaterial = new MaterialsModel({
            name: trimmedName,
            measurement,
            unitQuantity,
            extraSheets
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
        const { name, type, currentStock, maxStock } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        if (!type || type.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Type is required'
            });
        }


        const updateData = { name, type }
        if (currentStock !== undefined) {
            const parsedCurrentStock = parseInt(currentStock);

            if (Number.isNaN(parsedCurrentStock) || parsedCurrentStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid currentStock value'
                });
            }

            updateData['currentStock'] = parsedCurrentStock;
        }

        // Validate & convert maxStock
        if (maxStock !== undefined) {
            const parsedMaxStock = parseInt(maxStock);

            if (Number.isNaN(parsedMaxStock) || parsedMaxStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid maxStock value'
                });
            }

            updateData['maxStock'] = parsedMaxStock;
        }
        const updated_material = await MaterialsModel.findByIdAndUpdate(
            id, updateData, { new: true });

        if (!updated_material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Material updated successfully',
            updated_material
        });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating material'
        });
    }
}

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