# Reporte de Limpieza de Elementos Mockup

Este documento detalla los elementos fuera de alcance, simulaciones y datos ficticios que fueron retirados del frontend para alinear la interfaz con la integración real de servicios (BFF del Grupo 1, Inventario del Grupo 3 y Pedidos del Grupo 8).

---

## 📂 Archivos Afectados

El proceso de limpieza y refactorización se concentró en los siguientes componentes y vistas React:

1. [LandingPage.jsx](file:///F:/GitHub/ArqSoft-Proyecto-FrontEnd/src/pages/LandingPage.jsx) - Vista pública de aterrizaje para usuarios no logueados.
2. [LandingTab.jsx](file:///F:/GitHub/ArqSoft-Proyecto-FrontEnd/src/components/LandingTab.jsx) - Pestaña de inicio para usuarios autenticados.
3. [ProductPage.jsx](file:///F:/GitHub/ArqSoft-Proyecto-FrontEnd/src/pages/ProductPage.jsx) - Ficha de detalle de producto.

---

## 🛠️ Detalle de Cambios y Elementos Retirados

### 1. Rating/Reseñas de Productos
- **Cambio realizado:** Se eliminó la visualización de estrellas y número de opiniones en todo el catálogo y fichas de producto.
- **Elementos/Funciones afectadas:**
  - Se eliminó la función de renderizado de estrellas `renderStars(rating)` en `LandingTab.jsx` y `ProductPage.jsx`.
  - Se eliminaron las variables simuladoras `mockRating` y `mockReviews`.
  - Se eliminó el componente `Star` de los imports de `lucide-react` en los tres archivos.
  - Se removió el bloque JSX que dibujaba las estrellas de calificación.

### 2. Descuentos y Precio Anterior Simulado
- **Cambio realizado:** Se eliminó el precio anterior tachado, porcentaje de descuento y badge de "ahorro" simulado. Solo se muestra el precio real del producto obtenido del BFF.
- **Elementos/Funciones afectadas:**
  - Se eliminó el cálculo de `mockOldPrice` y `discountPercent`.
  - Se retiraron del markup los elementos `<span className="line-through">` y los badges `-X% OFF` o `Ahorras $Y`.

### 3. Sección "Ofertas del día"
- **Cambio realizado:** Se removió completamente esta sección, ya que utilizaba productos inventados y no corresponde al flujo real del sistema.
- **Elementos/Funciones afectadas:**
  - Se eliminó el arreglo de datos estáticos `dailyDeals` (con productos como Teclado Keychron, SSD Samsung, etc.).
  - Se eliminó el estado del temporizador de cuenta regresiva `timeLeft` y `setTimeLeft`.
  - Se removió el `useEffect` que controlaba el contador regresivo del timer.
  - Se removió la función formateadora `formatTimer(seconds)`.
  - Se retiró el bloque `<section>` completo correspondiente a "Ofertas del día" en `LandingPage.jsx` y `LandingTab.jsx`.

### 4. Conteos de Categoría Fabricados
- **Cambio realizado:** Se quitaron los conteos de stock inventados de las categorías de la landing page.
- **Elementos/Funciones afectadas:**
  - Se removió la propiedad `count` (ej: `count: 1284`) en la metadata del arreglo `categories`.
  - Se eliminó la línea JSX que mostraba `{cat.count.toLocaleString()} productos` dentro de los botones de categorías en `LandingPage.jsx` y `LandingTab.jsx`.

### 5. Fotos de Stock Reemplazadas por Imágenes Reales
- **Cambio realizado:** Se eliminó el mapeo estático de imágenes de Unsplash y se habilitó la visualización directa del atributo real del producto proveniente de G3.
- **Elementos/Funciones afectadas:**
  - Se eliminaron las constantes de presets `STATIC_PRODUCT_IMAGES` y `CATEGORY_IMAGE_SETS`.
  - Se removieron las funciones de utilidad `getStaticProductImage`, `getStaticImagesForProduct` y `getSingleStaticImage`.
  - Se actualizó el renderizado de imágenes para usar directamente `p.imageUrl` / `product.imageUrl`.
  - Se incorporó un manejador `onError` en las imágenes para ocultar la etiqueta rota y, en su lugar, mostrar el contenedor alternativo con el emoji placeholder `📦` (replicando la lógica estandarizada de `Catalog.jsx`).
  - Se removieron los selectores de miniaturas (thumbnails), el estado `activeImage` y los botones de navegación de galería en `ProductPage.jsx`, ya que los productos reales poseen una única imagen principal.

### 6. Badges de Garantía/Envío/Devolución como Atributo por Producto
- **Cambio realizado:** Se eliminó el bloque de información de despacho, garantía y devolución de la ficha de detalle, puesto que no son atributos asignados por producto en los modelos de datos oficiales.
- **Elementos/Funciones afectadas:**
  - Se eliminó el bloque JSX de Trust Badges (`f_detail_badge_trust`) en `ProductPage.jsx`.
  - Se removieron del import de `lucide-react` los iconos `Shield`, `Truck` y `RotateCcw` que estaban en desuso en esa página.
  - Se retiraron del markup los subtextos simulados del stock indicator (`— Envío rápido a todo Chile` y `— Sin fecha estimada`).

---

## 🔒 Estado de Otros Componentes Analizados

- **Simulación Webpay (Grupo 8):** El flujo en `Cart.jsx` se mantiene acotado a la generación directa del pedido a través del BFF de manera síncrona/directa, mostrando el token que provee el microservicio del Grupo 8. No hay pantallas ni popups que simulen la pasarela de Webpay.
- **Panel de Vendedores:** No se encontraron referencias a rutas o componentes con el rol "Vendedor" o dashboards adicionales de venta fuera del panel administrativo estándar de reportes (`AdminDashboard.jsx`).
- **Generación de Boletas:** El sistema solo rastrea y expone el estado que entrega el microservicio de Grupo 8 ("pending", "processing", "shipped", "delivered") sin simular la emisión física de facturas ni boletas del SII.
