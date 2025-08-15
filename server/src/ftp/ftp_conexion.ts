import * as ftp from "basic-ftp";
import { key } from "./key";

export async function createFtpClientConexion(): Promise<ftp.Client> {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Logs de depuración

    try {
        await client.access(key);
        console.log("✅ Conectado al servidor FTP");
        return client;
    } catch (err) {
        console.error("❌ Error al conectar al servidor FTP:", err);
        throw new Error("Error al conectar al servidor FTP");
    }
}