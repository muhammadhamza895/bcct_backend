import { JobModel } from "../models/jobs";

export const getJobsByPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const jobs = await JobModel.find()
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

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
