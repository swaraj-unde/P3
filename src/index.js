import dotenv from "dotenv";
import express from "express";

dotenv.config({
    path: "./.env",
});

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("<p>Hello World!</p>");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
