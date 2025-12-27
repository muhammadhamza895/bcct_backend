import MaterialsModel from '../models/materials.js';

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
        const { name, type, currentStock = 0, maxStock = 0 } = req.body;


        const new_material = new MaterialsModel({
            name,
            type,
            currentStock,
            maxStock
        });

        await new_material.save();
        // await appointment.populate(['propertyId', 'userId']);

        res.status(201).json({
            success: true,
            message: 'Material created successfully',
            new_material
        });
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating material'
        });
    }
}

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