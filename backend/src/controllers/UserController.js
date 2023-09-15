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

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "1h",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({ token, user });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  console.log({ refreshToken });
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userId = decoded.userId;

    // Generate a new access token
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: "1h",
    });

    // Send the new access token to the client
    res.status(200).json({ token });
  });
};

export { register, login, refreshToken };
