import mongoose from "mongoose";
import { InventoryTransactionModel } from "../models/inventoryTransection.js";

export const checkPriority = (req, res, next) => {
    const { priority } = req.body;
    const validPriorities = ["low", "medium", "high"];

    if (!priority) {
        return res.status(400).json({
            success: false,
            message: "Priority field is required"
        });
    }

    if (!validPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: `Invalid priority. Allowed values are: ${validPriorities.join(
                ", "
            )}`
        });
    }

    next();
};

export const checkDeliveryDate = (req, res, next) => {
    const { deliveryDate } = req.body;

    if (deliveryDate) {
        const delivery = new Date(deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ignore time, only compare date

        if (isNaN(delivery.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery date format"
            });
        }

        if (delivery < today) {
            return res.status(400).json({
                success: false,
                message: "Delivery date cannot be before today"
            });
        }
    }
    next();
};

export const checkWorkOrderStatus = (req, res, next) => {
    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    const validStatuses = ["pending", "in progress", "completed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status value.  Allowed values are: ${validStatuses.join(
                ", "
            )}`
        });
    }

    next();
};

export const checkPendingStatus = async (req, res, next) => {
    try {
        const { workOrder } = req

        if (workOrder?.status !== "pending") {
            return res.status(403).json({
                success: false,
                message: "Only pending work orders can be edited or deleted"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to check work order status",
            error: error.message
        });
    }
};

export const checkWorkOrderUsedInInventory = async (req, res, next) => {
    try {
        const { id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid work order ID"
            });
        }

        const exists = await InventoryTransactionModel.exists({
            sourceId: id.toString()
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Work order cannot be deleted because it exists in inventory transactions"
            });
        }

        next();
    } catch (error) {
        console.error("Error checking work order in inventory:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify work order usage in inventory",
            error: error.message
        });
    }
};

export const checkJobId = (req, res, next) => {
    const { work_id } = req.body;

    if (!work_id) {
        return res.status(400).json({
            success: false,
            message: "Work ID is required"
        });
    }

    next();
};



