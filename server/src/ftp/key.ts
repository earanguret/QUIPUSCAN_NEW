export const key =  {
    host: process.env.FTP_HOST || "172.17.70.118",
    user: process.env.FTP_USER || "user1",
    password: process.env.FTP_PASS || "123",
    secure: true,
    secureOptions: { rejectUnauthorized: false } // ⚠️ Solo para certificados autofirmados
}