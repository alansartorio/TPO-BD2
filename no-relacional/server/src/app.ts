import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router as clientRouter } from "./clients.js";
import { router as productRouter } from "./products.js";
import { connectToDatabase } from "./db.js";
import * as OpenApiValidator from "express-openapi-validator";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
    OpenApiValidator.middleware({
        apiSpec: "../../api.yaml",
        validateResponses: true, // false by default
    })
);
app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

// Define las rutas de tu API aquí (clientes y productos).
app.use(clientRouter);
app.use(productRouter);

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Servidor en ejecución en el puerto ${port}`);
    });
});
