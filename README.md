# TPO - Base de Datos II

## Grupo 10

| Integrante          | Legajo |
|---------------------|--------|
| Sartorio, Alan      | 61379  |
| Digon, Lucía        | 59030  |
| Diaz Kralj, Luciana | 60495  |

## Relacional (PostgreSQL)

### Consultas y Vistas

Las consultas se encuentran en el archivo `relacional/queries.sql`

### Instrucciones para correr servidor de API
#### 1) Preparar servidor de API

```
cd relacional/server
npm i
npm run build
```

#### 2) Correr servidor de API

Cambiar las variables de entorno dependiendo de como corre la base de datos:

```
PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=docker \
PGDATABASE=postgres \
PGPORT=5432 \
PORT=3000 \
  npm run start
```

## No relacional (MongoDB)

### Consultas y Vistas

Las consultas se encuentran en el archivo `no-relacional/queries.js`

### Instrucciones para correr servidor de API
#### 1) Preparar servidor de API

```
cd no-relacional/server
npm i
npm run build
```

#### 2) Correr servidor de API

Cambiar las variables de entorno dependiendo de como corre la base de datos:

```
DB_CONN_STRING="mongodb://mongo:docker@localhost:27017" \
DB_NAME="admin" \
PORT=3000 \
  npm run start
```


## Las APIs se puede probar de distintas maneras:

Una vez esté corriendo el servidor de la API, se puede probar de alguna de las siguientes maneras:

- Abrir el api.yaml usando [Swagger UI](https://github.com/moon0326/swagger-ui-watcher) (con `swagger-ui-watcher api.yaml` por ejemplo), o
- [Importar el archivo api.yaml en Postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/#import-an-api-definition)
