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

module.exports = mongoose.model('Measurement', MeasurementSchema);