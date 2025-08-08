import { Request, Response, NextFunction } from "express";
import db from "../../database/database"; // Ruta al archivo db.ts

const DeleteExpMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.method === "DELETE") {
        res.on("finish", async () => {
            const responseBody = res.locals.body;
            try {
                await db.query(
                    `INSERT INTO auditoria.t_logs_eventos(
                             direccion_ip, usuario, modulo, detalle, expediente)
                    VALUES ( $1, $2, $3, $4, $5);`,
                    [
                        responseBody.direccion_ip,
                        responseBody.usuario,
                        responseBody.modulo,
                        responseBody.detalle,
                        responseBody.expediente,
                    ]
                );
            } catch (error) {
                console.error("Error al registrar el log:", error);
            }
        });
    }
    next();
};

export default DeleteExpMiddleware;