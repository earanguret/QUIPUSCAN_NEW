import { Request, Response } from "express";
import forge from 'node-forge';
import { sign } from "pdf-signer";
import { Readable } from "stream";
import { WritableStreamBuffer } from 'stream-buffers';
import { degrees, PDFDocument } from 'pdf-lib';
import { createFtpClientConexion } from "../ftp/ftp_conexion";
import { useSftpConnection } from "../sftp/sftp_conexion";



class FtpServerController {

    isRunning = false;
    constructor() {

    }

    public async buscarFirmaDigitalByUsername(req: Request, res: Response): Promise<any> {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                ok: false,
                mensaje: "El nombre de usuario es requerido.",
            });
        }

        try {
            // Usamos el pool de SFTP
            const existe = await useSftpConnection(async (sftp) => {
               

                // Listar archivos dentro de CERTIFICADOS
                const fileList = await sftp.list("CERTIFICADOS");

                const nombreCertificado = `${username}.pfx`;
                const archivoEncontrado = fileList.find(file => file.name === nombreCertificado);

                return archivoEncontrado ? nombreCertificado : null;
            });

            if (!existe) {
                return res.status(404).json({
                    existe: false,
                    mensaje: `No existe certificado para el usuario '${username}'.`,
                });
            }

            return res.status(200).json({
                existe: true,
                mensaje: "Certificado asociado.",
                certificado: existe,
            });

        } catch (error) {
            console.error("❌ Error al buscar firma digital por username:", error);
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar firma digital por username",
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    public async firmarDocumentoDesdeFTP(req: Request, res: Response): Promise<any> {
        try {
            const {
                nombrePdf,
                nombreCertificado,
                password,
                ubicacion,
                cargo,
                carpetaOrigen,
                carpetaFirmados,
                carpetaCertificados
            } = req.body;

            if (!nombrePdf || !nombreCertificado || !password || !ubicacion || !cargo ||
                !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Faltan datos requeridos: nombrePdf, nombreCertificado, password, ubicacion, cargo, carpetaOrigen, carpetaFirmados, carpetaCertificados"
                });
            }

            // ----------------------------------------------------
            // TODO LO QUE OCURRE DENTRO DEL POOL SFTP
            // ----------------------------------------------------
            return await useSftpConnection(async (sftp) => {

                // ---------- DESCARGAR PDF ----------
                const pdfPath = `${carpetaOrigen}/${nombrePdf}`;
                const pdfBuffer = await sftp.get(pdfPath);
                if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
                    return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde SFTP" });
                }

                // ---------- DESCARGAR CERTIFICADO ----------
                const certPath = `${carpetaCertificados}/${nombreCertificado}`;
                const certBuffer = await sftp.get(certPath);
                if (!certBuffer || !Buffer.isBuffer(certBuffer)) {
                    return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde SFTP" });
                }

                // ---------- DESCARGAR IMAGEN DE FIRMA ----------
                const imgPath = `${carpetaCertificados}/img/firmadigitalv3_.png`;
                const imageBuffer = await sftp.get(imgPath);
                if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
                    return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde SFTP" });
                }

                // =====================================================
                // PROCESO DEL CERTIFICADO P12
                // =====================================================
                const certBase64 = certBuffer.toString("base64");
                const p12Asn1 = forge.asn1.fromDer(forge.util.decode64(certBase64));
                const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

                const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
                const certBag = bags[forge.pki.oids.certBag];
                if (!certBag || certBag.length === 0 || !certBag[0].cert) {
                    return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
                }

                function toUtf8Safe(value: any): string {
                    if (!value) return "";
                    if (typeof value !== "string") return String(value);
                    return Buffer.from(value, "latin1").toString("utf8");
                }

                const cert = certBag[0].cert;

                const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
                const nombreFirmante = cnAttr ? toUtf8Safe(cnAttr.value) : "Firmante desconocido";

                const locAttr = cert.subject.attributes.find(attr => attr.name === "localityName");
                const location = locAttr ? toUtf8Safe(locAttr.value) : "Ubicación desconocida";

                // Fechas
                const fechaActual = new Date();
                const fechaStr = fechaActual.toLocaleDateString();
                const horaStr = (() => {
                    let horas = fechaActual.getHours();
                    const minutos = fechaActual.getMinutes().toString().padStart(2, "0");
                    const ampm = horas >= 12 ? "PM" : "AM";
                    horas = horas % 12 || 12;
                    return `${horas}:${minutos} ${ampm}`;
                })();

                // =====================================================
                // FIRMA VISUAL PDF
                // =====================================================
                const pdfDoc = await PDFDocument.load(pdfBuffer);
                const firmaImage = await pdfDoc.embedPng(imageBuffer);
                const pages = pdfDoc.getPages();
                const firstPage = pages[0];

                const scale = 0.4;
                const { width, height } = firmaImage.scale(scale);

                firstPage.drawImage(firmaImage, {
                    x: 25,
                    y: 740,
                    width,
                    height,
                });

                const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });

                function ensureUtf8(str: string): string {
                    if (!str) return "";
                    return Buffer.from(str, "utf8").toString("utf8");
                }

                const opcionesFirma = {
                    reason: "Firma digital",
                    location: ensureUtf8(location),
                    signerName: ensureUtf8(nombreFirmante),
                    annotationAppearanceOptions: {
                        signatureCoordinates: { left: 0, bottom: 720, right: 400, top: 830 },
                        signatureDetails: [
                            { value: `Firmado por ${nombreFirmante}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 32, space: 1, rotate: 0, tilt: 0 } },
                            { value: `Cargo: ${cargo}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 28, space: 1, rotate: 0, tilt: 0 } },
                            { value: `Fecha: ${fechaStr}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 24, space: 1, rotate: 0, tilt: 0 } },
                            { value: `Hora: ${horaStr}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
                        ]
                    }
                };


                const signedPdfBuffer = await sign(
                    Buffer.from(visualSignedPdf),
                    certBuffer,
                    password,
                    opcionesFirma
                );

                // =====================================================
                // SUBIR PDF FIRMADO AL SFTP
                // =====================================================
                const outputPath = `${carpetaFirmados}/${nombrePdf}`;

                await sftp.mkdir(`${carpetaFirmados}`).catch(() => { }); // por si ya existe
                await sftp.put(signedPdfBuffer, outputPath);

                return res.status(200).json({
                    ok: true,
                    mensaje: "PDF firmado y subido correctamente al SFTP",
                    archivoFirmado: nombrePdf,
                    firmadoPor: nombreFirmante,
                    cargo,
                    fecha: fechaStr,
                    hora: horaStr
                });
            });

        } catch (error) {
            console.error("Error al firmar documento desde SFTP:", error);
            return res.status(500).json({
                ok: false,
                mensaje: "Error al firmar el documento desde SFTP",
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    public async CertInfoFromFTP(req: Request, res: Response): Promise<any> {

        // Fix Encoding
        const fixEncoding = (value: string): string => {
            return Buffer.from(value, "latin1").toString("utf8");
        };

        try {
            const { nombreCertificado, password, carpetaCertificados } = req.body;

            if (!nombreCertificado || !password || !carpetaCertificados) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Faltan datos requeridos: nombreCertificado, password, carpetaCertificados",
                });
            }

            // Aquí guardaremos el buffer del certificado
            let certBuffer: Buffer | null = null;

            // 🔹 Pool de conexiones SFTP
            await useSftpConnection(async (sftp) => {
                const remotePath = `${carpetaCertificados}/${nombreCertificado}`;

                // Verificar si el archivo existe
                let fileList;
                try {
                    fileList = await sftp.list(carpetaCertificados);
                } catch (e) {
                    console.log(remotePath)
                    throw new Error("No se pudo acceder a la carpeta de certificados en el SFTP. " );

                }

                const encontrado = fileList.find(f => f.name === nombreCertificado);
                if (!encontrado) {
                    return res.status(404).json({
                        ok: false,
                        mensaje: `El certificado ${nombreCertificado} no existe en el SFTP.`,
                        existe: false
                    });
                }

                // Descargar archivo a memoria
                const fileData = await sftp.get(remotePath);

                if (Buffer.isBuffer(fileData)) {
                    certBuffer = fileData;
                } else if (typeof fileData === "string") {
                    certBuffer = Buffer.from(fileData);
                } else {
                    // WritableStream → convertir a Buffer
                    certBuffer = await new Promise<Buffer>((resolve, reject) => {
                        const chunks: Buffer[] = [];
                        fileData.on("data", (chunk: Buffer) => chunks.push(chunk));
                        fileData.on("end", () => resolve(Buffer.concat(chunks)));
                        fileData.on("error", reject);
                    });
                }
            });

            if (!certBuffer) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "No se pudo obtener el certificado desde el SFTP"
                });
            }

            // ============================
            //  PROCESAR CERTIFICADO .PFX
            // ============================

            const p12Asn1 = forge.asn1.fromDer(
                forge.util.createBuffer(new Uint8Array(certBuffer))
            );
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag];

            if (!certBag || certBag.length === 0 || !certBag[0].cert) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "No se pudo extraer el certificado del archivo"
                });
            }

            const cert = certBag[0].cert;

            // Extraer Subject
            const subject: Record<string, string> = {};
            cert.subject.attributes.forEach(attr => {
                if (attr.name) {
                    let val = typeof attr.value === "string" ? fixEncoding(attr.value) : String(attr.value);
                    subject[attr.name] = val;
                }
            });

            // Extraer Issuer
            const issuer: Record<string, string> = {};
            cert.issuer.attributes.forEach(attr => {
                if (attr.name) {
                    let val = typeof attr.value === "string" ? fixEncoding(attr.value) : String(attr.value);
                    issuer[attr.name] = val;
                }
            });

            // Respuesta final
            return res.status(200).json({
                ok: true,
                certificado: {
                    subject,
                    issuer,
                    validFrom: cert.validity.notBefore,
                    validTo: cert.validity.notAfter,
                    serialNumber: cert.serialNumber,
                },
            });

        } catch (error) {
            console.error("❌ Error al procesar certificado:", error);

            return res.status(500).json({
                ok: false,
                mensaje: "Error al procesar certificado",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }



    // public async firmarDocumentoDesdeFTP(req: Request, res: Response): Promise<any> {
    //     let client;
    //     try {
    //         const {
    //             nombrePdf,
    //             nombreCertificado, // archivo .p12
    //             password,
    //             ubicacion,
    //             cargo,
    //             carpetaOrigen,
    //             carpetaFirmados,
    //             carpetaCertificados // contiene también la imagen
    //         } = req.body;

    //         if (!nombrePdf || !nombreCertificado || !password || !ubicacion || !cargo || !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: "Faltan datos requeridos: nombrePdf, nombreCertificado, password, ubicacion, cargo, carpetaOrigen, carpetaFirmados, carpetaCertificados"
    //             });
    //         }

    //         client = await createFtpClientConexion();

    //         // Descargar PDF
    //         const pdfStream = new WritableStreamBuffer();
    //         await client.downloadTo(pdfStream, `${carpetaOrigen}/${nombrePdf}`);
    //         const pdfBuffer = pdfStream.getContents();
    //         if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde el FTP" });
    //         }

    //         // Descargar certificado (.p12)
    //         const certStream = new WritableStreamBuffer();
    //         await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
    //         const certBuffer = certStream.getContents();
    //         if (!certBuffer || !Buffer.isBuffer(certBuffer)) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
    //         }

    //         // Descargar imagen de firma
    //         const imgStream = new WritableStreamBuffer();
    //         await client.downloadTo(imgStream, `${carpetaCertificados}/img/firmadigitalv3_.png`);
    //         const imageBuffer = imgStream.getContents();
    //         if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde el FTP" });
    //         }

    //         // -----------------------
    //         // Procesar certificado (.p12) — con corrección de codificación
    //         // -----------------------
    //         // Convertimos a base64 y usamos forge.util.decode64 para obtener el DER correcto
    //         const certBase64 = (certBuffer as Buffer).toString("base64");
    //         const p12Asn1 = forge.asn1.fromDer(forge.util.decode64(certBase64));
    //         const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    //         const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    //         const certBag = bags[forge.pki.oids.certBag];
    //         if (!certBag || certBag.length === 0 || !certBag[0].cert) {
    //             return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
    //         }
    //         function toUtf8Safe(value: any): string {
    //             if (!value) return "";
    //             if (typeof value !== "string") return String(value);

    //             return Buffer.from(value, "latin1").toString("utf8");
    //         }

    //         // ---- después de extraer el certificado ----
    //         const cert = certBag[0].cert;

    //         console.log("=== ATRIBUTOS DEL CERTIFICADO ===");
    //         cert.subject.attributes.forEach(attr => {
    //             console.log(`${attr.name}: "${toUtf8Safe(attr.value)}" (raw: "${attr.value}")`);
    //         });
    //         console.log("=================================");



    //         // Buscar CN (nombre del firmante)
    //         const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
    //         const nombreFirmante = cnAttr ? toUtf8Safe(cnAttr.value) : "Firmante desconocido";

    //         // Buscar localityName (ubicación)
    //         const locAttr = cert.subject.attributes.find(attr => attr.name === "localityName");
    //         const location = locAttr ? toUtf8Safe(locAttr.value) : "Ubicación desconocida";

    //         // Fechas
    //         const fechaActual = new Date();
    //         const fechaStr = fechaActual.toLocaleDateString();
    //         function formatHora(fecha: Date): string {
    //             let horas = fecha.getHours();
    //             const minutos = fecha.getMinutes().toString().padStart(2, "0");
    //             const ampm = horas >= 12 ? "PM" : "AM";
    //             horas = horas % 12 || 12; // de 0–23 a 1–12
    //             return `${horas}:${minutos} ${ampm}`;
    //         }

    //         const horaStr = formatHora(new Date()); // "3:45 PM"

    //         // Firma visual (embed de imagen)
    //         const pdfDoc = await PDFDocument.load(pdfBuffer);
    //         const firmaImage = await pdfDoc.embedPng(imageBuffer);
    //         const pages = pdfDoc.getPages();
    //         const firstPage = pages[0];

    //         const scale = 0.4;
    //         const { width, height } = firmaImage.scale(scale);






    //         firstPage.drawImage(firmaImage, {
    //             x: 25,       // posición base X
    //             y: 740,      // posición base Y
    //             width,       // ancho de la imagen
    //             height,      // alto de la imagen
    //             //rotate: degrees(90), // rotación 90 grados
    //         });



    //         // firstPage.drawImage(firmaImage, {
    //         //     x: 25,
    //         //     y: 740,
    //         //     width,
    //         //     height,
    //         // });

    //         // Guarda el PDF visual con la firma
    //         const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });
    //         const visualSignedBuffer = Buffer.from(visualSignedPdf);

    //         // Asegura que siempre quede en UTF-8
    //         function ensureUtf8(str: string): string {
    //             if (!str) return "";
    //             return Buffer.from(str, "utf8").toString("utf8");
    //         }

    //         // Firma digital (con datos)
    //         const opcionesFirma = {
    //             reason: "Firma digital",
    //             location: ensureUtf8(location),
    //             signerName: ensureUtf8(nombreFirmante),
    //             annotationAppearanceOptions: {
    //                 signatureCoordinates: { left: 0, bottom: 720, right: 400, top: 830 },
    //                 signatureDetails: [
    //                     { value: `Firmado por ${nombreFirmante}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 32, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: `Cargo: ${cargo}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 28, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: `Fecha: ${fechaStr}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 24, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: `Hora: ${horaStr}`, fontSize: 3, transformOptions: { xPos: 40, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
    //                 ]
    //             }
    //         };

    //         // sign(...) debe aceptar certBuffer y password tal como antes
    //         const signedPdfBuffer = await sign(visualSignedBuffer, certBuffer as Buffer, password, opcionesFirma);

    //         // Subir al FTP
    //         const fullOutputPath = `${carpetaFirmados}/${nombrePdf}`;
    //         await client.ensureDir(carpetaFirmados);
    //         const readableSignedPdf = Readable.from(signedPdfBuffer);
    //         await client.uploadFrom(readableSignedPdf, fullOutputPath);

    //         return res.status(200).json({
    //             ok: true,
    //             mensaje: "PDF firmado y subido correctamente al FTP",
    //             archivoFirmado: nombrePdf,
    //             firmadoPor: nombreFirmante,
    //             cargo,
    //             fecha: fechaStr,
    //             hora: horaStr
    //         });

    //     } catch (error) {
    //         console.error("Error al firmar documento desde FTP:", error);
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error al firmar el documento desde FTP",
    //             error: error instanceof Error ? error.message : String(error)
    //         });
    //     } finally {
    //         client?.close();
    //     }
    // }


    // public async firmarDocumentoDesdeFTP(req: Request, res: Response): Promise<any> {
    //     let client
    //     try {
    //         const {
    //             nombrePdf,
    //             nombreCertificado, // archivo .p12
    //             password,
    //             ubicacion,
    //             cargo,
    //             carpetaOrigen,
    //             carpetaFirmados,
    //             carpetaCertificados // contiene también la imagen
    //         } = req.body;


    //         if (!nombrePdf || !nombreCertificado || !password || !ubicacion || !cargo || !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: "Faltan datos requeridos: nombrePdf, nombreCertificado, password, ubicacion, cargo, carpetaOrigen, carpetaFirmados, carpetaCertificados"
    //             });
    //         }


    //         client = await createFtpClientConexion();

    //         // Descargar PDF
    //         const pdfStream = new WritableStreamBuffer();
    //         await client.downloadTo(pdfStream, `${carpetaOrigen}/${nombrePdf}`);
    //         const pdfBuffer = pdfStream.getContents();

    //         // Descargar certificado (.p12)
    //         const certStream = new WritableStreamBuffer();
    //         await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
    //         const certBuffer = certStream.getContents();

    //         // Descargar imagen de firma
    //         const imgStream = new WritableStreamBuffer();
    //         await client.downloadTo(imgStream, `${carpetaCertificados}/img/firmadigitalv3_.png`);
    //         const imageBuffer = imgStream.getContents();

    //         // Procesar certificado
    //         // const certBinary = certBuffer.toString("binary");
    //         // const p12Asn1 = forge.asn1.fromDer(certBinary);
    //         // const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    //         if (!certBuffer) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
    //         }

    //         const p12Asn1 = forge.asn1.fromDer(forge.util.createBuffer(certBuffer));
    //         const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    //         const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    //         const certBag = bags[forge.pki.oids.certBag];
    //         if (!certBag || certBag.length === 0 || !certBag[0].cert) {
    //             return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
    //         }

    //         const cert = certBag[0].cert;
    //         const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
    //         const nombreFirmante = typeof cnAttr?.value === "string"
    //             ? cnAttr.value
    //             : Array.isArray(cnAttr?.value) ? cnAttr.value.join(" ") : "Firmante desconocido";

    //         const fechaActual = new Date();
    //         const fechaStr = fechaActual.toLocaleDateString();
    //         const horaStr = fechaActual.toLocaleTimeString();


    //         if (!pdfBuffer) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde el FTP" });
    //         }
    //         if (!imageBuffer) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde el FTP" });
    //         }
    //         if (!certBuffer) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
    //         }
    //         // Firma visual
    //         const pdfDoc = await PDFDocument.load(pdfBuffer);
    //         const firmaImage = await pdfDoc.embedPng(imageBuffer);
    //         const pages = pdfDoc.getPages();
    //         const firstPage = pages[0];

    //         const scale = 0.5;
    //         const { width, height } = firmaImage.scale(scale);

    //         firstPage.drawImage(firmaImage, {
    //             x: 0,
    //             y: 750,
    //             width,
    //             height,
    //         });

    //         const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });
    //         const visualSignedBuffer = Buffer.from(visualSignedPdf);

    //         // Firma digital (con datos)
    //         const opcionesFirma = {
    //             reason: "Firma digital",
    //             location: ubicacion,
    //             signerName: nombreFirmante,
    //             annotationAppearanceOptions: {
    //                 signatureCoordinates: { left: 0, bottom: 750, right: 200, top: 830 },
    //                 signatureDetails: [
    //                     { value: "Firmado por: " + nombreFirmante, fontSize: 5, transformOptions: { xPos: 20, yPos: 50, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: "Cargo: " + cargo, fontSize: 5, transformOptions: { xPos: 20, yPos: 40, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: "Fecha: " + fechaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 30, space: 1, rotate: 0, tilt: 0 } },
    //                     { value: "Hora: " + horaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
    //                 ]
    //             }
    //         };

    //         const signedPdfBuffer = await sign(visualSignedBuffer, certBuffer, password, opcionesFirma);

    //         // Subir al FTP
    //         // const nombreFirmado = `${nombrePdf}`;
    //         const fullOutputPath = `${carpetaFirmados}/${nombrePdf}`;
    //         await client.ensureDir(carpetaFirmados);
    //         const readableSignedPdf = Readable.from(signedPdfBuffer);
    //         await client.uploadFrom(readableSignedPdf, fullOutputPath);

    //         return res.status(200).json({
    //             ok: true,
    //             mensaje: "PDF firmado y subido correctamente al FTP",
    //             archivoFirmado: nombrePdf,
    //             firmadoPor: nombreFirmante,
    //             cargo,
    //             fecha: fechaStr,
    //             hora: horaStr
    //         });

    //     } catch (error) {
    //         console.error("❌ Error al firmar documento desde FTP:", error);
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error al firmar el documento desde FTP",
    //             error: error instanceof Error ? error.message : String(error)
    //         });
    //     } finally {
    //         client?.close();
    //     }
    // }

    // public async firmarLoteDesdeFTP(req: Request, res: Response): Promise<any> {
    //     if (this.isRunning) {
    //         return res.status(429).json({ ok: false, mensaje: "Ya se está procesando una solicitud. Intenta más tarde." });
    //     }
    //     this.isRunning = true;
    //     let client
    //     try {
    //         const {
    //             nombresPdf,
    //             nombreCertificado,
    //             password,
    //             ubicacion,
    //             cargo,
    //             carpetaOrigen,
    //             carpetaFirmados,
    //             carpetaCertificados
    //         } = req.body;

    //         if (!Array.isArray(nombresPdf) || nombresPdf.length === 0 || !nombreCertificado || !password || !ubicacion || !cargo || !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: "Faltan datos requeridos o nombresPdf no es un arreglo válido"
    //             });
    //         }

    //         client = await createFtpClientConexion();

    //         // Descargar certificado y firma solo una vez
    //         const certStream = new WritableStreamBuffer();
    //         await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
    //         const certBuffer = certStream.getContents();

    //         const imgStream = new WritableStreamBuffer();
    //         await client.downloadTo(imgStream, `${carpetaCertificados}/img/firmadigitalv3_.png`);
    //         const imageBuffer = imgStream.getContents();

    //         const certBinary = certBuffer.toString("binary");
    //         const p12Asn1 = forge.asn1.fromDer(certBinary);
    //         const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    //         const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    //         const certBag = bags[forge.pki.oids.certBag];

    //         if (!certBag || certBag.length === 0 || !certBag[0].cert) {
    //             return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
    //         }

    //         const cert = certBag[0].cert;
    //         const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
    //         const nombreFirmante = typeof cnAttr?.value === "string"
    //             ? cnAttr.value
    //             : Array.isArray(cnAttr?.value) ? cnAttr.value.join(" ") : "Firmante desconocido";

    //         const fechaActual = new Date();
    //         const fechaStr = fechaActual.toLocaleDateString();
    //         const horaStr = fechaActual.toLocaleTimeString();

    //         const resultados: any[] = [];

    //         for (const nombrePdf of nombresPdf) {
    //             try {
    //                 const pdfStream = new WritableStreamBuffer();
    //                 await client.downloadTo(pdfStream, `${carpetaOrigen}/${nombrePdf}`);
    //                 const pdfBuffer = pdfStream.getContents();
    //                 if (!pdfBuffer) {
    //                     return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde el FTP" });
    //                 }
    //                 if (!imageBuffer) {
    //                     return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde el FTP" });
    //                 }
    //                 if (!certBuffer) {
    //                     return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
    //                 }
    //                 const pdfDoc = await PDFDocument.load(pdfBuffer);
    //                 const firmaImage = await pdfDoc.embedPng(imageBuffer);
    //                 const pages = pdfDoc.getPages();
    //                 const firstPage = pages[0];

    //                 const scale = 0.5;
    //                 const { width, height } = firmaImage.scale(scale);

    //                 firstPage.drawImage(firmaImage, {
    //                     x: 0,
    //                     y: 750,
    //                     width,
    //                     height,
    //                 });

    //                 const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });
    //                 const visualSignedBuffer = Buffer.from(visualSignedPdf);

    //                 const opcionesFirma = {
    //                     reason: "Firma digital",
    //                     location: ubicacion,
    //                     signerName: nombreFirmante,
    //                     annotationAppearanceOptions: {
    //                         signatureCoordinates: { left: 0, bottom: 750, right: 200, top: 830 },
    //                         signatureDetails: [
    //                             { value: "Firmado por: " + nombreFirmante, fontSize: 5, transformOptions: { xPos: 20, yPos: 50, space: 1, rotate: 0, tilt: 0 } },
    //                             { value: "Cargo: " + cargo, fontSize: 5, transformOptions: { xPos: 20, yPos: 40, space: 1, rotate: 0, tilt: 0 } },
    //                             { value: "Fecha: " + fechaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 30, space: 1, rotate: 0, tilt: 0 } },
    //                             { value: "Hora: " + horaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
    //                         ]
    //                     }
    //                 };

    //                 const signedPdfBuffer = await sign(visualSignedBuffer, certBuffer, password, opcionesFirma);

    //                 const nombreFirmado = `firmado-${nombrePdf}`;
    //                 const fullOutputPath = `${carpetaFirmados}/${nombreFirmado}`;
    //                 await client.ensureDir(carpetaFirmados);
    //                 const readableSignedPdf = Readable.from(signedPdfBuffer);
    //                 await client.uploadFrom(readableSignedPdf, fullOutputPath);

    //                 resultados.push({
    //                     archivo: nombrePdf,
    //                     estado: "firmado",
    //                     firmadoComo: nombreFirmante
    //                 });

    //             } catch (error) {
    //                 resultados.push({
    //                     archivo: nombrePdf,
    //                     estado: "error",
    //                     error: error instanceof Error ? error.message : String(error)
    //                 });
    //             }
    //         }

    //         return res.status(200).json({
    //             ok: true,
    //             mensaje: "Proceso de firmado completado",
    //             resultados
    //         });

    //     } catch (error) {
    //         console.error("❌ Error general en lote de firmado:", error);
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error general al procesar los documentos",
    //             error: error instanceof Error ? error.message : String(error)
    //         });
    //     } finally {
    //         client?.close();
    //         this.isRunning = false;
    //     }
    // }

    // public async buscarFirmaDigitalByUsername(req: Request, res: Response): Promise<any> {
    //     const { username } = req.body;

    //     if (!username) {
    //         return res.status(400).json({
    //             ok: false,
    //             mensaje: "El nombre de usuario es requerido.",
    //         });
    //     }

    //     let client
    //     try {
    //         client = await createFtpClientConexion();

    //         // Acceder a la carpeta donde están los certificados
    //         await client.cd('CERTIFICADOS');
    //         const fileList = await client.list();

    //         const nombreCertificado = `${username}.pfx`;
    //         const archivoEncontrado = fileList.find(file => file.name === nombreCertificado);

    //         if (!archivoEncontrado) {
    //             return res.status(404).json({
    //                 existe: false,
    //                 mensaje: `No existe certificado `,
    //             });
    //         }

    //         // Certificado encontrado, pero no intentamos abrirlo
    //         return res.status(200).json({
    //             existe: true,
    //             mensaje: `Certificado asociado`,
    //             certificado: nombreCertificado
    //         });

    //     } catch (error) {
    //         console.error("❌ Error al buscar firma digital por username:", error);
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error al buscar firma digital por username",
    //             error: error instanceof Error ? error.message : String(error)
    //         });
    //     } finally {
    //         client?.close();
    //     }
    // }


    // public async CertInfoFromFTP(req: Request, res: Response): Promise<any> {
    //     let client;
    //     const fixEncoding = (value: string): string => {
    //         return Buffer.from(value, "latin1").toString("utf8");
    //     };
    //     try {
    //         const { nombreCertificado, password, carpetaCertificados } = req.body;

    //         if (!nombreCertificado || !password || !carpetaCertificados) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: "Faltan datos requeridos: nombreCertificado, password, carpetaCertificados",
    //             });
    //         }

    //         client = await createFtpClientConexion();

    //         // Descargar certificado desde FTP
    //         const certStream = new WritableStreamBuffer();
    //         await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
    //         const certBuffer = certStream.getContents();

    //         if (!certBuffer || !Buffer.isBuffer(certBuffer)) {
    //             return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
    //         }

    //         // Procesar certificado con forge
    //         const p12Asn1 = forge.asn1.fromDer(forge.util.createBuffer(new Uint8Array(certBuffer)));
    //         const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    //         const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    //         const certBag = bags[forge.pki.oids.certBag];
    //         if (!certBag || certBag.length === 0 || !certBag[0].cert) {
    //             return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
    //         }

    //         const cert = certBag[0].cert;
    //         // Extraer subject
    //         const subject: Record<string, string> = {};
    //         cert.subject.attributes.forEach(attr => {
    //             if (attr.name) {  // ✅ nos aseguramos que no sea undefined
    //                 let val = typeof attr.value === "string" ? fixEncoding(attr.value) : String(attr.value);
    //                 subject[attr.name] = val;
    //             }
    //         });

    //         // Extraer issuer
    //         const issuer: Record<string, string> = {};
    //         cert.issuer.attributes.forEach(attr => {
    //             if (attr.name) {  // ✅ igual aquí
    //                 let val = typeof attr.value === "string" ? fixEncoding(attr.value) : String(attr.value);
    //                 issuer[attr.name] = val;
    //             }
    //         });

    //         // Construir respuesta
    //         return res.status(200).json({
    //             ok: true,
    //             certificado: {
    //                 subject,
    //                 issuer,
    //                 validFrom: cert.validity.notBefore,
    //                 validTo: cert.validity.notAfter,
    //                 serialNumber: cert.serialNumber,
    //             },
    //         });
    //     } catch (error) {
    //         console.error("❌ Error al procesar certificado:", error);
    //         return res.status(500).json({
    //             ok: false,
    //             mensaje: "Error al procesar certificado",
    //             error: error instanceof Error ? error.message : String(error),
    //         });
    //     } finally {
    //         client?.close();
    //     }
    // }



}

const ftpServerController = new FtpServerController();
export default ftpServerController;