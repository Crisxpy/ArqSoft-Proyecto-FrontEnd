# Arquitectura de Frontend y Mapa de Despliegue — Grupo 1

**Fecha:** 2026-06-18
**Alcance de este documento:** esquema y estructura. No es un plan de
despliegue real todavía — eso viene después de cerrar estas decisiones.

---

## 1. Mapa general (esquema, no despliegue real aún)

```text
Usuario (navegador)              Usuario (app móvil)
        │                                │
        ▼                                ▼
  Main Store (Vercel)              App Mobile (React Native / Expo)
        │                                │
        └───────────────┬────────────────┘
                         ▼
                  BFF (Grupo 1)
                         │
   ┌──────┬──────┬──────┼──────┬──────┬──────┐
   ▼      ▼      ▼      ▼      ▼      ▼      ▼
  G2     G3     G4     G5     G6     G7     G8
 (Auth)(Catálogo)(Carro)(Pedidos)(Despacho)(Reportería)(Pagos)
```

Además existe una **segunda aplicación web separada: Admin**, que no la
usan los clientes finales — habla con el mismo BFF (o con una extensión
del mismo) y con G2/G3/G5/G7 para gestión interna.

---

## 2. Las aplicaciones que tenemos que construir (Grupo 1)

| App | Para quién | Stack propuesto | Habla con |
|---|---|---|---|
| **Main Store** | Cliente final (web) | React + Vite (ya existe) | BFF |
| **Admin** | Equipo interno / operadores | React + Vite (proyecto Vercel separado) | BFF (namespace `/admin/*`) |
| **Mobile** | Cliente final (app) | **React Native + Expo** | BFF |

### 2.1 Páginas del Main Store — qué es nuestro y qué se delega

| Página | Quién la construye | Quién provee los datos |
|---|---|---|
| Login / Registro | Nosotros | G2 vía BFF |
| **Catálogo / Home / Detalle de producto** | **Grupo 3** (delegado, ver §3) | Grupo 3 directo |
| Carro | Nosotros | G4 vía BFF |
| Checkout | Nosotros | BFF orquesta (G4 → G5 → G8) |
| Historial / Detalle de pedido | Nosotros | G5 vía BFF |
| Perfil de usuario | Nosotros | G2 vía BFF |
| Notificaciones | Nosotros (ícono/listado simple) | G8 vía BFF |

### 2.2 Mobile: ¿React Native?

**Sí, recomendado.** Ya tenemos React en el Main Store y un contrato BFF
estable — React Native reutiliza el mismo lenguaje, el mismo cliente HTTP
tipado, los mismos tipos generados del OpenAPI, y gran parte de la lógica
(hooks, validaciones), solo cambia la capa de UI. La curva de aprendizaje
para el equipo es mucho menor que ir a Flutter o nativo puro.

**Trade-off:** usar **Expo** (no RN "bare") para evitar la complejidad de
compilar para iOS/Android manualmente — con Expo se puede probar en
segundos con Expo Go y, si no se necesita publicar en las tiendas para el
curso, incluso correr como Expo Web. Lo único a tener en cuenta: el
catálogo delegado a Grupo 3 (un iframe/web embed, ver §3) **no se puede
reusar igual en mobile** — en la app nativa, el catálogo se consume como
una API REST normal (llamando directo a G3 o al BFF), no como un embed.

---

## 3. Delegación del Catálogo a Grupo 3

**Decisión:** Frontend (nosotros) **no** es responsable de construir la
UI del catálogo (listado, fotos, precios, filtros, paginación, búsqueda,
detalle de producto). Esa responsabilidad se delega a **Grupo 3**, dueños
del dominio. Nosotros solo les damos un espacio en la página.

### 3.1 Cómo se integra (esquema)

```text
┌─────────────────────────────────────────────┐
│  Main Store (nuestro layout: navbar, carro)  │
│  ┌─────────────────────────────────────────┐│
│  │                                          ││
│  │   <section id="catalogo-embed">          ││
│  │     <iframe src="https://catalogo-g3...">││  ← lo renderiza Grupo 3
│  │   </section>                             ││
│  │                                          ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

- **Mecanismo:** `<iframe>` apuntando a una URL que Grupo 3 hostea (su
  propio mini-frontend, puede ser un proyecto Vercel separado de ellos).
  Es la opción más simple de coordinar entre equipos con distinto nivel
  de frontend — el "contrato" entre nosotros y ellos se reduce a una URL.
- **Comunicación cruzada (`postMessage`):** cuando el usuario hace clic
  en "Agregar al carro" dentro del iframe de Grupo 3, ellos emiten un
  evento `postMessage({ type: "ADD_TO_CART", productId, quantity })` al
  padre. Nuestro Main Store escucha ese evento y llama a
  `POST /cart/items` en el BFF (con el JWT, que el iframe nunca necesita
  conocer).
- **Alternativa más acoplada** (Web Components / Module Federation): da
  mejor integración visual pero exige coordinar versiones de build entre
  equipos — no recomendado para esta etapa del proyecto.
- **Lo que sigue siendo nuestro:** el layout general (navbar, carro,
  checkout), y cualquier vista que solo necesite *datos* de producto sin
  renderizar el catálogo completo (ej. nombre/foto de un ítem dentro del
  carro o de un pedido) — eso sigue viniendo del BFF como hasta ahora.

### 3.2 Qué le pedimos a Grupo 3 (a comunicar en la reunión)

- Una URL pública embebible (responsive, sin su propio navbar/header) que
  renderice catálogo + filtros + detalle de producto.
- El evento `postMessage` de "agregar al carro" con `productId`/`quantity`.
- Que siga existiendo su contrato REST normal (`GET /products`, etc.) por
  si en mobile necesitamos consumirlo directo en vez del embed.

---

## 4. Admin (app aparte)

Aplicación web **separada del Main Store** (otro proyecto/deploy en
Vercel), para gestión interna: usuarios, productos, precios, categorías,
pedidos, reportes. No la usa el cliente final.

| Función | Backend real |
|---|---|
| Gestión de usuarios y roles | G2 (`/users`, `/identity/roles`, ya existen en su contrato) |
| Gestión de productos/precios/stock | G3 (`POST/PUT /products`, ya existen en su contrato) |
| Ver/gestionar pedidos | G5 (cuando exista su contrato) |
| Dashboards/reportes | G7 (`/reports/*`) |

**Estructura propuesta:** en vez de duplicar lógica, Admin habla con el
**mismo BFF**, agregando un namespace `/admin/*` protegido por rol
(`admin`, viene de G2) que proxea hacia G2/G3/G5/G7. Evita tener que
mantener un segundo backend solo para Admin.

---

## 5. Contratos-mock: cómo evitar que todos esperen a todos

**Problema que esto resuelve:** un grupo no puede empezar a programar
contra el contrato de otro si ese otro grupo no ha terminado su
implementación real.

**Instrucción a dar a los 8 grupos:** cada contrato en
`marketplace-contracts/services/group-N-x/openapi.yaml` debe declarar
**ejemplos completos (`example:`) en cada respuesta**, y cada grupo debe
levantar un **mock server público** que sirva esos ejemplos como si la
infraestructura real ya existiera — sin tener que programar nada de
lógica real.

- Herramienta sugerida: **Prism** (`@stoplight/prism-cli`), que genera un
  servidor mock automáticamente a partir del propio `openapi.yaml` y sus
  `example:`. Grupo 3 ya lo usa así (`http://127.0.0.1:4010 — Mock local
  con Prism`), es el patrón a copiar.
  ```bash
  npx @stoplight/prism-cli mock services/group-3-catalogo/openapi.yaml
  ```
- El mock se despliega igual que el servicio real (mismo Docker/Render),
  bajo una URL pública. Cuando el servicio real esté listo, **se cambia
  solo la URL** en el registro de servicios — el consumidor no toca nada
  de su código porque la forma de la respuesta es la misma.
- Esto es lo mínimo para que, por ejemplo, nosotros (BFF) podamos
  desarrollar contra G5 (Pedidos) o G6 (Despacho v1.1) sin esperar a que
  ellos terminen, y para que Grupo 3 nos entregue un embed de catálogo
  funcional con datos de ejemplo antes de tener su base de datos real
  conectada.

---

## 6. Próximos pasos

1. Validar con Grupo 3 el modelo de embed (iframe + postMessage) — si no
   les acomoda, definir alternativa antes de avanzar.
2. Confirmar el alcance de Admin con el equipo (¿se construye este
   semestre o queda para una fase futura?).
3. Pedir a los 8 grupos que agreguen `example:` completos a su contrato y
   levanten su mock con Prism — instrucción a sumar a
   `marketplace-contracts/data-dictionary/`.
4. Recién después de esto, planear el despliegue real (Render/Vercel,
   variables de entorno, registro de URLs de producción).
