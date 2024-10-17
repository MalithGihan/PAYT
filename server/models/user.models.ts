import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  _id: string; 
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  homeOwnerName: string;
  address: string;
  postalNumber: number;
  role: string;
  isVerified: boolean;
  bins: Array<{
    binId: string;
    location: string;
    size: string;
    isCollected: boolean;
  }>;
  requests: Array<{
    requestId: string;
    requestDate: Date;
    status: string;
    description: string;
  }>;
  complaints: Array<{
    complaintId: string;
    complaintDate: Date;
    status: string;
    description: string;
  }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}


const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    homeOwnerName: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    postalNumber: {
      type: Number,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bins: [
      {
        binId: { type: String, required: true },
        location: { type: String, required: true }, 
        size: { type: String, required: true },    
        isCollected: { type: Boolean, default: false }, 
      },
    ],
    requests: [
      {
        requestId: { type: String, required: true },
        requestDate: { type: Date, default: Date.now }, 
        status: { type: String, default: "pending" },   
        description: { type: String },                 
      },
    ],
    complaints: [
      {
        complaintId: { type: String, required: true },
        complaintDate: { type: Date, default: Date.now }, 
        status: { type: String, default: "open" },        
        description: { type: String },                    
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
    expiresIn: "5m",
  });
};


userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
    expiresIn: "3d",
  });
};


userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
