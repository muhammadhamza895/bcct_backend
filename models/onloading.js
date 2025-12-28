import mongoose from 'mongoose';

const OnloadingSchema = new mongoose.Schema({
    papetType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    supplier: {
        type: String,
    },
    unitQuantity: {
        type: Number,
        required: true,
        default: 0   
    },
    extraSheets: {
        type: Number,
        default: 0   
    },
});

const MaterialsModel = mongoose.model('Onloading', OnloadingSchema);

export default MaterialsModel;