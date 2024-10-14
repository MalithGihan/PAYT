import mongoose, { Document, Schema, Model } from "mongoose";

export interface iBin extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    location: string;
    size: String;
    isCollected: Boolean;
    collectionHistory: {
        status: boolean;
        timestamp: Date;
    }[];
}

const BinSchema: Schema<iBin> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        level: {
            type: Number,
            default: 0,
        },
        isCollected: {
            type: Boolean,
            required: true,
            default: false
        },
        collectionHistory: [{
            status: Boolean,
            timestamp: Date
        }]
    },
    { timestamps: true }
);

const BinModel: Model<iBin> = mongoose.model('Bin', BinSchema);
export default BinModel;
