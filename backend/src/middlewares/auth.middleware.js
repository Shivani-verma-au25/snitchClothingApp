import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import {config}from '../configrations/config.js'
import {User} from '../models/user.models.js'


export const isSellerAuthenticated = asyncHandler(
  async (req, res, next) => {

    const token =
      req.cookies?.snitch_token ||
      req.header("Authorization")?.replace("Bearer ", "")

    console.log("token:", token)

    if (!token) {
      return res.status(401).json(
        new ApiError(401, "Unauthorized user")
      )
    }

    try {
      const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET)

      const user = await User.findById(decodedToken?._id).select("-password")
        console.log("user" , user);
        
      if (!user) {
        return res.status(401).json(
          new ApiError(401, "User not found")
        )
      }

      if (user.role !== "seller") {
        return res.status(403).json(
          new ApiError(403,"Forbidden? You'r not allow to view this page.")
        )
      }

      req.user = user
      next()

    } catch (error) {
      console.log("error from middleware:", error)

      return res.status(401).json(
        new ApiError(401, "Invalid token")
      )
    }
  }
)
