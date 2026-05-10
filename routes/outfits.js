const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

// @route   POST /api/outfits
// @desc    Creamos una nueva combinación (outfit)
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
// @desc    Obtenenemos todos los outfits con los detalles de cada prenda
router.get("/", async (req, res) => {
  try {
    const outfits = await Outfit.find().populate("prendas");
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener outfits" });
  }
});

// @route   GET /api/outfits/:id
// @desc    Obtenemos un outfit por ID con los detalles de cada prenda
router.get("/:id", async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate("prendas");
    if (!outfit) {
      return res.status(404).json({ mensaje: "Outfit no encontrado" });
    }
    res.json(outfit);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el outfit" });
  }
});

// @route   PUT /api/outfits/:id
// @desc    Actualizamos un outfit (nombre, descripción, prendas, favorito)
router.put("/:id", async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ mensaje: "Outfit no encontrado" });
    }

    const outfitActualizado = await Outfit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("prendas");

    res.json(outfitActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el outfit",
      error: error.message,
    });
  }
});

// @route   DELETE /api/outfits/:id
// @desc    Eliminar un outfit (no eliminamos las prendas, solo el conjunto)
router.delete("/:id", async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ mensaje: "Outfit no encontrado" });
    }

    await Outfit.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Outfit eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el outfit",
      error: error.message,
    });
  }
});

module.exports = router;
