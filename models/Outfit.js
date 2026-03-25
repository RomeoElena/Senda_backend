const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  prendas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prenda",
    },
  ],
  favorito: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Outfit", OutfitSchema);
