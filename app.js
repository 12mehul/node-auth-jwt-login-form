const connectToDB = require("./db/connection");
const express = require("express");
const app = express();
const nodes = require("./routes/employees.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = 3003;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"],
    methods: ["GET","POST", "PUT", "DELETE"]
}))


app.get("/node", (req,res) => res.send("Hello"));
app.use("/api/employees", nodes);




const startConnection = async () => {
    try {
        await connectToDB(process.env.MONGO_URL);
        app.listen(port, () => 
        console.log(`Example app listening on port ${port}!`));
    }
    catch (err) {
        console.log(err);
    }
};
startConnection();