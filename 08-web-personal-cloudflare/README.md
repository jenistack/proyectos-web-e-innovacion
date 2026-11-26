# 🌐 Web Personal - Jeni Alverca Marhenawati

Sitio web personal moderno, responsivo y de alto rendimiento diseñado para destacar el perfil profesional de **Jeni Alverca Marhenawati**: Desarrolladora Full Stack (Python & SQL), participante del Programa Diginnova FULP y graduada en Educación Infantil especializada en Transformación Digital, EdTech y Product Management.

Optimizado para su despliegue inmediato en **Cloudflare Pages**, GitHub Pages o cualquier servidor web estático.

---

## 🎨 Identidad Visual y Diseño

Inspirado en una estética **SaaS / Dashboard UI moderna**:
- **Púrpura Central / Violeta Profundo:** `#5C3A8E` / `#6C3EB2` (identidad tecnológica, innovación y foco en producto).
- **Naranja Ámbar Cálido:** `#FF8E3C` / `#FF7020` (acentos dinámicos, botones de acción e indicadores de métricas).
- **Dark Plum / Púrpura Nocturno:** `#140F20` (alto contraste para banners y pie de página).
- **Fondo Canvas Soft Lilac:** `#F9F8FC` (amplio, limpio y con excelente legibilidad).
- **Tipografía:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (titulares limpios y geométricos) combinada con `Outfit` e `Inter`.
- **Botones y Contenedores:** Estilo en píldora (*pill-shaped* `border-radius: 9999px`), micro-bordes finos y sombras multinivel suaves (*soft drop shadows*).

---

## ✨ Características Principales

- **Diseño Responsive:** Totalmente adaptado para teléfonos móviles, tablets, portátiles y pantallas ultra-anchas.
- **Modo Oscuro / Modo Claro:** Selector de tema accesible y con memoria persistente en el navegador (`localStorage`).
- **Navegación Inteligente (ScrollSpy):** Cabecera fija con efecto traslúcido (*glassmorphism*) y resaltado automático de la sección en pantalla mediante `IntersectionObserver`.
- **Accesibilidad y Rendimiento:** Marcado semántico HTML5, iconos vectoriales SVG nativos (sin dependencias pesadas ni fuentes lentas externas).
- **Herramientas de Contacto Rápido:**
  - Botones con copia de correo al portapapeles en un clic con notificación flotante (*Toast*).
  - Formulario de contacto que preconfigura automáticamente el cliente de correo del usuario (`mailto:` estructurado).
  - Enlaces directos a perfil verificado de **LinkedIn**.

---

## 📂 Estructura del Proyecto

```plaintext
08-web-personal-cloudflare/
├── index.html        # Estructura semántica, accesibilidad y contenidos completos
├── style.css         # Variables de diseño, responsive media queries y modo oscuro
├── script.js         # Interactividad: menú móvil, tema claro/oscuro, toast y formulario
└── README.md         # Documentación del proyecto y guía de despliegue
```

---

## 🚀 Cómo Ejecutar en Local

No requiere de compiladores ni frameworks complejos, funciona directamente en cualquier navegador moderno:

### Opción 1: Apertura directa
Haz doble clic sobre el archivo `index.html` o arrástralo a tu navegador (Chrome, Edge, Firefox, Safari).

### Opción 2: Con Python
```bash
# En la raíz del proyecto:
python -m http.server 8000
```
Luego abre en tu navegador: `http://localhost:8000`

### Opción 3: Con la extensión Live Server de VS Code
Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

---

## ☁️ Despliegue en Cloudflare Pages

El proyecto está preparado para publicarse en la red global de Cloudflare:

### Método A: A través de Cloudflare Dashboard (Recomendado)
1. Sube este repositorio a **GitHub** o **GitLab**.
2. En [Cloudflare Dashboard](https://dash.cloudflare.com/), dirígete a **Workers & Pages** > **Create application** > **Pages**.
3. Selecciona tu repositorio y rama principal.
4. En la configuración de construcción (*Build settings*):
   - **Framework preset:** `None`
   - **Build command:** *(dejar en blanco)*
   - **Build output directory:** `.` (o el directorio raíz donde reside `index.html`).
5. Haz clic en **Save and Deploy**. ¡Tu web estará online en segundos con certificado SSL gratis y CDN mundial!

### Método B: Mediante Wrangler CLI
```bash
npx wrangler pages deploy . --project-name=jeni-alverca-web
```

---

## 👤 Contacto y Créditos

- **Titular:** Jeni Alverca Marhenawati
- **Ubicación:** Las Palmas de Gran Canaria, Canarias, España
- **Email:** [elisa.alverca@gmail.com](mailto:elisa.alverca@gmail.com)
- **LinkedIn:** [linkedin.com/in/jeni-alverca-marhenawati-146357397](https://www.linkedin.com/in/jeni-alverca-marhenawati-146357397)
- **Programa:** Alumna en Formación - Programa Diginnova (Fundación Universitaria de Las Palmas - FULP)

---

*Desarrollado con foco en accesibilidad, rendimiento y diseño web profesional.*
