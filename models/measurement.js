import mongoose from "mongoose";

const MeasurementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sheetsPerUnit: {
        type: Number,
        required: true
    }
});

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export { MeasurementModel }