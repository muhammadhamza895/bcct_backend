import { MeasurementModel } from '../models/measurement.js';

const getMeasurement = async (req, res) => {
    try {
        const measurements = await MeasurementModel.find();
        res.status(200).json({
            success: true,
            message: 'Measurements fetched successfully',
            measurements
        });
    }
    catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching measurements'
        });
    }
}

const createMeasurement = async (req, res) => {
    try {
        const { name, sheetsPerUnit } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const parsedSheetsPerUnit = parseInt(sheetsPerUnit);
        if (Number.isNaN(parsedSheetsPerUnit) || parsedSheetsPerUnit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sheetsPerUnit value'
            });
        }

        const newMeasurement = new MeasurementModel({ name, sheetsPerUnit: parsedSheetsPerUnit });
        await newMeasurement.save();

        res.status(201).json({
            success: true,
            message: 'Measurement created successfully',
            newMeasurement
        });
    }
    catch (error) {
        console.error('Error creating measurement:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating measurement'
        });
    }
}

const updateMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sheetsPerUnit } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const parsedSheetsPerUnit = parseInt(sheetsPerUnit);
        if (Number.isNaN(parsedSheetsPerUnit) || parsedSheetsPerUnit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sheetsPerUnit value'
            });
        }

        const updatedMeasurement = await MeasurementModel.findByIdAndUpdate(id, { name, sheetsPerUnit: parsedSheetsPerUnit }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Measurement updated successfully',
            updatedMeasurement
        });
    }
    catch (error) {
        console.error('Error updating measurement:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating measurement'
        });
    }
}

export { getMeasurement, createMeasurement, updateMeasurement };