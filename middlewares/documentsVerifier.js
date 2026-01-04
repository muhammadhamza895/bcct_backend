import mongoose from 'mongoose';
import MaterialsModel from "../models/materials.js";
import { MeasurementModel } from '../models/measurement.js';
import { JobModel } from '../models/jobs.js';
import { WorkOrderModel } from '../models/workOrder.js';
import { InventoryTransactionModel } from '../models/inventoryTransection.js';
import { mongoIdVerifier } from './helpers.js';
import { OnboardingModel } from '../models/onboarding.js';

const materialVerifier = async (req, res, next) => {
    try {
        const { materialId } = req.body;

        if (!materialId) {
            return res.status(400).json({
                success: false,
                message: 'materialId is required'
            });
        }

        if (!mongoIdVerifier(materialId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid materialId'
            });
        }

        const material = await MaterialsModel.findById(materialId).populate("measurementId");

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        req.material = material;

        next();
    } catch (error) {
        console.error('Error verifying onloading data:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying onloading data'
        });
    }
};

const measureUnitVerifier = async (req, res, next) => {
    try {
        let { measurementId } = req.body;

        // if (
        //     !measurementId ||
        //     !mongoose.Types.ObjectId.isValid(measurementId)
        // ) {
        //     req.measure = { sheetsPerUnit: 1 };
        //     return next();
        // }

        if (!mongoose.Types.ObjectId.isValid(measurementId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid measurement ID"
            });
        }

        const measure = await MeasurementModel
            .findById(measurementId)
            .select('sheetsPerUnit')
            .lean();

        // if (!measure) {
        //     req.measure = {
        //         sheetsPerUnit: 1,
        //     }
        //     next()
        // }

        if (!measure) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found"
            });
        }

        req.measure = measure
        next()
    } catch (error) {
        console.error('Error verifying Measure unit data:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying Measure unit data'
        })
    }
}

// const measurementVerifier=async(req, res, next)=>{
//     try {
//         const { name } = req.body

//         const existingMeasure = await MeasurementModel.findOne({name});
//         if (existingMeasure){
//             req.existingMeasure = existingMeasure
//         }

//         next();
//     } catch (error) {
//         console.error('Error verifying measurement:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error verifying measurement'
//         });
//     }
// }

const jobVerifier = async (req, res, next) => {
    try {
        const { job } = req.body;

        if (!job) {
            return res.status(400).json({
                success: false,
                message: "Job field is required"
            });
        }

        const existingJob = await JobModel.findOne({ job_id: job });

        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: `Job with job_id "${job}" does not exist`
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify job",
            error: error.message
        });
    }
};

const loadWorkOrderById = async (workOrderId) => {
    if (!mongoIdVerifier(workOrderId)) {
        const error = new Error("Invalid work order ID");
        error.statusCode = 400;
        throw error;
    }

    const workOrder = await WorkOrderModel.findById(workOrderId);

    if (!workOrder) {
        const error = new Error("Work order not found");
        error.statusCode = 404;
        throw error;
    }

    return workOrder;
};

const workOrderVerifier = async (req, res, next) => {
    // const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Invalid work order ID"
    //     });
    // }

    // const workOrder = await WorkOrderModel.findById(id);

    // if (!workOrder) {
    //     return res.status(404).json({
    //         success: false,
    //         message: "Work order not found"
    //     });
    // }

    // req.workOrder = workOrder
    // next()

    try {
        const { id } = req.params;

        const workOrder = await loadWorkOrderById(id);
        req.workOrder = workOrder;

        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

const inventoryTransectionVerifier = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoIdVerifier(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Transection ID"
        });
    }

    const transection = await InventoryTransactionModel.findById(id);

    if (!transection) {
        return res.status(404).json({
            success: false,
            message: "transection not found"
        });
    }

    req.transection = transection
    next()
}

const workOrderFromTransactionVerifier = async (req, res, next) => {
    try {
        const { sourceId } = req.transection;
        const workOrder = await loadWorkOrderById(sourceId);
        req.workOrder = workOrder;
        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const loadOnBoardingById = async (onboaringId) => {
    if (!mongoIdVerifier(onboaringId)) {
        const error = new Error("Invalid onboaring ID");
        error.statusCode = 400;
        throw error;
    }

    const onboaring = await OnboardingModel.findById(onboaringId);

    if (!onboaring) {
        const error = new Error("Onboarding not found");
        error.statusCode = 404;
        throw error;
    }

    return onboaring;
};


export const onboaringVerifier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const onboaring = await loadOnBoardingById(id);
        req.onboaring = onboaring;

        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}


export { materialVerifier, measureUnitVerifier, jobVerifier, workOrderVerifier, inventoryTransectionVerifier, workOrderFromTransactionVerifier };
