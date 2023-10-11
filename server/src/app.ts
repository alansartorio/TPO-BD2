import express from "express";
import bodyParser from "body-parser";
import { pool } from "./db.js";
import { log } from "console";
import _ from "lodash";
import cors from "cors";
import { Client } from "pg";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Define las rutas de tu API aquí (clientes y productos).

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

type ClientRow = {
  nro_cliente: number;
  nombre: string;
  apellido: string;
  direccion: string;
  activo: number;
  codigo_area: number;
  nro_telefono: number;
  tipo: "F" | "M";
};

function unmapClients(rows: ClientRow[]): any[] {
  return Object.entries(_.groupBy(rows, ({ nro_cliente }) => nro_cliente)).map(
    ([nro_cliente, phones]) => ({
      nro_cliente,
      nombre: phones[0].nombre,
      apellido: phones[0].apellido,
      direccion: phones[0].direccion,
      activo: phones[0].activo,
      telefonos:
        phones[0].tipo == null
          ? []
          : phones.map((p) => ({
              tipo: p.tipo,
              nro_telefono: p.nro_telefono,
              codigo_area: p.codigo_area,
            })),
    })
  );
}

// Ruta para listar todos los clientes
app.get("/clientes", async (req, res) => {
  try {
    const { rows }: { rows: ClientRow[] } = await pool.query(
      "SELECT * FROM E01_CLIENTE c LEFT JOIN E01_TELEFONO t ON c.nro_cliente=t.nro_cliente"
    );
    res.json(unmapClients(rows));
  } catch (error) {
    console.error("Error al recuperar clientes", error);
    res.status(500).json({ error: "Error al recuperar clientes" });
  }
});

// Ruta para agregar cliente
app.post("/clientes", async (req, res) => {
  try {
    await pool.query("BEGIN");
    var clienteData = req.body;
    var telefonos = clienteData.telefonos;
    const {
      rows: [{ nuevo_nro }],
    } = await pool.query(
      "SELECT max(nro_cliente) + 1 as nuevo_nro FROM E01_CLIENTE"
    );

    log(nuevo_nro);

    // Inserta el cliente en la tabla E01_CLIENTE
    const { rows } = await pool.query(
      "INSERT INTO E01_CLIENTE (nro_cliente, nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4, $5) RETURNING nro_cliente",
      [
        nuevo_nro,
        clienteData.nombre,
        clienteData.apellido,
        clienteData.direccion,
        clienteData.activo,
      ]
    );
    const nro_cliente = rows[0].nro_cliente;

    for (let telefono of telefonos) {
      await pool.query(
        "INSERT INTO E01_TELEFONO (codigo_area, nro_telefono, tipo, nro_cliente) VALUES ($1, $2, $3, $4)",
        [
          telefono.codigo_area,
          telefono.nro_telefono,
          telefono.tipo,
          nro_cliente,
        ]
      );
    }
    await pool.query("COMMIT");
    res.status(201).json({ nro_cliente });
  } catch (error) {
    await pool.query("ROLLBACK");
    log(error);
    res.status(500).json({ error: "Error al insertar cliente" });
  }
});

// Ruta para obtener cliente
app.get("/clientes/:nro", async (req, res) => {
  try {
    const { rows }: { rows: ClientRow[] } = await pool.query(
      "SELECT * FROM E01_CLIENTE c LEFT JOIN E01_TELEFONO t ON c.nro_cliente=t.nro_cliente WHERE c.nro_cliente=$1",
      [req.params.nro]
    );
    const clients = unmapClients(rows);
    if (clients.length != 1) res.sendStatus(404);
    else res.json(clients[0]);
  } catch (error) {
    console.error("Error al recuperar cliente", error);
    res.status(500).json({ error: "Error al recuperar cliente" });
  }
});

// Ruta para actualizar cliente
app.put("/clientes/:nro", async (req, res) => {
  try {
    await pool.query("BEGIN");
    var clienteData = req.body;
    var telefonos = clienteData.telefonos;

    // Inserta el cliente en la tabla E01_CLIENTE
    await pool.query(
      "UPDATE E01_CLIENTE SET nombre=$2, apellido=$3, direccion=$4, activo=$5 WHERE nro_cliente=$1",
      [
        req.params.nro,
        clienteData.nombre,
        clienteData.apellido,
        clienteData.direccion,
        clienteData.activo,
      ]
    );

    await pool.query("DELETE FROM E01_TELEFONO WHERE nro_cliente=$1", [
      req.params.nro,
    ]);
    var test = await pool.query(
      "SELECT * FROM E01_TELEFONO WHERE nro_cliente=$1",
      [req.params.nro]
    );
    log(test.rows);
    for (let telefono of telefonos) {
      await pool.query(
        "INSERT INTO E01_TELEFONO (codigo_area, nro_telefono, tipo, nro_cliente) VALUES ($1, $2, $3, $4)",
        [
          telefono.codigo_area,
          telefono.nro_telefono,
          telefono.tipo,
          req.params.nro,
        ]
      );
    }
    await pool.query("COMMIT");
    res.sendStatus(200);
  } catch (error) {
    await pool.query("ROLLBACK");
    log(error);
    res.status(500).json({ error: "Error al insertar cliente" });
  }
});

// Ruta para eliminar cliente
app.delete("/clientes/:nro", async (req, res) => {
  try {
    await pool.query("BEGIN");
    await pool.query("DELETE FROM E01_TELEFONO WHERE nro_cliente=$1", [
      req.params.nro,
    ]);
    await pool.query(
      "DELETE FROM E01_DETALLE_FACTURA df WHERE df.nro_factura IN (SELECT f.nro_factura FROM E01_FACTURA f WHERE f.nro_cliente=$1)",
      [req.params.nro]
    );
    await pool.query("DELETE FROM E01_FACTURA WHERE nro_cliente=$1", [
      req.params.nro,
    ]);
    await pool.query("DELETE FROM E01_CLIENTE WHERE nro_cliente=$1", [
      req.params.nro,
    ]);
    await pool.query("COMMIT");
    res.sendStatus(204);
  } catch (error) {
    await pool.query("ROLLBACK");
    log(error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
});
