import mongoose from "mongoose";
import MaterialsModel from "../models/materials.js";

export const checkMeasurementHasNoMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid measurement ID"
            });
        }

        const materialExists = await MaterialsModel.exists({
            measurementId: id
        });

        if (materialExists) {
            return res.status(409).json({
                success: false,
                message: "Measurement cannot be deleted because it is already used in materials"
            });
        }

        next();
    } catch (error) {
        console.error("Error checking measurement usage:", error);
        res.status(500).json({
            success: false,
            message: "Error checking measurement usage"
        });
    }
};
