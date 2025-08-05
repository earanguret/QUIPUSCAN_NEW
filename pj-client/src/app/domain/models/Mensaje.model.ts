export interface Respuesta {
    area: string;
    responsable: string;
    fecha: Date;
    respuesta: string;
}

export interface Mensaje {
    area_remitente: string;
    responsable: string;
    destino: string;
    fecha: Date;
    mensaje: string;
    respuestas: Respuesta[];
}