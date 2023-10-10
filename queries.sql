/* 1. Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”. */
SELECT t.codigo_area, t.nro_telefono, c.nro_cliente
FROM E01_TELEFONO t
         INNER JOIN E01_CLIENTE c ON t.nro_cliente = c.nro_cliente
WHERE c.nombre = 'Wanda' AND c.apellido = 'Baker';

/*2. Seleccionar todos los clientes que tengan registrada al menos una factura.*/
SELECT * FROM E01_CLIENTE c
WHERE EXISTS (
    SELECT 1
    FROM E01_FACTURA f
    WHERE c.nro_cliente = f.nro_cliente
);

/*3. Seleccionar todos los clientes que no tengan registrada una factura.*/
SELECT * FROM E01_CLIENTE c
WHERE NOT EXISTS (
    SELECT 1
    FROM E01_FACTURA f
    WHERE c.nro_cliente = f.nro_cliente
);

/*4. Seleccionar los productos que han sido facturados al menos 1 vez.*/
SELECT * FROM E01_PRODUCTO p
WHERE EXISTS (
    SELECT 1
    FROM E01_DETALLE_FACTURA df
    WHERE p.codigo_producto = df.codigo_producto
);

/*5. Seleccionar los datos de los clientes junto con sus teléfonos.*/
SELECT * FROM E01_CLIENTE c
    LEFT JOIN E01_TELEFONO t ON c.nro_cliente = t.nro_cliente;


/*6. Devolver todos los clientes, con la cantidad de facturas que tienen registradas (admitir nulos en valores de Clientes).*/
SELECT c.*, COUNT(f.nro_factura) AS cantidad_facturas
FROM E01_CLIENTE c
         LEFT JOIN E01_FACTURA f ON c.nro_cliente = f.nro_cliente
GROUP BY c.nro_cliente, c.nombre, c.apellido, c.direccion, c.activo;

/*7. Listar todas las Facturas que hayan sido compradas por el cliente de nombre "Pandora" y apellido "Tate".*/
SELECT f.* FROM E01_FACTURA f
         INNER JOIN E01_CLIENTE c ON f.nro_cliente = c.nro_cliente
WHERE c.nombre = 'Pandora' AND c.apellido = 'Tate';

/*8. Listar todas las Facturas que contengan productos de la marca “In Faucibus Inc.”*/
SELECT f.* FROM E01_FACTURA f
    INNER JOIN E01_DETALLE_FACTURA df ON f.nro_factura = df.nro_factura
    INNER JOIN E01_PRODUCTO p ON df.codigo_producto = p.codigo_producto
WHERE p.marca = 'In Faucibus Inc.';

/*9. Mostrar cada teléfono junto con los datos del cliente.*/
SELECT t.*, c.nombre, c.apellido, c.direccion, c.activo
FROM E01_TELEFONO t
         INNER JOIN E01_CLIENTE c ON t.nro_cliente = c.nro_cliente;


/*10. Mostrar nombre y apellido de cada cliente junto con lo que gastó en total (con IVA
incluido).*/
SELECT c.nombre, c.apellido, SUM(f.total_con_iva) AS gasto_total_con_iva
FROM E01_CLIENTE c
         LEFT JOIN E01_FACTURA f ON c.nro_cliente = f.nro_cliente
GROUP BY c.nombre, c.apellido;

--VISTAS

/*1. Se debe realizar una vista que devuelva las facturas ordenadas por fecha.*/
CREATE VIEW FacturasOrdenadas AS
SELECT *
FROM E01_FACTURA
ORDER BY fecha;

/* 2. Se necesita una vista que devuelva todos los productos que aún no han sido facturados. */
CREATE VIEW ProductosNoFacturados AS
SELECT *
FROM E01_PRODUCTO p
    WHERE p.codigo_producto NOT IN (
        SELECT codigo_producto FROM E01_DETALLE_FACTURA
        );
