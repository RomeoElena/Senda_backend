const express = require("express");
const router = express.Router();
const Prenda = require("../models/Prenda");
const uploadCloud = require("../config/cloudinary");

// @route   POST /api/prendas
// @desc    Añadir una nueva prenda al armario con subida de imagen
// uploadCloud.single('imagen') para procesar un solo archivo del campo 'imagen'
router.post("/", uploadCloud.single("imagen"), async (req, res) => {
  try {
    const { nombre, tipo, color, marca } = req.body;
    const imagenUrl = req.file
      ? req.file.path
      : "https://via.placeholder.com/150";

    const nuevaPrenda = new Prenda({
      nombre,
      tipo,
      color,
      marca,
      imagen: imagenUrl,
    });

    const prendaGuardada = await nuevaPrenda.save();
    res.status(201).json(prendaGuardada);
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(400).json({
      mensaje: "Error al guardar la prenda con imagen",
      error: error.message,
    });
  }
});

// @route   GET /api/prendas
// @desc    Obtener todas las prendas del armario
router.get("/", async (req, res) => {
  try {
    const prendas = await Prenda.find();
    res.json(prendas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las prendas" });
  }
});

module.exports = router;
