import mongoose from 'mongoose';
import MaterialsModel from "../models/materials.js";

const materialVerifier = async (req, res, next) => {
    try {
        const { materialId } = req.body;

        if (!materialId) {
            return res.status(400).json({
                success: false,
                message: 'materialId is required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(materialId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid materialId'
            });
        }

        const material = await MaterialsModel.findById(materialId);

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        req.material = material;

        next();
    } catch (error) {
        console.error('Error verifying onloading data:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying onloading data'
        });
    }
};

// const measurementVerifier=async(req, res, next)=>{
//     try {
//         const { name } = req.body

//         const existingMeasure = await MeasurementModel.findOne({name});
//         if (existingMeasure){
//             req.existingMeasure = existingMeasure
//         }

//         next();
//     } catch (error) {
//         console.error('Error verifying measurement:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error verifying measurement'
//         });
//     }
// }

export { materialVerifier };
