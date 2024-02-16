import { RegisterVal } from "../utils/validation/auth.js";
import UserModel from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
// import { sign } from "jsonwebtoken";
import pkg from "jsonwebtoken";
const { sign } = pkg;

export const test = (req, res) => {
  res.json("test is working");
};

export const registerUsers = async (req, res) => {
  // res.json({ bode: req.body });
  try {
    const { name, email, password } = req.body;
    // check if request is empty
    const check = RegisterVal.safeParse({ name, email, password });

    if (check?.success) {
      const exist = await UserModel?.findOne({ email });
      if (!exist) {
        const user = await UserModel.create({
          name,
          email,
          password: await hashPassword(password),
        });
        return res?.json({ success: req.body }); // user = await user?.save();
      }
      return res?.json("already signed up");
    }

    const error = check?.error?.issues?.map((value) => {
      const obj = {};
      obj[value?.path[0]] = value?.message;
      return obj;
    });
    return res?.json({ error: error });
  } catch (error) {
    console.log(error);
    // return res?.json({ error: "no" });
  }
};

export const loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if user exists
    const user = await UserModel?.findOne({ email });
    // return res.json(user);
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }

    const match = await comparePassword(password, user?.password);

    if (!match) {
      return res?.json("passwords does not match");
    }
    return (
      res
        .status(201)
        // .cookie("token", await generateToken(user?._id))
        .json({
          token: await generateToken(user?._id),
          user: {
            id: user?._id,
            name: user?.name,
            email: user?.email,
          },
        })
    );
    // function token() {
    //   return new Promise((resolve, reject) => {
    //     jwt.sign(
    //       { email: user?.email, id: user?._id, name: user?.name },
    //       process.env.Jwt_Secret,
    //       { expiresIn: "1m" },
    //       (err, token) => {
    //         if (err) reject(err);
    //         else resolve(token);
    //       }
    //     );
    //   });
    // }

    // res.cookie("token", token).json(user);
    // return res.json(match);
  } catch (error) {
    console.log(error);
    return res.json("error");
  }
};

const generateToken = (id) => {
  return sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const update = async (req, res) => {
  // res.json(req.user);
  if (!req.user) {
    res.status(400);
    throw new Error("user not found");
  }
  const user = await UserModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  await user.save();
  return res.json(user);
};
