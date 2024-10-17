import mongoose, { Document, Schema, Model } from 'mongoose';

export interface iBin extends Document {
  userId: mongoose.Types.ObjectId; // Use mongoose.Types.ObjectId
  location: string;
  size: number;
  level: number;
  isCollected: boolean;
  collectionHistory: {
    status: boolean;
    timestamp: Date;
  }[];
}

const BinSchema: Schema<iBin> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Schema.Types.ObjectId is fine here
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
      default: false,
    },
    collectionHistory: [
      {
        status: {
          type: Boolean,
          required: true, // Make sure it's required if necessary
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now, // Add a default timestamp if needed
        },
      },
    ],
  },
  { timestamps: true }
);

const BinModel: Model<iBin> = mongoose.model('Bin', BinSchema);
export default BinModel;
