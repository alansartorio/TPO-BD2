/* 1. Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”. */
db.clientes.find(
    { nombre: "Wanda", apellido: "Baker" },
    { _id: 1, "telefonos.codigo_area": 1, "telefonos.nro_telefono": 1 }
);

/* 2. Seleccionar todos los clientes que tengan registrada al menos una factura. */
db.clientes.find(
    { _id: { $in: db.facturas.distinct("nro_cliente") } },
    { telefonos: 0 }
);

/*3. Seleccionar todos los clientes que no tengan registrada una factura.*/
db.clientes.find(
    { _id: { $nin: db.facturas.distinct("nro_cliente") } },
    { telefonos: 0 }
);

/*4. Seleccionar los productos que han sido facturados al menos 1 vez.*/
db.productos.find(
    { _id: { $in: db.facturas.distinct("detalles.codigo_producto") } }
);

/*5. Seleccionar los datos de los clientes junto con sus teléfonos.*/
db.clientes.find({});

/*6. Devolver todos los clientes, con la cantidad de facturas que tienen registradas (admitir nulos en valores de Clientes).*/
db.clientes.aggregate([
    {
        $lookup: {
            from: "facturas",
            localField: "_id",
            foreignField: "nro_cliente",
            as: "facturas"
        }
    },
    {
        $project: {
            nombre: 1,
            apellido: 1,
            direccion: 1,
            activo: 1,
            cantidad_facturas: { $size: "$facturas" }
        }
    }
]);

/*7. Listar todas las Facturas que hayan sido compradas por el cliente de nombre "Pandora" y apellido "Tate".*/
db.facturas.find(
    { nro_cliente: db.clientes.findOne({ nombre: "Pandora", apellido: "Tate" })._id },
    { detalles: 0 }
);

/*8. Listar todas las Facturas que contengan productos de la marca “In Faucibus Inc.”*/
var productosIds = db.productos.find({ marca: "In Faucibus Inc." }, { _id: 1 }).toArray().map(p => p._id);
db.facturas.find(
    { "detalles.codigo_producto": { $in: productosIds } },
    { detalles: 0 }
);

/*9. Mostrar cada teléfono junto con los datos del cliente.*/
db.clientes.aggregate([
    {
        $unwind: "$telefonos"
    },
    {
        $project: {
            _id: 1,
            nombre: 1,
            apellido: 1,
            direccion: 1,
            activo: 1,
            telefono: "$telefonos"
        }
    }
]);

/*10. Mostrar nombre y apellido de cada cliente junto con lo que gastó en total (con IVA incluido).*/
db.clientes.aggregate([
    {
        $lookup: {
            from: "facturas",
            let: { clienteId: "$_id" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$nro_cliente", "$$clienteId"]
                        }
                    }
                }
            ],
            as: "facturas"
        }
    },
    {
        $unwind: {
            path: "$facturas",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: { _id: "$_id", nombre: "$nombre", apellido: "$apellido" },
            gasto_total_con_iva: { $sum: { $ifNull: ["$facturas.total_con_iva", 0] } }
        }
    },
    {
        $project: {
            _id: 0,
            nombre: "$_id.nombre",
            apellido: "$_id.apellido",
            gasto_total_con_iva: 1
        }
    }
]);

// VISTAS

/*1. Se debe realizar una vista que devuelva las facturas ordenadas por fecha.*/
db.createView("facturas_ordenadas", "facturas", [
    {
        $sort: { fecha: 1 }
    },
    {
        $project: { detalles: 0 }
    }
]);

/* 2. Se necesita una vista que devuelva todos los productos que aún no han sido facturados. */
db.createView("productos_no_facturados", "productos", [
    {
        $lookup: {
            from: "facturas",
            localField: "_id",
            foreignField: "detalles.codigo_producto",
            as: "facturas"
        }
    },
    {
        $match: {
            facturas: { $eq: [] }
        }
    }
]);
