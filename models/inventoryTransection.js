import mongoose from "mongoose";

const InventoryTransactionSchema = new mongoose.Schema(
    {
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
            required: true
        },
        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: true
        },
        sourceType: {
            type: String,
            enum: [
                "WORK_ORDER",
                "ONBOARDING",
                "ONBOARDING_REVERSAL",
                "WORK_ORDER_REVERSAL"
            ],
            required: true
        },
        sourceId: {
            type: String,
            required: true
        },
        unitQuantity: {
            type: Number,
            default: 0
        },
        extraSheets: {
            type: Number,
            default: 0
        },
        totalSheetsChange: {
            type: Number,
            required: true
        },
        stockBefore: {
            type: Number,
            required: true
        },
        stockAfter: {
            type: Number,
            required: true
        },
        pricePerUnit: {
            type: Number,
            default: null
        },
        isReversal: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false }
    }
);

// indexes for performance
InventoryTransactionSchema.index({ materialId: 1, createdAt: -1 });
InventoryTransactionSchema.index({ sourceType: 1, sourceId: 1 });
InventoryTransactionSchema.index({ sourceId: 1 });

const InventoryTransactionModel = mongoose.model(
    "InventoryTransaction",
    InventoryTransactionSchema
);

export { InventoryTransactionModel };
