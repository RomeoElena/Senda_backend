require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const prendasRoutes = require("./routes/prendas");

const app = express();

// Conexión con la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/prendas", prendasRoutes);

// Ruta de prueba
app.get("/", (req, res) => res.send("API de Senda funcionando"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
