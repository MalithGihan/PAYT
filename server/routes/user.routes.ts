import express from "express";
import {
  activationUser,
  deleteUser,
  getAllUsers,
  getUserInof,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateUserInfo,
  updateUserRole,
  updateProfilePicture,
} from "../controllers/user.controller";
import { authorizRoles, isAuthenticated } from "../middleware/auth";
import {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest,
} from "../controllers/request.controller";
import {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activationUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInof);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-user",
  isAuthenticated,
  authorizRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizRoles("admin"),
  deleteUser
);


userRouter.post("/create-req", isAuthenticated, createRequest); 
userRouter.get("/get-reqs", isAuthenticated, getRequests); 
userRouter.put("/update-req/:requestId", isAuthenticated, updateRequest); 
userRouter.delete("/del-req/:requestId", isAuthenticated, deleteRequest);

userRouter.post("/create-compl", isAuthenticated, createComplaint); 
userRouter.get("/get-compls", isAuthenticated, getComplaints); 
userRouter.put("/update-compl/:complaintId", isAuthenticated, updateComplaint); 
userRouter.delete("/del-compl/:complaintId", isAuthenticated, deleteComplaint); 


export default userRouter;
