import express from "express";
import { log } from "console";
import _ from "lodash";
import { collections, getNextSequence } from "./db.js";

export const router = express.Router();

function mapIdToNumber(obj: any) {
    obj.codigo_producto = obj._id;
    delete obj["_id"];
    return obj;
}

function mapNumberToId(obj: any) {
    obj._id = obj.codigo_producto;
    delete obj["codigo_producto"];
    return obj;
}

// Ruta para listar todos los productos
router.get("/productos", async (req, res) => {
    try {
        const products = await collections!.productos
            .find()
            .map(mapIdToNumber)
            .toArray();

        res.json(products);
    } catch (error) {
        console.error("Error al recuperar productos", error);
        res.status(500).json({ error: "Error al recuperar productos" });
    }
});

// Ruta para agregar producto
router.post("/productos", async (req, res) => {
    try {
        let _id = await getNextSequence("productos");
        const inserted = await collections!.productos.insertOne({
            _id,
            ...req.body,
        });
        res.status(201).json({ codigo_producto: inserted.insertedId });
    } catch (error) {
        log(error);
        res.status(500).json({ error: "Error al insertar producto" });
    }
});

// Ruta para obtener producto
router.get("/productos/:code", async (req, res) => {
    try {
        let product = await collections!.productos.findOne({
            _id: _.parseInt(req.params.code),
        });

        if (product !== null) res.json(mapIdToNumber(product));
        else res.sendStatus(404);
    } catch (error) {
        console.error("Error al recuperar producto", error);
        res.status(500).json({ error: "Error al recuperar producto" });
    }
});

// Ruta para actualizar producto
router.put("/productos/:code", async (req, res) => {
    try {
        let product = mapNumberToId(req.body);
        delete product["_id"];
        await collections!.productos.findOneAndUpdate(
            { _id: _.parseInt(req.params.code) },
            { $set: product }
        );
        res.sendStatus(200);
    } catch (error) {
        log(error);
        res.status(500).json({ error: "Error al insertar producto" });
    }
});

// Ruta para eliminar producto
router.delete("/productos/:code", async (req, res) => {
    try {
        await collections!.productos.deleteOne({ _id: _.parseInt(req.params.code) });
        res.sendStatus(204);
    } catch (error) {
        log(error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});
