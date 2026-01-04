import mongoose from "mongoose";

const OnboardingItemSchema = new mongoose.Schema(
    {
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
            required: true
        },
        unitQuantity: {
            type: Number,
            required: true,
            min: 1
        },
        pricePerUnit: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const OnboardingSchema = new mongoose.Schema(
    {
        supplier: {
            type: String,
            default : ""
        },
        items: {
            type: [OnboardingItemSchema],
            required: true
        },
        isReversal: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false }
    }
);

OnboardingSchema.index({ createdAt: -1 });

const OnboardingModel = mongoose.model(
    "Onboarding",
    OnboardingSchema
);

export { OnboardingModel };
