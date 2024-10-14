import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for the request collection
export interface IRequestCollect extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  driverId?: mongoose.Schema.Types.ObjectId; 
  binId: mongoose.Schema.Types.ObjectId; 
  status: string; 
  createdAt: Date;
  updatedAt: Date;
  message?: string; 
}

const requestCollectSchema: Schema<IRequestCollect> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    binId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bin',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "collected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }  
);

// Create the model
const RequestCollectModel: Model<IRequestCollect> = mongoose.model('RequestCollect', requestCollectSchema);

export default RequestCollectModel;
