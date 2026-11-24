---
name: brief-express
description: >-
  Utiliza esta skill para recopilar, extraer y estructurar la información del cliente
  antes de redactar o cotizar cualquier propuesta. Contiene el cuestionario interactivo
  y las reglas para procesar datos desde enlaces web, documentos o formularios.
---

# Brief Express (Captura y Procesamiento de Datos del Cliente)

Esta skill garantiza que ninguna propuesta sea genérica. Conecta la estética visual y el catálogo de servicios con la realidad específica y los dolores del cliente X.

---

## 1. Modos de Entrada de Información

El asistente debe identificar primero la fuente de datos que el usuario proporciona:

### Modo A: Cuestionario Interactivo (Sin información previa)
Si el usuario solicita una propuesta sin dar detalles, el asistente formulará estas **6 preguntas esenciales**:

1. **Cliente y Sector:** ¿Cuál es el nombre del cliente/empresa y a qué sector pertenece?
2. **Problema actual (Dolor):** ¿Qué problema principal enfrentan hoy? (Ej: web desactualizada, baja conversión, proceso de compra confuso).
3. **Objetivo deseado:** ¿Qué meta cuantitativa o cualitativa buscan alcanzar? (Ej: modernizar imagen, captar más leads, vender online).
4. **Servicios de interés:** ¿Qué servicios del catálogo encajan? (UI/UX, Frontend React/Next.js, Backend, Mantenimiento).
5. **Plazos y Presupuesto:** ¿Tienen una fecha de entrega límite o un rango de inversión previsto?
6. **Referentes (Opcional):** ¿Tienen algún referente visual o competidor que les guste?

---

### Modo B: Extracción Inteligente desde Enlaces (URLs)
Si el usuario proporciona una URL (sitio web, LinkedIn o noticia del cliente):
* Analizar la página para extraer: propuesta de valor, sector, público objetivo y deficiencias visuales o de experiencia de usuario perceptibles.
* **Regla estricta:** NUNCA preguntar al usuario datos que ya sean evidentes en el enlace facilitado.

---

### Modo C: Extracción desde Documentos o Notas
Si el usuario aporta un texto, PDF o notas de reunión:
* Sintetizar los requerimientos técnicos y problemas mencionados explícitamente por el cliente.
* Mapear las necesidades a los servicios disponibles en `product-catalog`.

---

### Modo D: Extracción desde Formularios (Typeform / Google Forms)
Si el usuario pega las respuestas de un cuestionario de prospección:
* Mapear directamente las respuestas con la estructura de venta:
  * Campo de dolor/problema ➡️ Sección **Problema** de `web-proposal-template`.
  * Campo de resultado esperado ➡️ Sección **Solución** de `web-proposal-template`.
  * Presupuesto / Selección de producto ➡️ Sección **Inversión** de `product-catalog`.

---

## 2. Ficha Resumen Express (Validación Obligatoria)

Antes de redactar la propuesta completa, el asistente debe generar una **Ficha Resumen** compacta para confirmación del usuario:

```markdown
### 📋 Ficha Resumen del Cliente: [Nombre del Cliente]
* **Sector / Negocio:** [Sector de actividad]
* **Dolor Principal:** [Problema detectado]
* **Objetivo del Proyecto:** [Resultado esperado]
* **Servicios Propuestos:** [Servicios identificados según product-catalog]
* **Tono / Enfoque:** [Formal, innovador, minimalista, etc.]
```

* **Si falta un dato indispensable:** El asistente preguntará únicamente por ese dato puntual antes de redactar.
* **Si el usuario da el visto bueno:** El asistente procederá a generar la propuesta aplicando `brand-identity`, `web-proposal-template` y `product-catalog`.

---

## 3. Instrucciones Operativas para el Agente

1. **Prioridad de Relevancia:** Personaliza los titulares, dolores y soluciones con el nombre y vocabulario del cliente específico.
2. **No Inventar:** Si no se conoce un dato crítico (por ejemplo, el presupuesto o el servicio exacto), consultar al usuario antes de asumir cifras.
3. **Flujo Integrado:**
   * `brief-express` ➡️ Extrae y valida la información del cliente.
   * `product-catalog` ➡️ Asigna los precios y servicios oficiales.
   * `web-proposal-template` ➡️ Estructura el documento de ventas.
   * `brand-identity` ➡️ Aplica el estilo visual y colores corporativos.
