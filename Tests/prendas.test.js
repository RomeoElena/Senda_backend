const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

// ID de una prenda existente en la base de datos de pruebas
let prendaId;

// Conectar a la base de datos antes de todos los tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Cerrar la conexión después de todos los tests
afterAll(async () => {
  await mongoose.connection.close();
});

// --- GET /api/prendas ---
describe("GET /api/prendas", () => {
  it("debe devolver un array con todas las prendas y código 200", async () => {
    const res = await request(app).get("/api/prendas");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debe filtrar prendas por estado", async () => {
    const res = await request(app).get("/api/prendas?estado=usado");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((prenda) => {
      expect(prenda.estado).toBe("usado");
    });
  });
});

// --- POST /api/prendas ---
describe("POST /api/prendas", () => {
  it("debe crear una prenda nueva y devolver código 201", async () => {
    const res = await request(app)
      .post("/api/prendas")
      .field("nombre", "Camiseta de test")
      .field("tipo", "Superior")
      .field("color", "blanco")
      .field("estado", "nuevo");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.nombre).toBe("Camiseta de test");
    expect(res.body.estado).toBe("nuevo");

    // Guardamos el ID para usarlo en PUT y DELETE
    prendaId = res.body._id;
  });

  it("debe devolver error 400 si falta el campo nombre", async () => {
    const res = await request(app)
      .post("/api/prendas")
      .field("tipo", "Superior");

    expect(res.statusCode).toBe(400);
  });
});

// --- PUT /api/prendas/:id ---
describe("PUT /api/prendas/:id", () => {
  it("debe actualizar el estado de una prenda y devolver código 200", async () => {
    const res = await request(app)
      .put(`/api/prendas/${prendaId}`)
      .send({ estado: "donar" });

    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe("donar");
  });

  it("debe devolver 404 si la prenda no existe", async () => {
    const res = await request(app)
      .put("/api/prendas/000000000000000000000000")
      .send({ estado: "donar" });

    expect(res.statusCode).toBe(404);
  });
});

// --- DELETE /api/prendas/:id ---
describe("DELETE /api/prendas/:id", () => {
  it("debe eliminar la prenda creada en el test y devolver código 200", async () => {
    const res = await request(app).delete(`/api/prendas/${prendaId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe("Prenda eliminada correctamente");
  });

  it("debe devolver 404 si la prenda no existe", async () => {
    const res = await request(app).delete(
      "/api/prendas/000000000000000000000000",
    );
    expect(res.statusCode).toBe(404);
  });
});
