export interface Respuesta {
    area: string;
    responsable: string;
    fecha: string;
    respuesta: string;
}

export interface Mensaje {
    area_remitente: string;
    responsable: string;
    destino: string;
    fecha: string;
    mensaje: string;
    respuestas: Respuesta[];
}