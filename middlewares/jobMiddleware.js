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

