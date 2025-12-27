import MaterialsModel from '../models/materials.js';

const getMaterial = async (req, res) => {
    console.log('getMaterial route working')
    res.send('router working')
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

export { getMaterial, createMaterial };