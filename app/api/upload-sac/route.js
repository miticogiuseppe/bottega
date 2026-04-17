import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const category = formData.get("category");
    const subfolder = formData.get("subfolder"); // null se non ha sottocartelle
    const files = formData.getAll("files");

    if (!category || files.length === 0) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const basePath = process.env.DRIVE_PATH_SAC;

    // Costruisce il percorso di destinazione
    const destFolder = subfolder
      ? path.join(basePath, category, subfolder)
      : path.join(basePath, category);

    // Crea la cartella se non esiste
    await mkdir(destFolder, { recursive: true });

    // Salva ogni file
    const saved = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(destFolder, file.name);
      await writeFile(filePath, buffer);
      saved.push(file.name);
    }

    return NextResponse.json({ success: true, saved }, { status: 200 });
  } catch (error) {
    console.error("Errore upload:", error);
    return NextResponse.json(
      { error: "Errore durante il caricamento" },
      { status: 500 },
    );
  }
}
