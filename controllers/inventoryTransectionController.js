import { InventoryTransactionModel } from "../models/inventoryTransection.js";
import MaterialsModel from "../models/materials.js";

export const createInventoryTransaction = async (req, res) => {
    try {
        const {
            materialId,
            type,
            sourceType,
            sourceId,
            unitQuantity,
            extraSheets,
            pricePerUnit,
            isReversal
        } = req.body;

        const { totalSheetsChange, stockBefore, stockAfter } =
            req.inventoryMeta;

        const transaction = await InventoryTransactionModel.create({
            materialId,
            type,
            sourceType,
            sourceId,
            unitQuantity,
            extraSheets,
            totalSheetsChange,
            stockBefore,
            stockAfter,
            pricePerUnit: pricePerUnit ?? null,
            isReversal: isReversal ?? false
        });

        // update material stock
        await MaterialsModel.findByIdAndUpdate(materialId, {
            totalSheets: stockAfter
        });

        res.status(201).json({
            success: true,
            message: "Inventory transaction created",
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create inventory transaction",
            error: error.message
        });
    }
};
