import mongoose from "mongoose";
import { InventoryTransactionModel } from "../models/inventoryTransection.js";
import MaterialsModel from "../models/materials.js";
import { OnboardingModel } from "../models/onboarding.js";
import { addOnboardingIdToTransection } from "../middlewares/inventoryTransectionMiddleware.js";

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

export const revertWorkOrderController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await InventoryTransactionModel.insertMany(
            req.reversalTransactions,
            { session }
        );

        for (const tx of req.reversalTransactions) {
            await MaterialsModel.findByIdAndUpdate(
                tx.materialId,
                { $inc: { totalSheets: tx.totalSheetsChange } },
                { session }
            );
        }

        req.workOrder.status = "reverted";
        await req.workOrder.save({ session });

        await session.commitTransaction();

        res.json({
            success: true,
            message: "Work order reverted successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: "Failed to revert work order",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

export const getInventoryTransactionsByMaterial = async (req, res) => {
    try {
        const { _id: materialId } = req.material
        const { page } = req.params;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limit = 10;
        const skip = (pageNumber - 1) * limit;

        const [transactions, totalCount] = await Promise.all([
            InventoryTransactionModel.find({ materialId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            InventoryTransactionModel.countDocuments({ materialId })
        ]);

        res.status(200).json({
            success: true,
            page: pageNumber,
            totalPages: Math.ceil(totalCount / limit),
            totalTransactions: totalCount,
            transactions
        });
    } catch (error) {
        console.error("Error fetching inventory transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory transactions",
            error: error.message
        });
    }
};

export const completeOnBoardingInventoryController = async (req, res) => {
    const { inventoryTransactions, verifiedMaterials } = req;
    
    const { onBoaring } = req

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newOnboaring = new OnboardingModel(onBoaring);
        await newOnboaring.save({ session })

        const onboaredTransection = addOnboardingIdToTransection({ id: newOnboaring._id, inventoryTransactions })

        await InventoryTransactionModel.insertMany(
            onboaredTransection,
            { session }
        );

        for (const item of verifiedMaterials) {
            const { material, totalSheetsArrived } = item;

            await MaterialsModel.updateOne(
                { _id: material._id },
                {
                    $inc: {
                        totalSheets: +totalSheetsArrived
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message: "Onboarding completed and inventory updated successfully",
            newOnboaring
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Inventory completion error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to complete onboaring inventory transaction",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

