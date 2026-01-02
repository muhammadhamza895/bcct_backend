import { MeasurementModel } from '../models/measurement.js';

const getMeasurement = async (req, res) => {
    try {
        const measurements = await MeasurementModel.find()
            .populate("numberOfMaterials")
            .exec();;
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

        // if (!name || name.trim() === '') {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Name is required'
        //     });
        // }



        // const parsedSheetsPerUnit = parseInt(sheetsPerUnit);
        // if (Number.isNaN(parsedSheetsPerUnit) || parsedSheetsPerUnit <= 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid sheetsPerUnit value'
        //     });
        // }

        const newMeasurement = new MeasurementModel({ name, sheetsPerUnit });
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

        const updatedMeasurement = await MeasurementModel.findByIdAndUpdate(id, { name, sheetsPerUnit }, { new: true });

        if (!updatedMeasurement) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found"
            });
        }

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

const deleteMeasurement = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMeasurement = await MeasurementModel.findByIdAndDelete(id);

        if (!deletedMeasurement) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Measurement deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting measurement:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting measurement"
        });
    }
};


export { getMeasurement, createMeasurement, updateMeasurement, deleteMeasurement };