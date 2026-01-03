import mongoose from "mongoose";
import { InventoryTransactionModel } from "../models/inventoryTransection.js";
import MaterialsModel from "../models/materials.js";

export const completeWorkOrderInventoryController = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { inventoryTransactions, verifiedMaterials, workOrder } = req;

        session.startTransaction();

        await InventoryTransactionModel.insertMany(
            inventoryTransactions,
            { session }
        );

        for (const item of verifiedMaterials) {
            const { material, totalSheetsRequired } = item;

            await MaterialsModel.updateOne(
                { _id: material._id },
                {
                    $inc: {
                        totalSheets: -totalSheetsRequired
                    }
                },
                { session }
            );
        }

        workOrder.status = "completed";
        await workOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Work order completed and inventory updated successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Inventory completion error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to complete work order inventory transaction",
            error: error.message
        });
    }
};

