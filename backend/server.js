const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/noteRoutes");
dotenv.config();
app.use(express.json());

const cors = require("cors");
app.use(cors());


mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log("Connected Successfully");
        app.listen(process.env.PORT || 8000, (err) => {
            if (err) console.log(err);
            console.log(`Running at port ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log("Failed to connect", error));

// Middleware
app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);
