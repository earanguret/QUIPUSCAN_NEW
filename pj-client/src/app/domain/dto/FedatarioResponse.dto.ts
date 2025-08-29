export interface FedatarioResponse {
    id_fedatario: number | null;
    id_responsable: number | null;
    id_expediente: number | null;
    create_at: Date | null;
    observaciones?: string | null;
}

export interface FedatarioResponseDataView {
    id_fedatar: number;
    id_responsable: number;
    id_expediente: number;
    create_at: Date | null;
    responsable: string | null;
    username: string | null;

}

export interface CrearFedatarioResponse {
    message: string;
}