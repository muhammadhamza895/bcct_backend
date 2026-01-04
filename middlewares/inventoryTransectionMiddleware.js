import mongoose from "mongoose";
import { JobModel } from "../models/jobs.js";
// import { OnboardingModel } from "../models/onboarding.js"; 
import { InventoryTransactionModel } from "../models/inventoryTransection.js";
import { calculateTotalSheets, sheetToUnitConverter } from "./helpers.js";
import MaterialsModel from "../models/materials.js";
import { MeasurementModel } from "../models/measurement.js";

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

export const checkNotCompletedWorkOrder = (req, res, next) => {
    try {
        const { workOrder } = req;

        if (workOrder.status === "completed") {
            return res.status(403).json({
                success: false,
                message: "Work order is already completed"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify work order status",
            error: error.message
        });
    }
};

export const preventDoubleReversal = (req, res, next) => {
    const status = req.workOrder.status;

    if (status === "reverted") {
        return res.status(400).json({
            success: false,
            message: "This work order has already been reverted"
        });
    }

    if (status !== "completed") {
        return res.status(400).json({
            success: false,
            message: "Only completed work orders can be reverted"
        });
    }

    next();
};

export const verifyMaterialStockForCompletion = async (req, res, next) => {
    try {
        const materials = req?.body?.materials
            ? req.body.materials
            : [];

        if (!Array.isArray(materials) || materials.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Materials are required to complete the order"
            });
        }

        const verifiedMaterials = [];

        for (let i = 0; i < materials.length; i++) {
            const { materialId, unitQuantity = 0, extraSheets = 0 } = materials[i];

            if (!mongoose.Types.ObjectId.isValid(materialId)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid materialId of material ${i + 1}`
                });
            }

            if (!Number.isInteger(unitQuantity) || unitQuantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid units value of material ${i + 1}`
                });
            }

            if (!Number.isInteger(extraSheets) || extraSheets < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid extraSheets value of material ${i + 1}`
                });
            }

            const material = await MaterialsModel
                .findById(materialId)
                .populate("measurementId", "sheetsPerUnit");

            if (!material) {
                return res.status(404).json({
                    success: false,
                    message: `Material at position ${i + 1} not found`
                });
            }

            const sheetsPerUnit = material?.measurementId?.sheetsPerUnit || 1;

            const totalSheetsRequired = calculateTotalSheets({
                unitQuantity,
                sheetsPerUnit,
                extraSheets
            });

            if (totalSheetsRequired <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid units or extraSheets value of ${material?.name}`
                });
            }

            const normalizedExistingStock = sheetToUnitConverter({
                sheetsPerUnit,
                totalSheets: material.totalSheets
            })

            if (material.totalSheets < totalSheetsRequired) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for material "${material.name}". Its current stock is ${normalizedExistingStock?.unitQuantity} units, ${normalizedExistingStock?.extraSheets} sheets.`
                });
            }

            verifiedMaterials.push({
                material,
                // unitQuantity,
                // extraSheets,
                totalSheetsRequired,
                // stockBefore: material.totalSheets
            });
        }

        req.verifiedMaterials = verifiedMaterials;

        next();
    } catch (error) {
        console.error("Error verifying material stock:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying material stock",
            error: error.message
        });
    }
};

export const prepareInventoryTransactionsForCompletion = (req, res, next) => {
    try {
        const { workOrder, verifiedMaterials } = req;

        if (!workOrder || !verifiedMaterials || verifiedMaterials.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Required data missing for inventory transaction creation"
            });
        }

        const transactions = verifiedMaterials.map(({ material, totalSheetsRequired }) => {
            const sheetsPerUnit = material?.measurementId?.sheetsPerUnit
            const stockBefore = material.totalSheets
            const stockAfter = stockBefore - totalSheetsRequired

            const normalizedUnits = sheetToUnitConverter({
                sheetsPerUnit,
                totalSheets: totalSheetsRequired
            })

            // const normalizedExistingStock = sheetToUnitConverter({
            //     sheetsPerUnit, 
            //     totalSheets : material.totalSheets
            // })

            // const normalizeRemainingStock = sheetToUnitConverter({
            //     sheetsPerUnit, 
            //     totalSheets : remainingStock
            // })

            return {
                materialId: material._id,
                type: "OUT",
                sourceType: "WORK_ORDER",
                sourceId: workOrder._id.toString(),

                unitQuantity: normalizedUnits?.unitQuantity,
                extraSheets: normalizedUnits?.extraSheets,

                totalSheetsChange: -totalSheetsRequired,
                // stockBefore : `${normalizedExistingStock?.unitQuantity} units, ${normalizedExistingStock?.extraSheets} sheets`,
                // stockAfter: `${normalizeRemainingStock?.unitQuantity} units, ${normalizeRemainingStock?.extraSheets} sheets`,

                stockBefore,
                stockAfter,

                pricePerUnit: null,
                isReversal: false
            };
        });

        req.inventoryTransactions = transactions;

        // return res.send({
        //     success: true,
        //     transactions
        // })

        next();
    } catch (error) {
        console.error("Error preparing inventory transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to prepare inventory transactions",
            error: error.message
        });
    }
};

export const loadWorkOrderInventoryTransactions = async (req, res, next) => {
    try {
        const transactions = await InventoryTransactionModel.find({
            sourceType: "WORK_ORDER",
            sourceId: req.workOrder._id.toString(),
            isReversal: false
        });

        if (!transactions.length) {
            return res.status(404).json({
                success: false,
                message: "No inventory transactions found for this work order"
            });
        }

        req.originalTransactions = transactions;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load inventory transactions",
            error: error.message
        });
    }
};

export const prepareReversalTransactions = async (req, res, next) => {
    try {
        const reversalTransactions = [];

        for (const tx of req.originalTransactions) {
            const material = await MaterialsModel.findById(tx.materialId);

            const stockBefore = material.totalSheets;
            const stockAfter = stockBefore + Math.abs(tx.totalSheetsChange);

            reversalTransactions.push({
                materialId: tx.materialId,
                type: "IN",
                sourceType: "WORK_ORDER_REVERSAL",
                sourceId: tx.sourceId,

                unitQuantity: tx.unitQuantity,
                extraSheets: tx.extraSheets,

                totalSheetsChange: Math.abs(tx.totalSheetsChange),
                stockBefore,
                stockAfter,

                pricePerUnit: null,
                isReversal: true
            });
        }

        req.reversalTransactions = reversalTransactions;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to prepare reversal transactions",
            error: error.message
        });
    }
};

export const verifyOnboardingItems = async (req, res, next) => {
    try {
        const items = req.body?.items || [];

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Items must be a non-empty array"
            });
        }

        const verifiedMaterials = [];

        for (let i = 0; i < items.length; i++) {
            const itemIndex = i + 1;
            const { materialId, unitQuantity, pricePerUnit } = items[i];

            if (!mongoose.Types.ObjectId.isValid(materialId)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid materialId for material ${itemIndex}`
                });
            }

            if (!Number.isInteger(unitQuantity) || unitQuantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid unit quantity for material ${itemIndex}`
                });
            }

            if (typeof pricePerUnit !== "number" || pricePerUnit < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid price per unit for material ${itemIndex}`
                });
            }

            const material = await MaterialsModel
                .findById(materialId)
                .populate("measurementId", "sheetsPerUnit");

            if (!material) {
                return res.status(404).json({
                    success: false,
                    message: `Material not found at position ${itemIndex}`
                });
            }

            const sheetsPerUnit =
                material?.measurementId?.sheetsPerUnit || 1;

            const totalSheetsArrived = calculateTotalSheets({
                unitQuantity,
                sheetsPerUnit,
                extraSheets: 0
            });

            if (totalSheetsArrived <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid sheet calculation for material ${itemIndex}`
                });
            }

            verifiedMaterials.push({
                material,
                unitQuantity,
                totalSheetsArrived,
                pricePerUnit
            });
        }

        req.verifiedMaterials = verifiedMaterials;
        next();
    } catch (error) {
        console.error("Error verifying onboarding items:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify onboarding items",
            error: error.message
        });
    }
};

export const prepareInventoryTransactionsForOnboarding = (req, res, next) => {
    try {
        const { verifiedMaterials } = req;

        const transactions = verifiedMaterials.map(({ material, unitQuantity, totalSheetsArrived, pricePerUnit }) => {
            const stockBefore = material.totalSheets
            const stockAfter = stockBefore + totalSheetsArrived

            return {
                materialId: material._id,
                type: "IN",
                sourceType: "ONBOARDING",
                sourceId: "",

                unitQuantity: unitQuantity,
                extraSheets: 0,

                totalSheetsChange: totalSheetsArrived,

                stockBefore,
                stockAfter,

                pricePerUnit: pricePerUnit,
                isReversal: false
            };
        });

        req.inventoryTransactions = transactions;

        next();
    } catch (error) {
        console.error("Error preparing inventory transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to prepare inventory transactions",
            error: error.message
        });
    }
};

export const prepareOnboardingDocument = (req, res, next) => {
    try {
        const { items } = req.body;
        const supplier = req.body?.supplier || "";

        const onBoaring = {
            supplier,
            items,
            isReversal : false
        }

        req.onBoaring = onBoaring
        next()
    } catch (error) {
        console.error("Error preparing Onboarding document", error);
        res.status(500).json({
            success: false,
            message: "Failed to prepare Onboarding document",
            error: error.message
        });
    }
}

export const addOnboardingIdToTransection = ({ id, inventoryTransactions }) => {
    const onboardedTransections = inventoryTransactions?.map(val => {
        return {
            ...val,
            ['sourceId']: id,
        }
    })
    return onboardedTransections
}

