import { Injectable } from '@angular/core';
import { ungzip } from 'pako';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  private gzUrl = '/productos_clientes.json.gz'; // está en public → raíz

  async leerDatos(): Promise<any[]> {
    console.time('[ExcelService] ⏱️ Total');
    console.log('[ExcelService] 🔹 GET', this.gzUrl);

    const resp = await fetch(this.gzUrl);
    if (!resp.ok) throw new Error(`❌ No se pudo cargar ${this.gzUrl} (${resp.status})`);

    const buf = new Uint8Array(await resp.arrayBuffer());
    console.log('[ExcelService] 📦 Bytes recibidos:', buf.byteLength.toLocaleString());

    // Detecta si realmente es gzip (0x1f 0x8b)
    const isGzip = buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b;

    let jsonStr: string;
    if (isGzip) {
      console.log('[ExcelService] 🗜️ Descomprimiendo con pako…');
      jsonStr = ungzip(buf, { to: 'string' }) as string;
    } else {
      console.log('[ExcelService] 🔤 No es gzip; decodificando como texto…');
      jsonStr = new TextDecoder('utf-8').decode(buf);
    }

    console.log('[ExcelService] 🧠 Parseando JSON…');
    const data = JSON.parse(jsonStr);

    if (!Array.isArray(data)) throw new Error('❌ El JSON no contiene un array.');
    console.log(`[ExcelService] ✅ Registros: ${data.length.toLocaleString()}`);
    console.timeEnd('[ExcelService] ⏱️ Total');
    return data;
  }
}
