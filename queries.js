/* 1. Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”. */
db.clientes.find(
    { nombre: "Wanda", apellido: "Baker" },
    { _id: 1, "telefonos.codigo_area": 1, "telefonos.nro_telefono": 1 }
)

/* 2. Seleccionar todos los clientes que tengan registrada al menos una factura. */
db.clientes.find(
    { _id: { $in: db.facturas.distinct("nro_cliente") } },
    { telefonos: 0 }
)

/*3. Seleccionar todos los clientes que no tengan registrada una factura.*/
db.clientes.find(
    { _id: { $nin: db.facturas.distinct("nro_cliente") } },
    { telefonos: 0 }
)

/*4. Seleccionar los productos que han sido facturados al menos 1 vez.*/
db.productos.find(
    { _id: { $in: db.facturas.distinct("detalles.codigo_producto") } }
)

/*5. Seleccionar los datos de los clientes junto con sus teléfonos.*/
db.clientes.find({})