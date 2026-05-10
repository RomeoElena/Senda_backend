const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

// @route   POST /api/outfits
// @desc    Crear una nueva combinación (outfit)
router.post("/", async (req, res) => {
  try {
    const nuevoOutfit = new Outfit(req.body);
    const outfitGuardado = await nuevoOutfit.save();
    res.status(201).json(outfitGuardado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear el outfit", error: error.message });
  }
});

// @route   GET /api/outfits
// @desc    Obtener todos los outfits (con los detalles de cada prenda)
router.get("/", async (req, res) => {
  try {
    // El .populate('prendas') es lo que trae la info real de la ropa, no solo el ID
    const outfits = await Outfit.find().populate("prendas");
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener outfits" });
  }
});

module.exports = router;
