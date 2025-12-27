import mongoose from 'mongoose';

const MaterialsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['paper', 'card']
    },
    currentStock: { type: Number },
    maxStock: { type: Number },
});

const MaterialsModel = mongoose.model('Material', MaterialsSchema);

export default MaterialsModel;