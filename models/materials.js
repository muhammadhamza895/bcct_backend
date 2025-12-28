import mongoose from 'mongoose';

const MaterialsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    measurementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Measurement',
        required: true
    },
    totalSheets : {
        type : Number,
        default : 0
    }
    // unitQuantity: {
    //     type: Number,
    //     required: true,
    //     default: 0   
    // },

    // extraSheets: {
    //     type: Number,
    //     default: 0   
    // },
    // currentStock: { type: Number },
    // maxStock: { type: Number },
});

const MaterialsModel = mongoose.model('Material', MaterialsSchema);

export default MaterialsModel;