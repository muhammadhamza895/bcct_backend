import mongoose from 'mongoose';

const MaterialsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    measurementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Measurement',
        default: null,
        set: (v) => {
            return mongoose.Types.ObjectId.isValid(v) ? v : null;
        }
    },
    totalSheets : {
        type : Number,
        default : 0
    }
});

const MaterialsModel = mongoose.model('Material', MaterialsSchema);

export default MaterialsModel;