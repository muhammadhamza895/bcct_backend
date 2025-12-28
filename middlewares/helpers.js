import { MeasurementModel } from "../models/measurement.js";

const quantityVerification = (req, res, next) => {
    try {
        let { unitQuantity, extraSheets } = req.body;

        if (unitQuantity !== undefined) {
            unitQuantity = parseInt(unitQuantity, 10);

            if (Number.isNaN(unitQuantity) || unitQuantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid unitQuantity value'
                });
            }

            req.body.unitQuantity = unitQuantity;
        }

        if (extraSheets !== undefined) {
            extraSheets = parseInt(extraSheets, 10);

            if (Number.isNaN(extraSheets) || extraSheets < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid extraSheets value'
                });
            }

            req.body.extraSheets = extraSheets;
        }

        next();
    } catch (error) {
        console.error('Error verifying quantities:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying quantities'
        });
    }
};


const sheetsPerUnitVerification = (req, res, next) => {
    try {
        const sheetsPerUnit = req.body?.sheetsPerUnit ?? req?.measure?.sheetsPerUnit;

        const parsedSheetsPerUnit = parseInt(sheetsPerUnit);
        if (Number.isNaN(parsedSheetsPerUnit) || parsedSheetsPerUnit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sheetsPerUnit value'
            });
        }
        
        req.body.sheetsPerUnit = parsedSheetsPerUnit;
        next();
    } catch (error) {
        console.error('Error verifying sheets per unit:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying sheets per unit'
        });
    }
}


const uniqueMeasurementVerifier = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Measurement name is required'
            });
        }

        const query = { name };
        if (id) {
            query._id = { $ne: id };
        }
        console.log({query})

        const existingMeasure = await MeasurementModel.findOne(query);

        if (existingMeasure) {
            return res.status(409).json({
                success: false,
                message: 'Measurement already exists with this name'
            });
        }

        next();
    } catch (error) {
        console.error('Error verifying measurement:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying measurement'
        });
    }
};

const sheetToUnitConverter=({sheetsPerUnit = 1, totalSheets = 1})=>{
    const unitQuantity = Math.floor(totalSheets / sheetsPerUnit);
    const extraSheets = totalSheets - (unitQuantity * sheetsPerUnit)
    return {unitQuantity, extraSheets};
}

const calculateTotalSheets=({unitQuantity, sheetsPerUnit, extraSheets})=>{
    return  (unitQuantity * sheetsPerUnit) + extraSheets
}

export { quantityVerification, sheetsPerUnitVerification, uniqueMeasurementVerifier, sheetToUnitConverter, calculateTotalSheets };