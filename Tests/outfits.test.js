const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let outfitId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// --- GET /api/outfits ---
describe("GET /api/outfits", () => {
  it("debe devolver un array con todos los outfits y código 200", async () => {
    const res = await request(app).get("/api/outfits");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// --- POST /api/outfits ---
describe("POST /api/outfits", () => {
  it("debe crear un outfit nuevo y devolver código 201", async () => {
    const res = await request(app).post("/api/outfits").send({
      nombre: "Outfit de test",
      descripcion: "Creado por Jest",
      prendas: [],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe("Outfit de test");
    expect(res.body.favorito).toBe(false);

    outfitId = res.body._id;
  });

  it("debe devolver error 400 si falta el campo nombre", async () => {
    const res = await request(app).post("/api/outfits").send({
      descripcion: "Sin nombre",
    });

    expect(res.statusCode).toBe(400);
  });
});

// --- GET /api/outfits/:id ---
describe("GET /api/outfits/:id", () => {
  it("debe devolver el outfit por ID con código 200", async () => {
    const res = await request(app).get(`/api/outfits/${outfitId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(outfitId);
  });

  it("debe devolver 404 si el outfit no existe", async () => {
    const res = await request(app).get("/api/outfits/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });
});

// --- PUT /api/outfits/:id ---
describe("PUT /api/outfits/:id", () => {
  it("debe actualizar el outfit y devolver código 200", async () => {
    const res = await request(app)
      .put(`/api/outfits/${outfitId}`)
      .send({ nombre: "Outfit actualizado", favorito: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Outfit actualizado");
    expect(res.body.favorito).toBe(true);
  });

  it("debe devolver 404 si el outfit no existe", async () => {
    const res = await request(app)
      .put("/api/outfits/000000000000000000000000")
      .send({ nombre: "No existe" });

    expect(res.statusCode).toBe(404);
  });
});

// --- DELETE /api/outfits/:id ---
describe("DELETE /api/outfits/:id", () => {
  it("debe eliminar el outfit creado en el test y devolver código 200", async () => {
    const res = await request(app).delete(`/api/outfits/${outfitId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe("Outfit eliminado correctamente");
  });

  it("debe devolver 404 si el outfit no existe", async () => {
    const res = await request(app).delete(
      "/api/outfits/000000000000000000000000",
    );
    expect(res.statusCode).toBe(404);
  });
});
