import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const ensureUploadsDirExists = async(): Promise<void> => {
    try {
        await fs.access(UPLOADS_DIR);
    } catch (error) {
        await fs.mkdir(UPLOADS_DIR, { recursive: true })
    }
};

export const saveFrameFromBase64 = async (imageData: string): Promise<string> => {
    await ensureUploadsDirExists();
    if(!imageData || typeof imageData !== 'string') {
        throw new Error("Invalid image data provided.");
    }
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `frame-${Date.now()}.jpeg`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    await fs.writeFile(filePath, base64Data, "base64");
    return fileName;
};