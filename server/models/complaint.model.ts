import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComplaint extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  status: string; 
  message: string; 
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema: Schema<IComplaint> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ComplaintModel: Model<IComplaint> = mongoose.model('Complaint', complaintSchema);
export default ComplaintModel;
