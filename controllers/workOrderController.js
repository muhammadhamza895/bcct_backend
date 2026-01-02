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

export const createWorkOrder = async (req, res) => {
  try {
    const { job, description, priority, tasks, deliveryDate } = req.body;

    const workOrder = await WorkOrderModel.create({
      job,
      description,
      priority,
      tasks,
      deliveryDate
    });

    res.status(201).json({
      success: true,
      message: "Work order created successfully",
      workOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create work order",
      error: error.message
    });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedWorkOrder = await WorkOrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedWorkOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Work order status updated successfully",
      workOrder: updatedWorkOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update work order status",
      error: error.message
    });
  }
};

export const editWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { job, description, priority, tasks, deliveryDate } = req.body;

    const updatedWorkOrder = await WorkOrderModel.findByIdAndUpdate(
      id,
      {
        job,
        description,
        priority,
        tasks,
        deliveryDate,
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedWorkOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Work order updated successfully",
      workOrder: updatedWorkOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update work order",
      error: error.message
    });
  }
};

export const deleteWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid work order ID"
      });
    }

    const workOrder = await WorkOrderModel.findByIdAndDelete(id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Work order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete work order",
      error: error.message
    });
  }
};

