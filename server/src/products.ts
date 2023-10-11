import express from "express";
import { pool } from "./db.js";
import { log } from "console";
import _ from "lodash";

export const router = express.Router();

type ProductRow = {
	codigo_producto: number;
	marca: string;
	nombre: string;
	descripcion: string;
	precio: number;
	stock: number;
};

type Product = ProductRow;

function unmapProduct(rows: ProductRow[]): Product[] {
	return rows;
}

// Ruta para listar todos los productos
router.get("/productos", async (req, res) => {
	try {
		const { rows }: { rows: ProductRow[] } = await pool.query(
			"SELECT * FROM E01_PRODUCTO",
		);
		res.json(unmapProduct(rows));
	} catch (error) {
		console.error("Error al recuperar productos", error);
		res.status(500).json({ error: "Error al recuperar productos" });
	}
});

// Ruta para agregar producto
router.post("/productos", async (req, res) => {
	try {
		await pool.query("BEGIN");
		var productData = req.body as Product;
		const {
			rows: [{ nuevo_codigo }],
		} = await pool.query(
			"SELECT max(codigo_producto) + 1 as nuevo_codigo FROM E01_PRODUCTO",
		);

		// Inserta el producto en la tabla E01_PRODUCTO
		const { rows } = await pool.query(
			"INSERT INTO E01_PRODUCTO (codigo_producto, marca, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING codigo_producto",
			[
				nuevo_codigo,
				productData.marca,
				productData.nombre,
				productData.descripcion,
				productData.precio,
				productData.stock,
			],
		);
		const codigo_producto = rows[0].codigo_producto;

		await pool.query("COMMIT");
		res.status(201).json({ codigo_producto });
	} catch (error) {
		await pool.query("ROLLBACK");
		log(error);
		res.status(500).json({ error: "Error al insertar producto" });
	}
});

// Ruta para obtener producto
router.get("/productos/:code", async (req, res) => {
	try {
		const { rows }: { rows: ProductRow[] } = await pool.query(
			"SELECT * FROM E01_PRODUCTO WHERE codigo_producto=$1",
			[req.params.code],
		);
		const products = unmapProduct(rows);
		if (products.length != 1) res.sendStatus(404);
		else res.json(products[0]);
	} catch (error) {
		console.error("Error al recuperar producto", error);
		res.status(500).json({ error: "Error al recuperar producto" });
	}
});

// Ruta para actualizar producto
router.put("/productos/:code", async (req, res) => {
	try {
		await pool.query("BEGIN");
		var productoData = req.body as Product;

		// Inserta el producto en la tabla E01_PRODUCTO
		await pool.query(
			"UPDATE E01_PRODUCTO SET marca=$2, nombre=$3, descripcion=$4, precio=$5, stock=$6 WHERE codigo_producto=$1",
			[
				req.params.code,
				productoData.marca,
				productoData.nombre,
				productoData.descripcion,
				productoData.precio,
				productoData.stock,
			],
		);

		await pool.query("COMMIT");
		res.sendStatus(200);
	} catch (error) {
		await pool.query("ROLLBACK");
		log(error);
		res.status(500).json({ error: "Error al insertar producto" });
	}
});

// Ruta para eliminar producto
router.delete("/productos/:code", async (req, res) => {
	try {
		await pool.query("BEGIN");
		await pool.query(
			"DELETE FROM E01_DETALLE_FACTURA df WHERE df.codigo_producto=$1",
			[req.params.code],
		);
		await pool.query("DELETE FROM E01_PRODUCTO WHERE codigo_producto=$1", [
			req.params.code,
		]);
		await pool.query("COMMIT");
		res.sendStatus(204);
	} catch (error) {
		await pool.query("ROLLBACK");
		log(error);
		res.status(500).json({ error: "Error al eliminar producto" });
	}
});
