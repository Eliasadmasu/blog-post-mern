import express from "express";
import cors from "cors";
import "dotenv/config";
const app = express();
import { connectToDatabase } from "./config/db.js";
import { router } from "./routes/blogRoutes.js";
import cookieParser from "cookie-parser";

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

connectToDatabase();

app.use(express.static("public"));

app.use("/blog", router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is listening to PORT: ${port}`);
});
