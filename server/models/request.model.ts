import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRequest extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  status: string; 
  createdAt: Date;
  updatedAt: Date;
  message: string; 
}

const requestSchema: Schema<IRequest> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const RequestModel: Model<IRequest> = mongoose.model('Request', requestSchema);
export default RequestModel;
