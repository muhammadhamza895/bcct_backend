import mongoose from "mongoose";

const MeasurementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sheetsPerUnit: {
        type: Number,
        required: true,
        default: 1,
    }
});

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export { MeasurementModel }