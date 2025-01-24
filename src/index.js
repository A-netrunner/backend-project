import dotenv from "dotenv";

import connectDB from "./db/DB.js";

dotenv.config({
  path: "./.env",
});
connectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})

//routes 

// import userRouter from  "./routes/user.routes.js"

// app.use("/users",userRouter)
