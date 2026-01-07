import mongoose from "mongoose";
import { TaskSchema } from "./jobs.js";

const MaterialsUsedSchema = new mongoose.Schema(
    {
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material'
        },
        materialName: {
            type: String
        },
        quantity: {
            type: Number,
            min: 0
        },
    },
    { _id: false }
)

const WorkOrderSchema = new mongoose.Schema(
    {
        job: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true
        },
        tasks: {
            type: [TaskSchema],
            required: true
        },
        status: {
            type: String,
            default: 'pending',
            enum: ["pending", "in progress", "completed", "reverted"],
        },
        deliveryDate: {
            type: Date,
            default: null
        },
        materialsUsed: {
            type: [MaterialsUsedSchema],
            default: []
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false }
    }
);

WorkOrderSchema.index({ job: 1 });
WorkOrderSchema.index({ priority: 1 });
WorkOrderSchema.index({ status: 1 });
WorkOrderSchema.index(
    { createdAt: -1 },
    { partialFilterExpression: { status: { $ne: 'reverted' } } }
);
WorkOrderSchema.index({ job: 1, priority: 1, createdAt: -1 });

const WorkOrderModel = mongoose.model("WorkOrder", WorkOrderSchema);
export { WorkOrderModel };
