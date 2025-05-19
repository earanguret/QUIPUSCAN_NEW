import { Response, Request } from "express";
import db from '../database/database';
import { key } from '../database/key';

class InventarioController {
    public async listarInventario(req: Request, res: Response): Promise<any> {
        try {
          const personas = await db.query("select * from archivo.t_inventario");
          res.json(personas["rows"]);
        } catch (error) {
          console.error("Error al obtener lista de inventarios:", error);
          res.status(500).json({ error: "Error interno del servidor" });
        }
      }

      public async listarInventarioDetalle(
        req: Request,
        res: Response
      ): Promise<any> {
        try {
          const consulta = `
                            SELECT
                                i.id_inventario,
                                i.anio,
                                i.cantidad,
                                i.tipo_doc,
                                i.serie_doc,
                                i.especialidad,
                                i.cantidad,
                                i.codigo,
                                i.sede,
                                i.create_at,
                                i.id_responsable,
                                u.username,
                                p.nombre,
                                p.ap_paterno,
                                p.ap_materno
                            
                            FROM
                                archivo.t_inventario i
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            ORDER BY i.anio DESC 
                                `;
          const inventario = await db.query(consulta);
    
          if (inventario && inventario["rows"].length > 0) {
            res.json(inventario["rows"]);
          } else {
            res.status(404).json({ text: "la lista de inventario no existe" });
          }
        } catch (error) {
          console.error("Error al obtener lista de inventario:", error);
          res.status(500).json({ error: "Error interno del servidor" });
        }
      }

      public async ObtenerInventarioDetalleXid(
        req: Request,
        res: Response
      ): Promise<void> {
        try {
          const { id } = req.params;
          const consulta = `
                            SELECT
                                i.id_inventario,
                                i.anio,
                                i.cantidad,
                                i.tipo_doc,
                                i.serie_doc,
                                i.especialidad,
                                i.codigo,
                                i.sede,
                                i.create_at,
                                i.id_responsable,
                                u.username,
                                u.perfil,
                                u.estado,
                                p.nombre,
                                p.ap_paterno,
                                p.ap_materno
                            FROM
                                archivo.t_inventario i
                            JOIN
                                archivo.t_usuario u ON i.id_responsable = u.id_usuario
                            JOIN
                                archivo.t_persona p ON u.id_persona = p.id_persona
                            WHERE 
                                i.id_inventario=$1
                                 `;
          const inventario = await db.query(consulta, [id]);
    
          if (inventario && inventario["rows"].length > 0) {
            res.json(inventario["rows"]);
          } else {
            res.status(404).json({ text: "el inventario detalle no existe" });
          }
        } catch (error) {
          console.error("Error al obtener inventario detalle:", error);
          res.status(500).json({ error: "Error interno del servidor" });
        }
      }

      public async CrearInventario(req: Request, res: Response): Promise<void> {
        try {
          const {
            id_responsable,
            anio,
            cantidad,
            tipo_doc,
            serie_doc,
            especialidad,
            sede,
            codigo,
            app_user,
          } = req.body;
          const ipAddressClient =
            req.headers["x-forwarded-for"] || req.socket.remoteAddress;
          const consulta = `
                        INSERT INTO archivo.t_inventario(

                            f_aud,        -- fecha de la transaccion
                            b_aud,        -- tipo de transaccion ('I')
                            c_aud_uid,    -- usuario de base de datos
                            c_aud_uidred, -- usuario del sistema
                            c_aud_pc,     -- nombre de la pc 
                            c_aud_ip,     -- ip de la pc
                            c_aud_mac,

                            create_at,
                            id_responsable, 
                            anio, 
                            cantidad, 
                            tipo_doc, 
                            serie_doc, 
                            especialidad, 
                            sede, 
                            codigo)    
                        VALUES (CURRENT_TIMESTAMP ,'I', '${key.user}', $1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6,$7, $8, $9, $10, $11, $12)
                        RETURNING id_inventario; -- Devolver el ID del inventario insertado
                `;
          const valores = [
            app_user,
            null,
            ipAddressClient,
            null,
            id_responsable,
            anio,
            cantidad,
            tipo_doc,
            serie_doc,
            especialidad,
            sede,
            codigo,
          ];
    
          db.query(consulta, valores, (error, resultado) => {
            if (error) {
              console.error("Error al insertar inventario:", error);
              res.status(500).json({ error: "Error interno del servidor" });
            } else {
              const idinventario = resultado.rows[0]["id_inventario"]; // ID se encuentra en la primera fila
              console.log("datos de inventario en BD:", idinventario);
              
              res.status(200).json({
                id_inventario: idinventario,
                text: "el inventario se creó correctamente",
              });
            }
          });
        } catch (error) {
          console.error("Error al crear inventario:", error);
          // Almacena el error en res.locals
          res.locals.body = {
            text: `"Error al crear el inventario:"${error}`,
          };
          res.status(500).json({ error: "Error interno del servidor" });
        }
      }
}

const inventarioController = new InventarioController();
export default inventarioController;