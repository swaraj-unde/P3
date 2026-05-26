import dotenv from "dotenv";
import express from "express";

dotenv.config({
    path: "./.env",
});

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
});
