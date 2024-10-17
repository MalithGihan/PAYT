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
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller";
import {
  createBin,
  getBins,
  getBinsbyid,
  updateBin,
  deleteBin,
  updateBinStatus,
  getBinStatusReport
} from "../controllers/bin.controller";

import {createRequestController,getRequestsController,updateRequestController,deleteRequestController} from '../controllers/requestcollect.controller'

const userRouter = express.Router();

userRouter.post("/registration", registrationUser); // user signup backend link
userRouter.post("/activate-user", activationUser); // user active user backend link
userRouter.post("/login", loginUser);  // user login backend link
userRouter.get("/logout", isAuthenticated, logoutUser); // user logout backend link
userRouter.get("/refresh", updateAccessToken); // user refresh backend link
userRouter.get("/me", isAuthenticated, getUserInof); // user online backend link
userRouter.post("/social-auth", socialAuth); // user login backend link
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);  // user getting user information backend link
userRouter.put("/update-user-password", isAuthenticated, updatePassword);  // user update password backend link
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture); // user change avatar backend link
userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-user",
  // isAuthenticated,
  // authorizRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  // isAuthenticated,
  // authorizRoles("admin"),
  deleteUser
);


userRouter.post("/create-req", isAuthenticated, createRequest);
userRouter.get("/get-reqs",
  isAuthenticated,
  getRequests);
userRouter.put("/update-req/:requestId",
  // isAuthenticated, 
  updateRequest);
userRouter.delete("/del-req/:requestId", isAuthenticated, deleteRequest);

userRouter.post("/create-compl", isAuthenticated, createComplaint);
userRouter.get("/get-compls/:userId",
  // isAuthenticated, // Ensure authentication middleware is in place
  getComplaints);
userRouter.get("/get-All-compls", isAuthenticated, getAllComplaints);
userRouter.put("/update-compl/:complaintId",
  // isAuthenticated,
  updateComplaint);
userRouter.delete("/del-compl/:complaintId", isAuthenticated, deleteComplaint);


userRouter.post("/create-bin",
  // isAuthenticated, 
  createBin);
userRouter.get("/get-bins", isAuthenticated, getBins);
userRouter.get("/get-bins/:userId", isAuthenticated, getBinsbyid);

userRouter.put("/update-bin/:binId",
  //  isAuthenticated,
  updateBin);
userRouter.delete("/del-bin/:binId",
  // isAuthenticated, 
  deleteBin);

//userRouter.put('/bins/:binId/status', isAuthenticated, updateBinStatus);
//userRouter.get('/bins/:binId/status-report', isAuthenticated, getBinStatusReport);

userRouter.post('/rc/:userId',isAuthenticated, createRequestController);
userRouter.get('/rc', 
  // isAuthenticated,
   getRequestsController);
userRouter.put('/rc/:requestId', 
  // isAuthenticated, 
  updateRequestController);
userRouter.delete('/rc/:requestId', isAuthenticated, deleteRequestController);


export default userRouter;
