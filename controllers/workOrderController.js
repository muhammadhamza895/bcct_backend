import { WorkOrderModel } from "../models/workOrder.js";

export const getWorkOrdersByPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const workOrders = await WorkOrderModel.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const totalWorkOrders = await WorkOrderModel.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalWorkOrders / limit),
      totalWorkOrders,
      workOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch work orders",
      error: error.message
    });
  }
};
