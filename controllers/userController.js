import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { userModel } from "../models/user.js";


const createtoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
    });
};

const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const Registeruser = await userModel.findOne({ name });
        if (!Registeruser) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const isMatch = await bcrypt.compare(password, Registeruser.password);
        if (isMatch) {
            const token = createtoken(Registeruser._id);
            return res.status(200).json({ token, user: { name: Registeruser?.name, userType: Registeruser?.userType }, success: true, message: "logged in successfully" });
        } else {
            return res.status(400).json({ message: "Invalid password", success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Server error", success: false });
    }
};

const register = async (req, res) => {
  try {
    const { name, password, userType } = req?.body;
 
    const Registeruser = await userModel.findOne({ name });
    if (Registeruser) {
      return res.status(400).json({ message: "Name already registered", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, password: hashedPassword, userType });
    await newUser.save();
    const token = createtoken(newUser._id);

    return res.status(200).json({ token, user: { name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }, success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Server error", success: false });
  }
};
export { login, register }