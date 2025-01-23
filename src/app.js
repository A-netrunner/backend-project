import express from "express";
import cors from "cors";
import cockie from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true,
  })
)

app.use(
  express.json({
    limit: "30mb",
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(cockie());

//routes

import userRouter from "./routes/user.routes.js";

app.use("/users", userRouter);

export {app}
