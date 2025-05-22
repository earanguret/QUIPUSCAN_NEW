import { Request, Response } from "express";
import  db  from '../database/database';
import { key } from '../database/key';

class EstadoExpedienteController {

    public async CrearEstadoExpediente(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const { id_expediente, estado_recepcionado, app_user } = req.body;
            const consulta = `
                INSERT INTO archivo.t_estado_expediente(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    id_expediente, 
                    estado_recepcionado
                    )
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_expediente,
                estado_recepcionado,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error("Error al insertar estado expediente:", error);
                    res.status(500).json({ error: "Error interno del servidor" });
                } else {
                    const idEstadoExpediente = resultado.rows[0]["id_estado_expediente"]; // ID se encuentra en la primera fila
                    console.log("Estado expediente creado correctamente");
                    res.status(200).json({ message: "Estado expediente creado correctamente" });
                }
            });
        } catch (error) {
            console.error("Error interno en el servidor:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    public async AprobarPreparacion(req: Request, res: Response) {

    }

    public async AprobarDigitalizacion(req: Request, res: Response) {

    }

    public async AprobarIndizacion(req: Request, res: Response) {

    }

    public async AprobarControl(req: Request, res: Response) {

    }

    public async AprobarFedado(req: Request, res: Response) {

    }


    public async DesaprobarControlDigitalizacion(req: Request, res: Response) {

    }

    public async DesaprobarControlIndizacion(req: Request, res: Response) {

    }

    public async DesaprobarFedatarioDigitalizacion(req: Request, res: Response) {

    }

    public async DesaprobarFedatarioIndizacion(req: Request, res: Response) {

    }

    public async ActivarEstadoRechazado(req: Request, res: Response) {


    }

    public async DesactivarEstadoRechazado(req: Request, res: Response) {

    }

    public async AnularEstadoRechazado(req: Request, res: Response) {

    }

    public async ActivarEstadoFinalizado(req: Request, res: Response) {

    }

    public async AsociarDisco(req: Request, res: Response) {

    }

    public async ModificarMensaje(req: Request, res: Response) {

    }
        
}

const estadoExpedienteController = new EstadoExpedienteController();
export default estadoExpedienteController;