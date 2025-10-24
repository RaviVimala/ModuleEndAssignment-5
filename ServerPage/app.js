import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authorityRoute from "./routes/authorityRoute.js";
import taskRoute from "./routes/taskRoute.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/authority", authorityRoute);
app.use("/api/tasks", taskRoute);

//Connection Mongo DB
mongoose.connect('mongodb://localhost:27017/Module5')
.then(() => console.log('Mongo DB Connected'))
.catch(err => console.log('Mongo DB connection error : ', err));

app.get('/', (req, res) => {
res.json("Server is Running");
});
const PORT = 4000 || 5000;
app.listen(PORT, () => {
    console.log(`Server is Running on Port No : ${PORT}`);
});