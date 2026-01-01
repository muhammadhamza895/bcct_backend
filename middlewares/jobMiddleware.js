export const checkJobId = (req, res, next) => {
    const { job_id } = req.body;

    if (!job_id) {
        return res.status(400).json({
            success: false,
            message: "Job ID is required"
        });
    }

    next();
};

export const checkDepartment = (req, res, next) => {
    const { department } = req.body;

    if (!department) {
        return res.status(400).json({
            success: false,
            message: "Department is required"
        });
    }

    next();
};

export const checkTasks = (req, res, next) => {
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Tasks must contain at least one task"
        });
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskNumber = i + 1;

        if (!task.name) {
            return res.status(400).json({
                success: false,
                message: `Task ${taskNumber} is missing name`
            });
        }

        if (
            task.quantity === undefined ||
            typeof task.quantity !== "number" ||
            task.quantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid quantity for task ${taskNumber}`
            });
        }
    }

    next();
};

