require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prendasRoutes = require("./routes/prendas");
const outfitsRoutes = require("./routes/outfits");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/prendas", prendasRoutes);
app.use("/api/outfits", outfitsRoutes);

app.get("/", (req, res) => res.send("API de Senda funcionando"));

module.exports = app;
