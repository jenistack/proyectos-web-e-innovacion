"""
Plantilla básica de servidor MCP en Python usando FastMCP.
Requiere: pip install "mcp[cli]"
"""

from mcp.server.fastmcp import FastMCP

# 1. Crear la instancia del servidor MCP
mcp = FastMCP(
    name="CustomServer",
    instructions="Servidor MCP personalizado para herramientas a medida."
)

# 2. Definir herramientas (Tools)
# La descripción de la herramienta se extrae del docstring de la función.
# Los parámetros tipados se convierten automáticamente en el esquema JSON para el modelo.

@mcp.tool()
def mi_herramienta_ejemplo(parametro_texto: str, parametro_numero: int = 10) -> str:
    """
    Descripción clara de lo que hace esta herramienta para que el modelo sepa cuándo usarla.
    
    :param parametro_texto: Un texto de entrada necesario.
    :param parametro_numero: Un valor numérico opcional (por defecto 10).
    """
    resultado = f"Recibido: '{parametro_texto}' repetido {parametro_numero} veces."
    return resultado


@mcp.tool()
def sumar_numeros(a: float, b: float) -> dict:
    """Suma dos números y devuelve el resultado con información adicional."""
    return {
        "a": a,
        "b": b,
        "suma": a + b
    }


# 3. Punto de entrada para ejecutar el servidor vía stdio
if __name__ == "__main__":
    mcp.run()

