import { Request, Response, NextFunction } from "express";
import db from "../../database/database"; // Ruta al archivo db.ts

const logAccesoMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.on("finish", async () => {
        const responseBody = res.locals.body;

        if (!responseBody) {
            console.error("responseBody no está definido.");
            return;
        }
        try {
            await db.query(
                `INSERT INTO auditoria.t_logs_accesos(
                        direccion_ip, usuario, detalle)
                    VALUES ($1, $2, $3); `,
                [
                    
                    responseBody.direccion_ip,
                    responseBody.usuario,
                    responseBody.detalle,
                ]
            );
            console.log("Log registrado correctamente");
        } catch (error) {
            console.error("Error al registrar el log:", error);
        }
    });
    next();
};

export default logAccesoMiddleware;