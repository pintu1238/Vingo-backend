// import express from "express"
// import dotenv from "dotenv"
// dotenv.config()
// import connectDb from "./config/db.js"
// import cookieParser from "cookie-parser"
// import authRouter from "./routes/auth.routes.js"
// import cors from "cors"
// import userRouter from "./routes/user.routes.js"

// import itemRouter from "./routes/item.routes.js"
// import shopRouter from "./routes/shop.routes.js"
// import orderRouter from "./routes/order.routes.js"
// import http from "http"
// import { Server } from "socket.io"
// import { socketHandler } from "./socket.js"

// const app=express()
// const server=http.createServer(app)

// const io=new Server(server,{
//    cors:{
//     origin:"http://localhost:5173",
//     credentials:true,
//     methods:['POST','GET']
// }
// })

// app.set("io",io)



// const port=process.env.PORT || 5000
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))
// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth",authRouter)
// app.use("/api/user",userRouter)
// app.use("/api/shop",shopRouter)
// app.use("/api/item",itemRouter)
// app.use("/api/order",orderRouter)

// socketHandler(io)
// server.listen(port,()=>{
//     connectDb()
//     console.log(`server started at ${port}`)
// })

import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

dotenv.config();

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// ✅ Initialize MongoDB connection
connectDb();

// ✅ Socket.io Setup (only for local or production with server)
if (process.env.NODE_ENV !== "production") {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["POST", "GET"],
    },
  });

  app.set("io", io);
  socketHandler(io);

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 Server running locally on port ${port}`);
  });
} else {
  // ✅ For Vercel (Serverless)
  console.log("🚀 Backend deployed on Vercel Serverless Function");
}

export default app;
