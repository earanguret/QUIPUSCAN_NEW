import { Request, Response } from "express";
import db from '../database/database';
import { key } from '../database/key';

class FlujogramaController {
    public async listarFlujogramaByIdExpediente(req: Request, res: Response): Promise<any> {
        try {
            const flujograma = await db.query('select created_at, id_flujograma, id_expediente, id_responsable, area from archivo.t_flujograma where id_expediente = $1', [req.params.id]);
            res.status(200).json(flujograma['rows']);
        } catch (error) {
            console.error('Error al obtener flujograma:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    public async crearFlujograma(req: Request, res: Response) {
        try {
            const ipAddressClient = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const { id_expediente, id_responsable, area, app_user } = req.body;
            const consulta = `
                INSERT INTO archivo.t_flujograma(
                    f_aud,        -- fecha de la transaccion
                    b_aud,        -- tipo de transaccion ('I')
                    c_aud_uid,    -- usuario de base de datos
                    c_aud_uidred, -- usuario del sistema
                    c_aud_pc,     -- nombre de la pc 
                    c_aud_ip,     -- ip de la pc
                    c_aud_mac,

                    create_at,
                    id_expediente, 
                    id_responsable, 
                    area)
                VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7);
    `;
            const valores = [
                app_user,
                null,
                ipAddressClient,
                null,
                id_expediente,
                id_responsable,
                area,
            ];

            db.query(consulta, valores, (error, resultado) => {
                if (error) {
                    console.error('Error al insertar flujograma:', error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else {
                    // ID se encuentra en la primera fila

                    res.status(200).json({
                        message: 'El flujograma se creó correctamente',
                    });
                }
            });
        } catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    EliminarFlujograma(req: Request, res: Response) {
        try {
            const { id_expediente } = req.params;
            const consulta = `
                            DELETE FROM archivo.t_flujograma WHERE id_expediente=$1 AND area=$2;
                        `;
            const valores = [id_expediente, 'RECEPCION'];

            db.query(consulta, valores, (error) => {
                if (error) {
                    console.error('Error al eliminar flujograma:', error);
                } else {
                    console.log('flujograma eliminado correctamente');
                    res.status(200).json({ message: 'flujograma eliminado correctamente' });
                }
            });
        }
        catch (error) {
            console.error('Error interno en el servidor:', error);
            res.status(500).json({ error: 'Error interno del servidor' });

        }

    }


}

const flujogramaController = new FlujogramaController();
export default flujogramaController;