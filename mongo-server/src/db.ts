import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export var collections:
    | {
        clientes: mongoDB.Collection;
        productos: mongoDB.Collection;
        facturas: mongoDB.Collection;
        counters: mongoDB.Collection;
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
