import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default : 'user'
    }
});

const userModel = mongoose.model('User', UserSchema);
export { userModel };
