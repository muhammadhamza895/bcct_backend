import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { _id: false }
);

const JobSchema = new mongoose.Schema(
    {
        job_id: {
            type: String,
            required: true,
            unique: true,
        },
        department: {
            type: String,
            required: true,
        },
        tasks: {
            type: [TaskSchema],
            required: true
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false }
    }
);

JobSchema.index({ job_id: 1 });

const JobModel = mongoose.model("Job", JobSchema);
export { JobModel };
