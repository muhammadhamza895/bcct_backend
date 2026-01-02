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

MeasurementSchema.virtual("numberOfMaterials", {
    ref: "Material",
    localField: "_id",
    foreignField: "measurementId",
    count: true
});

MeasurementSchema.set("toJSON", { virtuals: true });
MeasurementSchema.set("toObject", { virtuals: true });

const MeasurementModel = mongoose.model('Measurement', MeasurementSchema);

export { MeasurementModel }