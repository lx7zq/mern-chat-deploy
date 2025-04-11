import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.router.js";
import {app, server} from "./lib/socket.js"
import messageRouter from "./routes/message.router.js"
import friendRouter from "./routes/friend.router.js"

dotenv.config();

const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get("/", (req, res) => {
  res.send("h1>Restfull Service for Mern chat Project</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friend", friendRouter);

server.listen(PORT, () => {
  console.log("Server is running on port HTTP://localhost:" + PORT);
  connectDB();
});
