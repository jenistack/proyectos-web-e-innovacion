# 🌐 Mapa de Oportunidades con IA

Aplicación web pública y colaborativa desarrollada con **HTML5, CSS3 y JavaScript** conectada en tiempo real a **Supabase**.

Permite a cualquier persona detectar, publicar y consultar oportunidades de negocio impulsadas por Inteligencia Artificial geolocalizadas por ciudad y país, así como votar (dar *like*) a las mejores ideas.

---

## 🌟 Características Principales

- **100% Pública y Compartida**: Cualquier usuario que entra ve en tiempo real todas las oportunidades publicadas por otros usuarios en el mundo.
- **Persistencia en la Nube con Supabase**: Los datos no se quedan en el navegador local (`localStorage`); se leen, insertan y actualizan directamente en la base de datos PostgreSQL de Supabase.
- **Campos Estructurados**:
  - `Nombre` de la oportunidad
  - `Ciudad` y `País`
  - `Problema` detectado
  - `Solución con IA` (modelos predictivos, visión, LLMs, agentes)
  - `Categoría` (Turismo, Gastronomía, Salud, Sostenibilidad, etc.)
  - `Potencial` (Disruptivo, Alto, Medio)
  - `Likes` (contador interactivo)
  - `created_at` (fecha de publicación)
- **Filtros Dinámicos**:
  - Búsqueda en tiempo real por palabra clave
  - Filtro por Ciudad
  - Filtro por País
  - Filtro por Categoría
  - Ordenamiento por más recientes o más votadas (Likes)
- **Diseño Moderno y Responsivo**: Interfaz oscura con paleta premium, tarjetas con micro-interacciones, badges de color y soporte total para móvil y escritorio.
- **Panel de Configuración Integrado**: Permite ingresar y verificar la conexión a Supabase con un botón de prueba de conexión en vivo.

---

## 🗄️ Esquema de Base de Datos en Supabase

El archivo [`schema.sql`](./schema.sql) contiene la definición completa de la tabla y las políticas de seguridad (RLS):

```sql
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    problem TEXT NOT NULL,
    ai_solution TEXT NOT NULL,
    category TEXT NOT NULL,
    potential TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (permite lectura, inserción y actualizar likes sin login):
CREATE POLICY "Permitir lectura publica de oportunidades"
ON public.opportunities FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Permitir insercion publica de oportunidades"
ON public.opportunities FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualizar likes publicamente"
ON public.opportunities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
```

---

## 🚀 Cómo Conectar y Probar la App

1. Abre el archivo `index.html` en tu navegador (o mediante una extensión como *Live Server* en VS Code).
2. Haz clic en el botón superior **"Conexión Supabase"** (o en el banner de aviso).
3. Introduce tu **Project URL** (ejemplo: `https://xyzabcdefghijklm.supabase.co`) y tu **Anon Key** de Supabase (que encuentras en tu panel de Supabase en *Project Settings &rarr; API*).
4. Haz clic en **"Probar Conexión"** y luego en **"Guardar y Conectar"**.
5. ¡Listo! La lista cargará automáticamente las oportunidades existentes en Supabase.

---

## 👥 Cómo Comprobar que una Oportunidad Publicada por una Persona Aparece para Otra

Para verificar que la sincronización es verdaderamente pública y global (y no un guardado local):

1. **Abrir en dos navegadores o ventanas diferentes**:
   - Abre la aplicación en tu navegador habitual (ej. Google Chrome).
   - Abre una **ventana de incógnito** o un segundo navegador completamente diferente (ej. Firefox, Edge, Safari o tu teléfono móvil).
2. **Publicar una oportunidad en la primera ventana**:
   - Haz clic en **"+ Publicar Oportunidad"**.
   - Completa el formulario con una nueva idea (ej. *“Triaje por IA para Urgencias Pediátricas en Valencia, España”*).
   - Haz clic en **"Publicar en Supabase"**.
3. **Comprobar la segunda ventana**:
   - Ve a la ventana de incógnito o al segundo navegador.
   - Refresca la página (F5 o botón de recargar).
   - **Resultado:** La nueva oportunidad aparecerá inmediatamente en la segunda ventana con todos sus datos, demostrando que reside en la nube de Supabase y es accesible para cualquier usuario en el mundo.
4. **Comprobar los Likes**:
   - Haz clic en el botón del corazón (Like) desde la segunda ventana.
   - Recarga la primera ventana: el contador de likes se habrá incrementado para todos los visitantes.
