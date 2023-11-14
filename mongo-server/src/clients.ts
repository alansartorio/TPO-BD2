import express from "express";
import { log } from "console";
import _ from "lodash";

export const router = express.Router();

// Ruta para listar todos los clientes
router.get("/clientes", async (req, res) => {
	try {
        // TODO
		//res.json(clients);
	} catch (error) {
		console.error("Error al recuperar clientes", error);
		res.status(500).json({ error: "Error al recuperar clientes" });
	}
});

// Ruta para agregar cliente
router.post("/clientes", async (req, res) => {
	try {
        // TODO
		//res.status(201).json({ nro_cliente });
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al insertar cliente" });
	}
});

// Ruta para obtener cliente
router.get("/clientes/:nro", async (req, res) => {
	try {
        // TODO
		//if (clients.length != 1) res.sendStatus(404);
		//else res.json(clients[0]);
	} catch (error) {
		console.error("Error al recuperar cliente", error);
		res.status(500).json({ error: "Error al recuperar cliente" });
	}
});

// Ruta para actualizar cliente
router.put("/clientes/:nro", async (req, res) => {
	try {
        // TODO
		res.sendStatus(200);
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al insertar cliente" });
	}
});

// Ruta para eliminar cliente
router.delete("/clientes/:nro", async (req, res) => {
	try {
        // TODO
		res.sendStatus(204);
	} catch (error) {
		log(error);
		res.status(500).json({ error: "Error al eliminar cliente" });
	}
});
