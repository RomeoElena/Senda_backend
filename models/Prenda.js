const mongoose = require("mongoose");

const PrendaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  color: { type: String },
  marca: { type: String },
  imagen: { type: String },
  estado: {
    type: String,
    enum: ["nuevo", "usado", "donar", "reciclar"],
    default: "usado",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prenda", PrendaSchema);
