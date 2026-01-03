import mongoose from "mongoose";
import { InventoryTransactionModel } from "../models/inventoryTransection.js";

export const checkMaterialHasNoTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid material ID"
            });
        }

        const transactionExists = await InventoryTransactionModel.exists({
            materialId: id
        });

        if (transactionExists) {
            return res.status(400).json({
                success: false,
                message:
                    "Material cannot be deleted because it exists in past completed work orders or inventory records"
            });
        }

        next();
    } catch (error) {
        console.error("Error checking material transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify material transactions",
            error: error.message
        });
    }
};
