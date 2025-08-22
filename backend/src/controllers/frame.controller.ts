import { Request, Response } from "express";
import { saveFrameFromBase64 } from "../services/frame.service.js";

export const createFrameController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { imageData } = req.body;
        if(!imageData) {
            return res.status(400).json({ message: "No image data provided." });
        }
        const fileName = await saveFrameFromBase64(imageData);
        return res.status(201).json({ message: "Frame saved successfully.", file: fileName });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};