import express from "express";
import { log } from "console";
import _ from "lodash";
import { collections, getNextSequence } from "./db.js";

export const router = express.Router();

function mapIdToNumber(obj: any) {
    obj.nro_cliente = obj._id;
    delete obj["_id"];
    return obj;
}

function mapNumberToId(obj: any) {
    obj._id = obj.nro_cliente;
    delete obj["nro_cliente"];
    return obj;
}

// Ruta para listar todos los clientes
router.get("/clientes", async (req, res) => {
    try {
        const clients = await collections!.clientes
            .find()
            .map(mapIdToNumber)
            .toArray();

        res.json(clients);
    } catch (error) {
        console.error("Error al recuperar clientes", error);
        res.status(500).json({ error: "Error al recuperar clientes" });
    }
});

// Ruta para agregar cliente
router.post("/clientes", async (req, res) => {
    try {
        let _id = await getNextSequence("clientes");
        const inserted = await collections!.clientes.insertOne({
            _id,
            ...req.body,
        });
        res.status(201).json({ nro_cliente: inserted.insertedId });
    } catch (error) {
        log(error);
        res.status(500).json({ error: "Error al insertar cliente" });
    }
});

// Ruta para obtener cliente
router.get("/clientes/:nro", async (req, res) => {
    try {
        let client = await collections!.clientes.findOne({ _id: _.parseInt(req.params.nro) });
        log(client);

        if (client !== null) res.json(mapIdToNumber(client));
        else res.sendStatus(404);
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
