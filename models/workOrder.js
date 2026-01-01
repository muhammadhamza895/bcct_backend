import mongoose from "mongoose";

const WorkOrderSchema = new mongoose.Schema(
    {
        job: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true
        },
        deliveryDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false }
    }
);

WorkOrderSchema.index({ job: 1 });
WorkOrderSchema.index({ priority: 1 });
WorkOrderSchema.index({ createdAt: -1 });
WorkOrderSchema.index({ job: 1, priority: 1, createdAt: -1});

const WorkOrderModel = mongoose.model("WorkOrder", WorkOrderSchema);
export {WorkOrderModel};
