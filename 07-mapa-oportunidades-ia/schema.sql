-- ============================================================
-- Mapa de Oportunidades con IA - Esquema de Base de Datos
-- ============================================================

-- 1. Crear tabla de oportunidades
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

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas de Acceso Público (Cualquier usuario anónimo puede leer, crear y dar likes)

-- Política 1: Lectura pública (Cualquier persona puede ver todas las oportunidades)
DROP POLICY IF EXISTS "Permitir lectura publica de oportunidades" ON public.opportunities;
CREATE POLICY "Permitir lectura publica de oportunidades"
ON public.opportunities
FOR SELECT
TO anon, authenticated
USING (true);

-- Política 2: Inserción pública (Cualquier persona puede publicar una oportunidad)
DROP POLICY IF EXISTS "Permitir insercion publica de oportunidades" ON public.opportunities;
CREATE POLICY "Permitir insercion publica de oportunidades"
ON public.opportunities
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 3: Actualización pública de likes (Cualquier persona puede sumar likes)
DROP POLICY IF EXISTS "Permitir actualizar likes publicamente" ON public.opportunities;
CREATE POLICY "Permitir actualizar likes publicamente"
ON public.opportunities
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Oportunidades iniciales de demostración (Opcional)
INSERT INTO public.opportunities (name, city, country, problem, ai_solution, category, potential, likes)
VALUES 
(
    'Optimización de Rutas de Reciclaje Urbano',
    'Madrid',
    'España',
    'Los camiones de recogida realizan rutas fijas e ineficientes recogiendo contenedores medio vacíos.',
    'Sensores IoT combinados con visión computacional y modelos predictivos para optimizar rutas en tiempo real según nivel de llenado.',
    'Sostenibilidad',
    'Alto',
    14
),
(
    'Detección Temprana de Fugas de Agua en Hoteles',
    'Cancún',
    'México',
    'Pérdidas millonarias por fugas ocultas de agua en grandes complejos hoteleros durante temporadas altas.',
    'Agente de IA acústico conectado a caudalímetros inteligentes que detecta micro-vibraciones anómalas en tuberías.',
    'Turismo & Hospitalidad',
    'Disruptivo',
    28
),
(
    'Predicción de Demanda en Taquerías y Puestos Callejeros',
    'Ciudad de México',
    'México',
    'Desperdicio de carne y tortillas o quiebres de inventario los fines de semana por clima impredecible.',
    'Micro-modelo de predicción para WhatsApp que cruza eventos locales, pronóstico meteorológico y ventas históricas.',
    'Gastronomía',
    'Alto',
    19
),
(
    'Triaje Inteligente para Clínicas Dentales de Barrio',
    'Buenos Aires',
    'Argentina',
    'Pacientes con urgencias dentales reales esperan horas mientras casos simples saturan la sala.',
    'Asistente conversacional con análisis de imágenes dentales enviadas por el paciente para pre-diagnóstico y asignación de urgencias.',
    'Salud',
    'Medio',
    9
);
