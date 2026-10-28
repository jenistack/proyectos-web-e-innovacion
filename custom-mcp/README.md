# Plantilla Servidor MCP en Python

Esta carpeta contiene una plantilla mínima y lista para usar de un servidor **MCP (Model Context Protocol)** con Python y `FastMCP`.

## 1. Requisitos e Instalación

Instala el paquete oficial de MCP en tu entorno de Python:

```bash
pip install "mcp[cli]"
```

## 2. Archivo del Servidor (`server.py`)

El archivo [server.py](file:///c:/Users/elisa/Antigravity/custom-mcp/server.py) define el servidor y sus herramientas:

- Usa `@mcp.tool()` para registrar cualquier función como herramienta utilizable por Antigravity.
- El **docstring** de la función le indica al modelo qué hace y cuándo debe llamarla.
- Las anotaciones de tipo (`str`, `int`, `float`, `dict`, etc.) definen automáticamente los parámetros esperados.

## 3. Registrar en Antigravity (`mcp_config.json`)

Para que Antigravity reconozca tu servidor MCP, añade la entrada correspondiente a tu archivo `mcp_config.json`:

```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "C:\\Users\\elisa\\miniconda3\\Scripts\\notebooklm-mcp.exe",
      "args": []
    },
    "custom-python": {
      "command": "python",
      "args": [
        "c:/Users/elisa/Antigravity/custom-mcp/server.py"
      ]
    }
  }
}
```

> **Nota:** Si utilizas un entorno específico (como Conda o un venv), puedes reemplazar `"python"` por la ruta absoluta a tu ejecutable `python.exe` (por ejemplo, `C:\\Users\\elisa\\miniconda3\\python.exe`).

