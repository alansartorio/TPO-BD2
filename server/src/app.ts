import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {router as clientRouter} from "./clients.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Define las rutas de tu API aquí (clientes y productos).
app.use(clientRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

