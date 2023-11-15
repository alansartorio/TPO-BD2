import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export type CounterDocument = {
    _id: string;
    seq: number;
};
export type ClientDocument = {
    _id: number;
    nombre: string;
    apellido: string;
    direccion: string;
    activo: number;
    telefonos: {
        tipo: "F" | "M";
        nro_telefono: number;
        codigo_area: number;
    }[];
};
export type ProductDocument = {
    _id: number;
    marca: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
};
export type BillDocument = {
    _id: number;
    fecha: Date;
    total_sin_iva: number;
    iva: number;
    total_con_iva: number;
    nro_cliente: number;
    detalles: {
        codigo_producto: number;
        cantidad: number;
        nro_item: number;
    }[];
};

export var collections:
    | {
        clientes: mongoDB.Collection<ClientDocument>;
        productos: mongoDB.Collection<ProductDocument>;
        facturas: mongoDB.Collection;
        counters: mongoDB.Collection<CounterDocument>;
    }
    | undefined = undefined;

export async function connectToDatabase() {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
        process.env.DB_CONN_STRING!
    );

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    collections = {
        clientes: db.collection("clientes"),
        productos: db.collection("productos"),
        facturas: db.collection("facturas"),
        counters: db.collection("counters"),
    };
}

export async function getNextSequence(name: string) {
    var ret = await collections!.counters.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: "after" }
    );

    return ret!.seq;
}
