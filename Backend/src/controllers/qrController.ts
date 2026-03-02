import { Request, Response } from "express";
import QRCode from "qrcode";
import crypto from "crypto";

export const generateQR = async (req: Request, res: Response) => {
    try {
        // Unique random session string
        const sessionToken = crypto.randomBytes(16).toString("hex");

        // 6-digit backup numeric code
        const numericCode = Math.floor(100000 + Math.random() * 900000);

        const payload = {
            sessionToken,
            numericCode,
            user: (req as any).user?.userId,
            expires: Date.now() + 5 * 60 * 1000 // 5 min expiration
        };

        const qrData = await QRCode.toDataURL(JSON.stringify(payload));

        res.json({
            qr: qrData,
            code: numericCode,
            expiresIn: 60
        });

    } catch (err) {
        res.status(500).json({ message: "QR generation failed" });
    }
};