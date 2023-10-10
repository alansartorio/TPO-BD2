import * as express from "express";
import * as bodyParser from "body-parser";
import * as pool from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define las rutas de tu API aquí (clientes y productos).

app.listen(port, () => {
	console.log(`Servidor en ejecución en el puerto ${port}`);
});

// Ruta para listar todos los clientes
app.get("/clientes", async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM E01_CLIENTE");
		res.json(rows);
	} catch (error) {
		console.error("Error al recuperar clientes", error);
		res.status(500).json({ error: "Error al recuperar clientes" });
	}
});
