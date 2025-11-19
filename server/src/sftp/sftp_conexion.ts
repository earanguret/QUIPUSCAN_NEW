import { createPool, Pool } from "generic-pool";
import Client from "ssh2-sftp-client";
import { key } from "./key";

/**
 * Crea una nueva conexión SFTP
 */
async function createConnection(): Promise<Client> {
  const sftp = new Client();

  await sftp.connect({
    host: key.host,
    port: key.port,
    username: key.username,
    password: key.password,
    readyTimeout: 20000,
    keepaliveInterval: 10000,
    keepaliveCountMax: 3,
    algorithms: {
      serverHostKey: ["ssh-rsa", "ssh-ed25519"],
    },
    hostVerifier: () => true,
  });

  console.log("🔌 Nueva conexión SFTP creada");
  return sftp;
}

/**
 * Cierra una conexión SFTP
 */
async function destroyConnection(sftp: Client) {
  await sftp.end();
  console.log("❌ Conexión SFTP cerrada");
}

/**
 * Configuración del pool
 */
const factory = {
  create: createConnection,
  destroy: destroyConnection,
};

const opts = {
  min: 1,
  max: 10, // máximo de conexiones simultáneas
  idleTimeoutMillis: 30000, // cierra las conexiones inactivas después de 30s
};

/**
 * Exporta el pool
 */
export const sftpPool: Pool<Client> = createPool(factory, opts);

/**
 * Helper para ejecutar operaciones usando una conexión del pool
 */
export async function useSftpConnection<T>(
  fn: (sftp: Client) => Promise<T>
): Promise<T> {
  const sftp = await sftpPool.acquire();
  try {
    return await fn(sftp);
  } finally {
    await sftpPool.release(sftp);
  }
}
