import dotenv from "dotenv";

import connectDB from "./db/DB.js";

dotenv.config({
  path: "./.env",
});
connectDB();

//const app = express();
// //if ease
// (async () => {
//   try {
//     mongoos.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
//     app.on("error", (error) => {
//       console.log("Error connecting to the server", error);
//     })
// app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });

//   } catch (error) {
//     console.error("ERROR", error);
//     throw error;
//   }
// })();
