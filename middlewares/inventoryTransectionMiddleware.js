import mongoose from "mongoose";
import { JobModel } from "../models/jobs.js";
// import { OnboardingModel } from "../models/onboarding.js"; 
import { InventoryTransactionModel } from "../models/inventoryTransaction.js";
import { calculateTotalSheets } from "./helpers.js";

export const prepareInventoryTransaction = (req, res, next) => {
    try {
        const { unitQuantity = 0, extraSheets = 0, type } = req.body;
        const material = req.material;

        const sheetsPerUnit = material?.measurementId?.sheetsPerUnit || 1;
        const totalSheets = calculateTotalSheets({
            unitQuantity,
            extraSheets,
            sheetsPerUnit
        });

        const change =
            type === "IN" ? totalSheets : -totalSheets;

        const stockBefore = material.totalSheets;
        const stockAfter = stockBefore + change;

        if (stockAfter < 0) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        req.inventoryMeta = {
            totalSheetsChange: change,
            stockBefore,
            stockAfter
        };

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to prepare inventory transaction"
        });
    }
};

export const verifyOnboardingPrice = (req, res, next) => {
    try {
        const { type, sourceType, pricePerUnit } = req.body;

        if (type === "IN" && sourceType === "ONBOARDING") {
            if (pricePerUnit === undefined || pricePerUnit === null) {
                return res.status(400).json({
                    success: false,
                    message: "pricePerUnit is required for onboarding transactions"
                });
            }

            if (typeof pricePerUnit !== "number" || pricePerUnit < 0) {
                return res.status(400).json({
                    success: false,
                    message: "pricePerUnit must be a positive number"
                });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify pricePerUnit",
            error: error.message
        });
    }
};

export const verifySourceId = async (req, res, next) => {
    try {
        const { sourceType, sourceId } = req.body;

        // Check if sourceId exists
        if (!sourceId || typeof sourceId !== "string") {
            return res.status(400).json({
                success: false,
                message: "sourceId is required and must be a string"
            });
        }

        // JOB transactions
        if (sourceType === "JOB") {
            const jobExists = await JobModel.exists({ job_id: sourceId });
            if (!jobExists) {
                return res.status(404).json({
                    success: false,
                    message: `Job with ID ${sourceId} does not exist`
                });
            }
        } 
        // ONBOARDING transactions
        else if (sourceType === "ONBOARDING") {
            if (!mongoose.Types.ObjectId.isValid(sourceId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid onboarding ID"
                });
            }

            // const onboardingExists = await OnboardingModel.exists({ _id: sourceId });
            const onboardingExists = null
            if (!onboardingExists) {
                return res.status(404).json({
                    success: false,
                    message: `Onboarding with ID ${sourceId} does not exist`
                });
            }
        } 
        // ONBOARDING_REVERSAL transactions
        else if (sourceType === "ONBOARDING_REVERSAL") {
            if (!mongoose.Types.ObjectId.isValid(sourceId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid onboarding transaction ID for reversal"
                });
            }

            const originalTransaction = await InventoryTransactionModel.findOne({
                _id: sourceId,
                type: "IN",
                sourceType: "ONBOARDING",
                isReversal: false
            });

            if (!originalTransaction) {
                return res.status(404).json({
                    success: false,
                    message: `Original onboarding transaction with ID ${sourceId} not found for reversal`
                });
            }
        } 
        // Invalid sourceType
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid sourceType. Allowed values: JOB, ONBOARDING, ONBOARDING_REVERSAL"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify sourceId",
            error: error.message
        });
    }
};


