---
name: web-proposal-template
description: >-
  Utiliza esta skill SIEMPRE que debas estructurar, redactar o diseñar una propuesta web.
  Contiene el esqueleto y orden lógico de ventas requerido, además de snippets CSS para 
  asegurar una presentación visual profesional y orientada a la conversión.
---

# Estructura de Propuesta Web (Web Proposal Template)

Toda propuesta web generada debe seguir estrictamente este orden de secciones para garantizar un flujo de ventas lógico y persuasivo.

## 1. Secciones Obligatorias

Asegúrate de incluir cada una de estas secciones en el orden presentado:

1.  **Hero:** Título de alto impacto centrado en el beneficio principal para el cliente. Subtítulo breve y botón de CTA (Call To Action) primario.
2.  **Problema:** Identificación clara del dolor o desafío actual del cliente. Demuestra empatía y comprensión de su situación.
3.  **Solución:** Presentación de tu servicio como la respuesta directa y lógica al problema anterior.
4.  **Metodología:** Explicación de cómo trabajas (paso a paso o fases del proyecto) para generar confianza y transparencia.
5.  **Por qué nosotros:** Diferenciadores clave, experiencia, o propuesta de valor única (por qué elegirte a ti frente a la competencia).
6.  **Inversión:** Desglose claro de los costos o paquetes. (Recuerda utilizar la skill `product-catalog` para los precios reales).
7.  **CTA Final (Call to Action):** Instrucción clara sobre cuál es el siguiente paso (ej. "Agenda una llamada", "Firma el contrato").

---

## 2. Snippets CSS (Opcionales / Estilos Premium)

Si vas a generar el diseño en HTML/CSS, utiliza estos estilos base para mantener un diseño corporativo, moderno y alineado a la marca. (Combínalos con los colores de la skill `brand-identity`).

### Glassmorphism (Efecto Cristal)
Ideal para tarjetas de precios o fondos de secciones superpuestas.
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
```

### Diseño Corporativo (Sombras y Bordes Premium)
Ideal para contenedores limpios y profesionales.
```css
.corporate-card {
  background-color: var(--color-fondo, #ffffff);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

### Estilos de Botones (CTA)
Un botón atractivo y orientado a la conversión.
```css
.cta-button {
  background-color: var(--color-primario, #3B82F6);
  color: #ffffff;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
}
```

### Animaciones Específicas (Fade In Up)
Para que las secciones aparezcan suavemente al hacer scroll.
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
}
```

---
**Instrucciones para el Agente:** 
No inventes nuevas secciones para la propuesta principal a menos que el usuario lo solicite. Cíñete a este esqueleto. Asegúrate de entrelazar esta información con las pautas de `brand-identity`.
