import { createFrameController } from "../controllers/frame.controller.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Frames
 *   description: Frame processing APIs
 */

/**
 * @swagger
 * /api/v1/frames:
 *   post:
 *     summary: Saves a new image frame
 *     tags: [Frames]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageData:
 *                 type: string
 *                 format: base64
 *     responses:
 *       '201':
 *         description: Frame saved successfully.
 *       '400':
 *         description: Bad Request.
 *       '500':
 *         description: Internal Server Error.
 */
router.post("/frames", createFrameController);

export default router;