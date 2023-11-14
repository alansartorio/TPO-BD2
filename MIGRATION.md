Exportamos de postgres a json:

```postgresql
COPY (
    select array_to_json(array_agg(json))
    from (select row_to_json(p) as json
          from (select codigo_producto as _id, marca, nombre, descripcion, precio, stock
                from e01_producto) p) j
    ) TO '/tmp/productos.json' WITH (FORMAT text, HEADER FALSE);

COPY (
    select array_to_json(array_agg(json))
    from (select row_to_json(c) as json
          from (select nro_cliente                                    as _id,
                       nombre,
                       apellido,
                       direccion,
                       activo,
                       (SELECT coalesce(array_to_json(array_agg(t)), '[]'::json)
                        from (select t.codigo_area, t.nro_telefono, t.tipo
                              from e01_telefono t
                              where t.nro_cliente = c.nro_cliente) t) as telefonos
                from e01_cliente c) c) j
    ) TO '/tmp/clientes.json' WITH (FORMAT text, HEADER FALSE);

COPY (
    select array_to_json(array_agg(json))
    from (select row_to_json(f) as json
          from (select nro_factura                                     as _id,
                       fecha,
                       total_sin_iva,
                       iva,
                       total_con_iva,
                       nro_cliente,
                       (SELECT coalesce(array_to_json(array_agg(t)), '[]'::json)
                        from (select df.codigo_producto, df.cantidad, df.nro_item
                              from e01_detalle_factura df
                              where df.nro_factura = f.nro_factura) t) as detalles
                from e01_factura f) f) j
    ) TO '/tmp/facturas.json' WITH (FORMAT text, HEADER FALSE);
```

Copiamos products entre containers:

```sh
docker cp postgres-bd2:/tmp/productos.json ./productos.json
docker cp postgres-bd2:/tmp/clientes.json ./clientes.json
docker cp postgres-bd2:/tmp/facturas.json ./facturas.json

docker cp productos.json mongo-bd2:/tmp/productos.json
docker cp clientes.json mongo-bd2:/tmp/clientes.json
docker cp facturas.json mongo-bd2:/tmp/facturas.json
```

Importamos el json en mongo

```sh
docker exec mongo-bd2 mongoimport -h localhost:27017 -d admin -u mongo -p docker --collection productos --jsonArray /tmp/productos.json
docker exec mongo-bd2 mongoimport -h localhost:27017 -d admin -u mongo -p docker --collection clientes --jsonArray /tmp/clientes.json
docker exec mongo-bd2 mongoimport -h localhost:27017 -d admin -u mongo -p docker --collection facturas --jsonArray /tmp/facturas.json
```

```sh
docker exec -i mongo-bd2 mongosh admin -u mongo -p docker <<"EOM"
{
    db.facturas.find()
        .forEach(function(doc) {
            db.facturas.updateOne(
                {"_id": doc._id},
                {"$set": {"fecha": new Date(doc.fecha)}}
            );
        });
}
EOM
```