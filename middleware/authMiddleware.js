import jwt from "jsonwebtoken";
// const { verify } = pkg;
import UserModel from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;
  //   res.json(req.headers.authorization.startsWith("Bearer"));
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //   res.json(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
