import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

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
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "10m",
      });
      //TODO refreshtoken generating
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "1d", //!changed time
        }
      );
      //TODO pass the refreshtoken to the cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ token, refreshToken, user });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//! test refresh token
//! test refresh token
//! test refresh token
const newRefreshTokenTest = (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  if (!cookies?.refreshToken)
    return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.refreshToken;
  console.log(refreshToken);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const foundUser = await UserModel.findOne({ username: decoded.username });

    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: "1m",
    });
    res.json({ accessToken, message: "Access token refreshed" });
  });
};

export { register, login, newRefreshTokenTest };
