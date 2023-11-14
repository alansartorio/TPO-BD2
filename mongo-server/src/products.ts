import express from "express";
import { log } from "console";
import _ from "lodash";

export const router = express.Router();

// Ruta para listar todos los productos
router.get("/productos", async (req, res) => {
	try {
        // TODO
		//res.json(unmapProduct(rows));
	} catch (error) {
		console.error("Error al recuperar productos", error);
		res.status(500).json({ error: "Error al recuperar productos" });
	}
});

// Ruta para agregar producto
router.post("/productos", async (req, res) => {
	try {
        // TODO
		//res.status(201).json({ codigo_producto });
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al insertar producto" });
	}
});

// Ruta para obtener producto
router.get("/productos/:code", async (req, res) => {
	try {
        // TODO
		//if (products.length != 1) res.sendStatus(404);
		//else res.json(products[0]);
	} catch (error) {
		console.error("Error al recuperar producto", error);
		res.status(500).json({ error: "Error al recuperar producto" });
	}
});

// Ruta para actualizar producto
router.put("/productos/:code", async (req, res) => {
	try {
        // TODO
        res.sendStatus(200);
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al insertar producto" });
	}
});

// Ruta para eliminar producto
router.delete("/productos/:code", async (req, res) => {
	try {
        // TODO
		res.sendStatus(204);
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al eliminar producto" });
	}
});
