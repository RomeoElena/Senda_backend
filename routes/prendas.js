const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Prenda = require("../models/Prenda");
const uploadCloud = require("../config/cloudinary");

// @route   POST /api/prendas
// @desc    Añadir una nueva prenda con imagen
router.post("/", uploadCloud.single("imagen"), async (req, res) => {
  try {
    const { nombre, tipo, color, marca, estado } = req.body;
    const imagenUrl = req.file
      ? req.file.path
      : "https://via.placeholder.com/150";

    const nuevaPrenda = new Prenda({
      nombre,
      tipo,
      color,
      marca,
      estado,
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
// @desc    Obtener todas las prendas (con filtros opcionales por query params)
// @example GET /api/prendas?estado=donar&tipo=Camiseta
router.get("/", async (req, res) => {
  try {
    const filtro = {};

    if (req.query.estado) filtro.estado = req.query.estado;
    if (req.query.tipo) filtro.tipo = req.query.tipo;
    if (req.query.color) filtro.color = req.query.color;

    const prendas = await Prenda.find(filtro);
    res.json(prendas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las prendas" });
  }
});

// @route   GET /api/prendas/:id
// @desc    Obtener una prenda por ID
router.get("/:id", async (req, res) => {
  try {
    const prenda = await Prenda.findById(req.params.id);
    if (!prenda) {
      return res.status(404).json({ mensaje: "Prenda no encontrada" });
    }
    res.json(prenda);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la prenda" });
  }
});

// @route   PUT /api/prendas/:id
// @desc    Actualizar una prenda (puede incluir nueva imagen)
router.put("/:id", uploadCloud.single("imagen"), async (req, res) => {
  try {
    const prenda = await Prenda.findById(req.params.id);
    if (!prenda) {
      return res.status(404).json({ mensaje: "Prenda no encontrada" });
    }

    // Si se sube una nueva imagen, borrar la anterior de Cloudinary
    if (req.file) {
      const publicIdAnterior = extraerPublicId(prenda.imagen);
      if (publicIdAnterior) {
        await cloudinary.uploader.destroy(publicIdAnterior);
      }
    }

    const datosActualizados = {
      ...req.body,
      ...(req.file && { imagen: req.file.path }),
    };

    const prendaActualizada = await Prenda.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { returnDocument: "after", runValidators: true },
    );

    res.json(prendaActualizada);
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(400).json({
      mensaje: "Error al actualizar la prenda",
      error: error.message,
    });
  }
});

// @route   DELETE /api/prendas/:id
// @desc    Eliminar una prenda y su imagen de Cloudinary
router.delete("/:id", async (req, res) => {
  try {
    const prenda = await Prenda.findById(req.params.id);
    if (!prenda) {
      return res.status(404).json({ mensaje: "Prenda no encontrada" });
    }

    // Borrar imagen de Cloudinary si existe y no es el placeholder
    const publicId = extraerPublicId(prenda.imagen);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Prenda.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Prenda eliminada correctamente" });
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({
      mensaje: "Error al eliminar la prenda",
      error: error.message,
    });
  }
});

// Helper:
// Extraemos el public_id de Cloudinary a partir de la URL almacenada

function extraerPublicId(url) {
  if (!url || url.includes("placeholder.com")) return null;
  try {
    const partes = url.split("/upload/");
    if (partes.length < 2) return null;
    const sinVersion = partes[1].replace(/^v\d+\//, "");
    return sinVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

module.exports = router;
