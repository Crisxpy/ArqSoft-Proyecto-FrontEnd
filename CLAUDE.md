# CLAUDE.md — Contexto del proyecto (Grupo 1: Frontend / BFF)

> Este archivo es leído automáticamente por Claude Code. Contiene el contexto
> persistente del proyecto para no tener que re-explicarlo en cada sesión.

## Qué es este proyecto

Marketplace construido con arquitectura de microservicios, dividido entre **8
grupos de estudiantes** (proyecto universitario, UTEM). Cada grupo es dueño de un
servicio. Yo soy el **Grupo 1: Frontend + BFF (Backend for Frontend)**.

Mi grupo construye:
- El **frontend** en React (mockup actual desplegado en Vercel).
- El **BFF**, capa que traduce y orquesta las llamadas del frontend hacia los
  servicios de los otros grupos.

### Los 8 grupos / servicios
| Grupo | Servicio                                   |
|-------|--------------------------------------------|
| 1     | Frontend / BFF  ← **este equipo**          |
| 2     | Auth (login, JWT)                          |
| 3     | Catálogo (productos)                       |
| 4     | Carro, checkout, inventario, concurrencia  |
| 5     | Pedidos / order management                 |
| 6     | Despacho                                    |
| 7     | Reportería, bash, streaming                |
| 8     | Pago simulado y notificaciones             |

## Arquitectura: el rol del BFF

El frontend **solo** habla con el BFF. El BFF consume los servicios de los grupos
2–8. Esto significa que el contrato Frontend↔BFF lo controlamos 100% nosotros, y el
BFF **se adapta** a los contratos de los otros grupos (no al revés). Si un servicio
backend devuelve `product_id` y el frontend espera `productId`, el BFF traduce.

## Fuente de verdad de los contratos

Los contratos viven en un repo central aparte: **`marketplace-contracts`** (dentro
de la GitHub Organization del proyecto). NO en los repos de cada servicio.

```
marketplace-contracts/
├── shared/components.yaml          # Error, Pagination, Money (reutilizar con $ref)
├── data-dictionary/
│   ├── conventions.md              # reglas obligatorias
│   └── canonical-models.md         # entidades compartidas (User, Product, Order...)
└── services/
    ├── group-1-bff/openapi.yaml    # nuestro contrato (12 endpoints, COMPLETO)
    └── group-2..8/openapi.yaml     # contratos de los demás grupos
```

## Contrato del BFF (nuestro) — endpoints definidos

Auth: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`
Catálogo: `GET /products` (con filtros + paginación), `GET /products/{id}`, `GET /categories`
Carro: `GET /cart`, `DELETE /cart`, `POST /cart/items`, `PATCH /cart/items/{id}`, `DELETE /cart/items/{id}`
Pedidos: `POST /orders`, `GET /orders`, `GET /orders/{id}`

Todo protegido con JWT (`BearerAuth`) excepto `/auth/login`. El contrato OpenAPI
completo está en `services/group-1-bff/openapi.yaml`.

## Convenciones que NO se negocian (aplican a todo el código)

- **IDs**: UUID string.
- **Campos JSON**: camelCase (`productId`, `createdAt`).
- **Enums**: UPPER_SNAKE_CASE (`PENDING`, `IN_TRANSIT`).
- **Dinero**: entero, nunca float. CLP no tiene decimales. Esquema `Money` (`amount` + `currency`).
- **Fechas**: ISO 8601 / UTC (`2026-06-16T14:30:00Z`).
- **Errores**: forma estándar `{ code, message, details? }`. El frontend hace lógica
  sobre `code`, nunca sobre `message`.
- **Paginación**: `page` (base 1) + `pageSize`; respuesta envuelta en `{ data, pagination }`.

## Stack

- Frontend: React + Vite, desplegado en Vercel.
- BFF: (por definir — probablemente Node/Express o similar).
- Contratos: OpenAPI 3.0, validados con Redocly + Spectral.

## Estado actual

HECHO:
- Contrato OpenAPI del BFF completo , pero no validado con los otros grupos.
- Mockup del frontend en Vercel.
- GitHub Organization (en proceso de poblar repos por grupo).

PENDIENTE (candidatos para esta sesión):
- Repo `marketplace-contracts` con estructura, stubs por grupo, convenciones y
  diccionario de datos.
- Generar tipos TypeScript desde el contrato OpenAPI del BFF.
- Conectar el frontend React al contrato (cliente tipado).
- Esqueleto del servidor BFF que implemente el contrato.
- Configurar tooling local (Spectral/Redocly) para validar contratos.

## Cómo validar un contrato

```bash
npx @redocly/cli lint services/group-1-bff/openapi.yaml
npx @stoplight/spectral-cli lint services/group-1-bff/openapi.yaml --ruleset .spectral.yaml
```

O pegar el YAML en https://editor.swagger.io

## Preferencias de trabajo

- Respuestas concisas.
- Empezar simple y expandir iterativamente.
- Comunicación en español.
