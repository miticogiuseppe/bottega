import { createGzip } from "zlib";

/*
function escapeCsv(value) {
  if (value == null) return "";

  const str = String(value);

  let needsQuotes = false;

  // scan manuale (più veloce di regex)
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 34 || c === 10 || c === 44) {
      // " \n ,
      needsQuotes = true;
      break;
    }
  }

  if (!needsQuotes) return str;

  let out = '"';

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '"') out += '""';
    else out += c;
  }

  out += '"';

  return out;
}
*/

function escapeCsv(value) {
  if (value == null) return "";

  // numeri: output diretto, senza quote
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  const str = String(value);

  // stringhe: sempre tra virgolette
  let out = '"';

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '"')
      out += '""'; // escape CSV
    else out += c;
  }

  out += '"';

  return out;
}

class CsvBuffer {
  constructor() {
    this.parts = [];
    this.length = 0;
  }

  push(s) {
    this.parts.push(s);
    this.length += s.length;
  }

  flush() {
    const out = this.parts.join("");
    this.parts = [];
    this.length = 0;
    return out;
  }
}

export function createGzipStream(sourceStream, level = 6) {
  const gzip = createGzip({ level, chunkSize: 1024 * 1024 });

  return new ReadableStream({
    start(controller) {
      gzip.on("data", (chunk) => controller.enqueue(chunk));
      gzip.on("end", () => controller.close());
      gzip.on("error", (err) => controller.error(err));

      const reader = sourceStream.getReader();

      async function pump() {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            gzip.end();
            break;
          }
          const ok = gzip.write(value);
          if (!ok) {
            // buffer pieno, aspetta che si svuoti
            await new Promise((r) => gzip.once("drain", r));
          }
        }
      }

      pump().catch((err) => controller.error(err));
    },
  });
}
export function createCsvStream(sheet, jsonData) {
  const isArray = Array.isArray(sheet[0]);
  const keys = Object.keys(sheet[0] || []);

  return new ReadableStream({
    async start(controller) {
      let buffer = new CsvBuffer();
      const MIN = 1024 * 1024;

      {
        if (jsonData) buffer.push(JSON.stringify(jsonData) + "\n");
      }
      if (!isArray) {
        const parts = new Array(keys.length);
        for (let k = 0; k < keys.length; k++) parts[k] = escapeCsv(keys[k]);
        buffer.push(parts.join(",") + "\n");
      }
      for (const row of sheet) {
        const parts = new Array(keys.length);
        for (let k = 0; k < keys.length; k++)
          parts[k] = escapeCsv(row[keys[k]]);
        buffer.push(parts.join(",") + "\n");
        if (buffer.length >= MIN) controller.enqueue(buffer.flush());
      }

      if (buffer.length) controller.enqueue(buffer.flush());

      controller.close();
    },
  });
}
