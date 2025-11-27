import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  private gzUrl = 'productos_clientes.json.gz';

  async leerDatos(): Promise<any[]> {
    console.time('[ExcelService] ⏱️ Tiempo total');
    console.log('[ExcelService] 🔹 Iniciando lectura de', this.gzUrl);

    const resp = await fetch(this.gzUrl);
    if (!resp.ok) {
      throw new Error(`❌ No se pudo cargar ${this.gzUrl} (${resp.status})`);
    }

    const buffer = await resp.arrayBuffer();
    console.log('[ExcelService] 📦 Bytes recibidos:', buffer.byteLength.toLocaleString());

    const jsonStr = new TextDecoder('utf-8').decode(new Uint8Array(buffer));

    console.log('[ExcelService] 🧠 Parseando JSON...');
    let data: any;
    try {
      data = JSON.parse(jsonStr);
    } catch (e) {
      console.error('[ExcelService] ❌ Error al parsear JSON:', e);
      throw new Error('El archivo no contiene JSON válido.');
    }

    if (!Array.isArray(data)) {
      throw new Error('❌ El JSON no contiene un array.');
    }

    console.log(`[ExcelService] ✅ Datos listos: ${data.length.toLocaleString()} registros.`);
    console.timeEnd('[ExcelService] ⏱️ Tiempo total');
    return data;
  }
}
