import OnloadingModel from '../models/onloading.js';

const createOnloading = async (req, res) => {
    try {
        const { materialId, supplier, unitQuantity, extraSheets } = req.body;
        const newOnloading = new OnloadingModel({
            materialId,
            supplier,
            unitQuantity,
            extraSheets
        });
        await newOnloading.save();
        res.status(201).json({
            success: true,
            message: 'Onloading created successfully',
            onloading: newOnloading
        });
    } catch (error) {
        console.error('Error creating onloading:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating onloading'
        });
    }
}

export { createOnloading };