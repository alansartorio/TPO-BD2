import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router as clientRouter } from "./clients.js";
import { router as productRouter } from "./products.js";
import { connectToDatabase } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Define las rutas de tu API aquí (clientes y productos).
app.use(clientRouter);
app.use(productRouter);

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Servidor en ejecución en el puerto ${port}`);
    });
});
