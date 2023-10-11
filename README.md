# TPO - Base de Datos II

## Grupo 10

### Preparar servidor de API

```
npm run build
```

### Correr servidor de API

```
PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=docker \
PGDATABASE=postgres \
PGPORT=5432 \
PORT=3000 \
  npm run start
```


### La API se puede probar de distintas maneras:

- Abrir el api.yaml usando Swagger UI (con `swagger-ui-watcher api.yaml` por ejemplo)
- Importar el archivo api.yaml en Postman 
