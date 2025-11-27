import json
import gzip
from pathlib import Path
import math

import pandas as pd
import numpy as np

RUTA_EXCEL = Path("./public/BaseProductoCliente.xlsx")
RUTA_SALIDA = Path("./public/productos_clientes.json.gz")

print("🔹 Iniciando conversión...")
print(f"   ➜ Archivo Excel: {RUTA_EXCEL}")

print("📥 Leyendo archivo Excel...")
df = pd.read_excel(RUTA_EXCEL, engine="openpyxl")
print(f"✅ Excel leído. Filas: {len(df)}, Columnas: {len(df.columns)}")

# 1) Normalizar: convertir NaN / NaT a None dentro del DataFrame
print("🔄 Limpiando NaN/NaT en el DataFrame...")
df = df.astype(object)
df = df.where(pd.notnull(df), None)
df = df.replace({np.nan: None})

print("✅ DataFrame limpiado. Convirtiendo a lista de dicts...")
registros = df.to_dict(orient="records")
print(f"✅ Registros: {len(registros)}")


def limpiar_nan(obj):
    """Convierte NaN/np.nan a None recursivamente"""
    if isinstance(obj, float) and math.isnan(obj):
        return None
    if obj is np.nan:
        return None
    if isinstance(obj, list):
        return [limpiar_nan(x) for x in obj]
    if isinstance(obj, dict):
        return {k: limpiar_nan(v) for k, v in obj.items()}
    return obj


print("🧹 Limpiando NaN recursivamente...")
registros = limpiar_nan(registros)
print("✅ Limpieza recursiva completada.")

print("📝 Serializando a string JSON...")
json_str = json.dumps(
    registros,
    ensure_ascii=False,
    allow_nan=False,
    default=str
)

if "NaN" in json_str:
    print("❌ AÚN QUEDAN 'NaN' EN EL JSON. NO SE GUARDARÁ EL ARCHIVO.")
    raise SystemExit(1)

json_bytes = json_str.encode("utf-8")
print(f"✅ Tamaño sin comprimir: {len(json_bytes)} bytes")

print(f"🗜️  Comprimiendo y guardando en: {RUTA_SALIDA}")
with gzip.open(RUTA_SALIDA, "wb") as f:
    f.write(json_bytes)

print("🎉 Listo. Archivo generado con éxito, SIN NaN.")
