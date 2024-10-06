import mongoose, { Document, Schema, Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;  
  type: string;     
  message: string;  
  isRead: boolean;  
  createdAt: Date;  
}

const notificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',   
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default NotificationModel;
