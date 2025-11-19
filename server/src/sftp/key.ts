export const key = {
  host: process.env.SFTP_HOST || "localhost",
  port: Number(process.env.SFTP_PORT) || 22,
  username: process.env.SFTP_USER || "quipuscan_files_ssh",
  password: process.env.SFTP_PASS || "Quipu01cusco",
};

export function getRemotePath(folderPath: string, fileName?: string) {
  const normalizedFolder = folderPath.replace(/\\/g, "/").replace(/\/+/g, "/");
  return fileName
    ? `${normalizedFolder}/${fileName}`
    : normalizedFolder;
}