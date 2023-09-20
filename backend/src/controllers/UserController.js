import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/token.config.js";

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExist = await UserModel.findOne({ username });
    if (userExist) {
      return res.status(401).json({ message: "Username already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        password: hashedPassword,
      });

      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  try {
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      //TODO access token ==token
      const token = generateAccessToken(user);
      //TODO refreshtoken generating
      const refreshToken = generateRefreshToken(user);

      res.status(200).json({ token, refreshToken, user });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? @ route POST /blog/refresh
//? @ public
const newRefreshTokenTest = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Unauthorized refeshToken" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    try {
      const User = await UserModel.findById(decoded.userId).exec();
      if (!User) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = generateAccessToken(User);
      console.log({ "new accesstoken generated": accessToken });
      res.json({ accessToken, message: "Access token refreshed", User });
    } catch (error) {
      console.error(error);
    }
  });
};

export { register, login, newRefreshTokenTest };
