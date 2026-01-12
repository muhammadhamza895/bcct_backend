import { JobModel } from "../models/jobs.js";

export const getJobsByPage = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const jobs = await JobModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("numberOfWorkOrders")
            .exec();

        const totalJobs = await JobModel.countDocuments();

        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};

export const getJobsById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Invalid job Id'
            })
        }

        const job = await JobModel.findOne({
            job_id: id
        }).populate("numberOfWorkOrders")
            .exec();

        if (!job) {
            return res.status(404).send({
                success: false,
                message: 'Job not found'
            })
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
}

export const createJob = async (req, res) => {
    try {
        const { job_id, department, tasks } = req.body;

        const job = await JobModel.create({
            job_id,
            department,
            tasks
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.job_id) {
            return res.status(409).json({
                success: false,
                message: "Job Id already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to create job",
            error: error.message
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const { department, tasks } = req.body;

        const updatedJob = await JobModel.findOneAndUpdate(
            { job_id },
            {
                department,
                tasks
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update job",
            error: error.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { job_id } = req.params;

        const deletedJob = await JobModel.findOneAndDelete({ job_id });

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete job",
            error: error.message
        });
    }
};

export const getJobsCount = async (req, res) => {
    try {
        const count = await JobModel.countDocuments();

        res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        console.error('Error counting materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get materials count',
        });
    }
};
