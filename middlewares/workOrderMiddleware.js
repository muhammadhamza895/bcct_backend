export const checkPriority = (req, res, next) => {
    const { priority } = req.body;
    const validPriorities = ["low", "medium", "high"];

    if (!priority) {
        return res.status(400).json({
            success: false,
            message: "Priority field is required"
        });
    }

    if (!validPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: `Invalid priority. Allowed values are: ${validPriorities.join(
                ", "
            )}`
        });
    }

    next();
};


export const checkDeliveryDate = (req, res, next) => {
    const { deliveryDate } = req.body;

    if (deliveryDate) {
        const delivery = new Date(deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ignore time, only compare date

        if (isNaN(delivery.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery date format"
            });
        }

        if (delivery < today) {
            return res.status(400).json({
                success: false,
                message: "Delivery date cannot be before today"
            });
        }
    }
    next();
};
