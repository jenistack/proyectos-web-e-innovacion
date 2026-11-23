# 🌮 Taquería El Trompo Loco · App Móvil de Pedidos para Recoger

Una aplicación web moderna, ágil y visual pensada **100% para móvil** para una taquería tradicional. Permite a los clientes explorar el menú, personalizar al detalle cada taco o platillo (tortillas, verduras, salsas, extras), y preparar su pedido para **recoger en local (pickup)** con confirmación directa por **WhatsApp** y generación de **Ticket Digital**.

---

## 🚀 Cómo Abrir la Aplicación

No requiere Node.js, dependencias ni instalación. Simplemente abre cualquiera de estos archivos en tu navegador:

1. **Desde la raíz del proyecto:**
   * Haz doble clic en [`taqueria.html`](file:///c:/Users/elisa/Antigravity/open_manager/Taquería/taqueria.html)
2. **Desde la carpeta del proyecto nuevo:**
   * Abre [`taqueria-app/index.html`](file:///c:/Users/elisa/Antigravity/open_manager/Taquería/taqueria-app/index.html)

---

## ✨ Características y Funcionalidades

### 📱 Experiencia y Diseño Mobile-First
* **Diseño nativo para smartphone:** Centrado en pantalla móvil con barra inferior flotante, gestos táctiles tipo *bottom sheet* y microinteracciones fluidas.
* **Aspecto gastronómico de impacto:** Paleta inspirada en trompo de pastor y calle mexicana (rojo chile fuego, maíz dorado, verde aguacate) sobre modo noche oscuro de alto contraste.
* **Efectos de sonido interactivos:** Sonidos táctiles sintetizados con Web Audio API (*pop* al agregar y tono de éxito al confirmar comanda).
* **Animación de éxito:** Celebración de confeti al generar la orden.

### 📋 Menú Completo y Categorizado
* **Categorías con scroll horizontal suave:**
  * 🌮 *Tacos al Trompo & Plancha* (Pastor con piña, Suadero confitado, Quesabirria con consomé caliente, Campechano con chicharrón, Carnitas Michoacán, Taco Veggie de flor de calabaza y nopal).
  * 🧀 *Gringas & Especiales* (Gringa de Pastor con doble queso, Volcán de asada en tostada crujiente, Alambre loco para 2).
  * 🥑 *Entradas & Totopos* (Guacamole en molcajete, Frijoles charros norteños, Queso fundido con chorizo).
  * 🥤 *Aguas Frescas & Bebidas* (Horchata casera, Jamaica natural con limón, Jarritos mexicanos de vidrio, Cerveza nacional bien helada).
  * 🍰 *Postres Caseros* (Churros crujientes con cajeta, Flan napolitano de la abuela).
* **Buscador en tiempo real:** Búsqueda instantánea con botón de limpieza rápida (`✕`).
* **Etiquetas visuales:** Badges en platillos (*⭐ Más Vendido*, *🔥 Favorito Taquero*, *🌱 Vegetariano*).

### 🥑 Personalización Completa (Bottom Sheet Táctil)
Al tocar cualquier producto, se despliega una hoja inferior para configurar:
1. **Tortilla:** Maíz clásica (incluida), Harina calientita (+ $5) o Costra dorada de queso Oaxaca (+ $18).
2. **Verdura:** Con Todo (cebolla y cilantro), solo cebolla, solo cilantro, cebollita cambray asada (+ $6) o sin verdura.
3. **Nivel de Salsa:** 🟢 Verde tomatillo fresca, 🔴 Roja taquera de árbol, 🔥 Salsa Macha de habanero y cacahuate, 🥑 Guacamole cremosa, salsas aparte o sin picante.
4. **Extras Opcionales:** Doble carne, queso Oaxaca fundido, rebanadas de aguacate, piña asada extra, limones y rábanos extra gratis.
5. **Notas especiales:** Campo libre para el taquero (*"Pastor bien doradito", "Limones extra"*).
6. **Contador de cantidad (+/-)** con recálculo dinámico del precio total en tiempo real.

### 🛍️ Carrito Flotante y Resumen
* Barra flotante inferior fija que emerge al añadir productos mostrando el total acumulado y contador de piezas.
* Drawer del carrito con desglose detallado de opciones seleccionadas, ajuste de piezas en línea y eliminación.

### 📝 Preparación del Pedido para Recoger (Checkout)
* **Datos del cliente:** Nombre completo para llamar en barra y teléfono móvil / WhatsApp.
* **Horario de recogida:** Opción rápida *"⚡ Lo antes posible (~15-20 min)"* o selector de horarios programados en bloques de 20 minutos.
* **Forma de pago en mostrador:**
  * 💵 Efectivo al recoger (con cálculo opcional de con cuánto billete pagará para tener su cambio listo).
  * 💳 Tarjeta / Datáfono al recoger.
* **Instrucciones adicionales para cocina:** Empaque, cubiertos o servilletas extra.

### 💬 Envío Inmediato a WhatsApp
* Genera con un solo toque un mensaje listo con formato limpio, emojis, número de folio `#TCQ-XXXX`, desglose de cada producto con sus tortillas, salsas y extras, total a pagar y dirección del local para enviar directamente a la taquería.

### 🧾 Ticket Digital y Semáforo de Cocina en Vivo
* Muestra un comprobante estilo ticket de papel térmico con folio de orden, resumen detallado y código de barras.
* **Seguimiento del estado del pedido en 3 pasos:**
  1. *Pedido recibido en barra* ✅
  2. *En trompo y plancha* 🔥
  3. *¡Empacado y listo para recoger!* 🛍️

### 💾 Historial de Pedidos (`localStorage`)
* Los pedidos quedan guardados en el navegador del cliente para que pueda consultar tickets anteriores en cualquier momento desde el botón *"Mis Pedidos"*.

---

## 📁 Estructura de Archivos

```
Taquería/
├── taqueria.html           # Acceso directo a la aplicación desde la raíz
└── taqueria-app/           # Proyecto totalmente nuevo e independiente
    ├── index.html          # Estructura semántica, modales y ticket
    ├── styles.css          # Estilos mobile-first, paleta, drawers y animaciones
    ├── data.js             # Catálogo de menú, opciones de tortillas, salsas y extras
    ├── app.js              # Lógica interactiva, carrito, WhatsApp, audio y almacenamiento
    └── README.md           # Documentación del proyecto
```

---

## ⚙️ Configuración y Personalización

Para cambiar el número de WhatsApp, nombre de la taquería, dirección o agregar nuevos platillos, edita [`taqueria-app/data.js`](file:///c:/Users/elisa/Antigravity/open_manager/Taquería/taqueria-app/data.js):

```javascript
restaurant: {
  name: "Taquería El Trompo Loco",
  address: "Av. Insurgentes Sur 452, Col. Roma / Condesa",
  phone: "+52 55 8492 3100",
  whatsappPhone: "525584923100", // <-- Ingresa aquí el número de WhatsApp con código de país
  currencySymbol: "$",
  pickupTimeAvg: "15 - 20 min"
}
```

