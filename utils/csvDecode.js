import { dbGetItem, dbSetItem } from "@/utils/indexedDb";

function convert(value, quoted) {
  if (quoted) return value; // stringa SEMPRE

  // numero se possibile
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function parseHead(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  let isQuoted = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        isQuoted = true; // 👈 segna che questa cella era quoted
      }
    } else if (c === "," && !inQuotes) {
      result.push(convert(current, isQuoted));
      current = "";
      isQuoted = false;
    } else {
      current += c;
    }
  }

  result.push(convert(current, isQuoted));

  return result;
}
function parseLine(line, headers) {
  const result = {};
  let current = "";
  let inQuotes = false;
  let isQuoted = false;
  let idx = 0;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        isQuoted = true; // 👈 segna che questa cella era quoted
      }
    } else if (c === "," && !inQuotes) {
      result[headers[idx++]] = convert(current, isQuoted);
      current = "";
      isQuoted = false;
    } else {
      current += c;
    }
  }

  result[headers[idx++]] = convert(current, isQuoted);

  return result;
}

function splitLines(buffer) {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < buffer.length; i++) {
    const c = buffer[i];

    if (c === '"') {
      // gestisce escape ""
      if (inQuotes && buffer[i + 1] === '"') {
        current += '"';
        i++;
        continue;
      }

      inQuotes = !inQuotes;
      current += c;
      continue;
    }

    if (c === "\n" && !inQuotes) {
      lines.push(current.replace(/\r$/, ""));
      current = "";
    } else {
      current += c;
    }
  }

  return { lines, rest: current };
}

export async function csvDecode(webStream) {
  const reader = webStream.getReader();
  const decoder = new TextDecoder();

  let outp = {};
  const result = [];
  let buffer = "";
  let headLine = true;
  let firstLine = true;
  let headers;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const { lines, rest } = splitLines(buffer);
    buffer = rest;

    if (firstLine) {
      let line = lines.shift();
      outp = JSON.parse(line);
      firstLine = false;
    }
    if (headLine) {
      let line = lines.shift();
      headers = parseHead(line);
      headLine = false;
    }

    for (const line of lines) {
      result.push(parseLine(line, headers));
    }
  }

  buffer += decoder.decode();
  if (buffer) result.push(parseLine(buffer));

  return { ...outp, data: result };
}

export async function fetchCsvCached(input, init, user) {
  let key = input + "§" + (user ?? "");
  let cached = await dbGetItem(key);

  if (cached) input += "&lwt=" + encodeURIComponent(cached.lwt);

  const response = await fetch(input, init);
  if (response.status === 204) return cached;

  let json = await csvDecode(response.body);
  await dbSetItem(key, json);
  return json;
}
