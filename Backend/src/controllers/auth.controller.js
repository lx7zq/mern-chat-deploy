import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        if(newUser) {
            const token = generateToken(newUser._id, res); 
            await newUser.save(); 
            console.log(token);
            res.status(201).json({ _id:newUser._id, fullName:newUser.fullName, email:newUser.email, profilePic:newUser.profilePic });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While registering a new user" });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all required fields!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Password is not matched!" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error while signing in!" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0, sameSite: "none"});
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while logging out!" });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "Signout Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While signing out" });
    }
};

export const updateProfile = async (req, res) => {
    console.log("Request Body:", req.body);
  const { profilePic } = req.body;
  //console.log(profilePic);

  const userId = req.user._id;
  // console.log(req);

  try {
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }
    //console.log("profilepic");

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    //console.log(uploadResponse);

    if (!uploadResponse) {
      return res
        .status(500)
        .json({ message: "Error while uploading profile pic" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(200).json({ message: "Error while updating profile pic" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error While uploading profile pic" });
    console.log(error);
  }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While checking auth" });
    }
};
