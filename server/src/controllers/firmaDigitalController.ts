import { Request, Response } from "express";
import forge from 'node-forge';
import { sign } from "pdf-signer";
import { Readable } from "stream";
import { WritableStreamBuffer } from 'stream-buffers';
import { PDFDocument } from 'pdf-lib';
import { createFtpClientConexion } from "../ftp/ftp_conexion";


class FtpServerController {

    isRunning = false;
    constructor() {

    }


    public async firmarDocumentoDesdeFTP(req: Request, res: Response): Promise<any> {
        let client
        try {
            const {
                nombrePdf,
                nombreCertificado, // archivo .p12
                password,
                ubicacion,
                cargo,
                carpetaOrigen,
                carpetaFirmados,
                carpetaCertificados // contiene también la imagen
            } = req.body;

    
            if (!nombrePdf || !nombreCertificado || !password || !ubicacion || !cargo || !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Faltan datos requeridos: nombrePdf, nombreCertificado, password, ubicacion, cargo, carpetaOrigen, carpetaFirmados, carpetaCertificados"
                });
            }
    
            
            client = await createFtpClientConexion();
    
            // Descargar PDF
            const pdfStream = new WritableStreamBuffer();
            await client.downloadTo(pdfStream, `${carpetaOrigen}/${nombrePdf}`);
            const pdfBuffer = pdfStream.getContents();
    
            // Descargar certificado (.p12)
            const certStream = new WritableStreamBuffer();
            await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
            const certBuffer = certStream.getContents();
    
            // Descargar imagen de firma
            const imgStream = new WritableStreamBuffer();
            await client.downloadTo(imgStream, `${carpetaCertificados}/img/firmadigitalv3_.png`);
            const imageBuffer = imgStream.getContents();
    
            // Procesar certificado
            const certBinary = certBuffer.toString("binary");
            const p12Asn1 = forge.asn1.fromDer(certBinary);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag];
            if (!certBag || certBag.length === 0 || !certBag[0].cert) {
                return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
            }
    
            const cert = certBag[0].cert;
            const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
            const nombreFirmante = typeof cnAttr?.value === "string"
                ? cnAttr.value
                : Array.isArray(cnAttr?.value) ? cnAttr.value.join(" ") : "Firmante desconocido";
    
            const fechaActual = new Date();
            const fechaStr = fechaActual.toLocaleDateString();
            const horaStr = fechaActual.toLocaleTimeString();
    
           
            if (!pdfBuffer) {
                return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde el FTP" });
            }
            if (!imageBuffer) {
                return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde el FTP" });
            }
            if (!certBuffer) {
                return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
            }
             // Firma visual
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const firmaImage = await pdfDoc.embedPng(imageBuffer);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
    
            const scale = 0.5;
            const { width, height } = firmaImage.scale(scale);
    
            firstPage.drawImage(firmaImage, {
                x: 0,
                y: 750,
                width,
                height,
            });
    
            const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });
            const visualSignedBuffer = Buffer.from(visualSignedPdf);
    
            // Firma digital (con datos)
            const opcionesFirma = {
                reason: "Firma digital",
                location: ubicacion,
                signerName: nombreFirmante,
                annotationAppearanceOptions: {
                    signatureCoordinates: { left: 0, bottom: 750, right: 200, top: 830 },
                    signatureDetails: [
                        { value: "Firmado por: " + nombreFirmante, fontSize: 5, transformOptions: { xPos: 20, yPos: 50, space: 1, rotate: 0, tilt: 0 } },
                        { value: "Cargo: " + cargo, fontSize: 5, transformOptions: { xPos: 20, yPos: 40, space: 1, rotate: 0, tilt: 0 } },
                        { value: "Fecha: " + fechaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 30, space: 1, rotate: 0, tilt: 0 } },
                        { value: "Hora: " + horaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
                    ]
                }
            };
    
            const signedPdfBuffer = await sign(visualSignedBuffer, certBuffer, password, opcionesFirma);
    
            // Subir al FTP
            // const nombreFirmado = `${nombrePdf}`;
            const fullOutputPath = `${carpetaFirmados}/${nombrePdf}`;
            await client.ensureDir(carpetaFirmados);
            const readableSignedPdf = Readable.from(signedPdfBuffer);
            await client.uploadFrom(readableSignedPdf, fullOutputPath);
    
            return res.status(200).json({
                ok: true,
                mensaje: "PDF firmado y subido correctamente al FTP",
                archivoFirmado: nombrePdf,
                firmadoPor: nombreFirmante,
                cargo,
                fecha: fechaStr,
                hora: horaStr
            });
    
        } catch (error) {
            console.error("❌ Error al firmar documento desde FTP:", error);
            return res.status(500).json({
                ok: false,
                mensaje: "Error al firmar el documento desde FTP",
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            client?.close();
        }
    }
    
    public async firmarLoteDesdeFTP(req: Request, res: Response): Promise<any> {
        if (this.isRunning) {
            return res.status(429).json({ ok: false, mensaje: "Ya se está procesando una solicitud. Intenta más tarde." });
          }
          this.isRunning = true;
          let client
        try {
            const {
                nombresPdf,
                nombreCertificado,
                password,
                ubicacion,
                cargo,
                carpetaOrigen,
                carpetaFirmados,
                carpetaCertificados
            } = req.body;
    
            if (!Array.isArray(nombresPdf) || nombresPdf.length === 0 || !nombreCertificado || !password || !ubicacion || !cargo || !carpetaOrigen || !carpetaFirmados || !carpetaCertificados) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Faltan datos requeridos o nombresPdf no es un arreglo válido"
                });
            }
    
            client = await createFtpClientConexion();
    
            // Descargar certificado y firma solo una vez
            const certStream = new WritableStreamBuffer();
            await client.downloadTo(certStream, `${carpetaCertificados}/${nombreCertificado}`);
            const certBuffer = certStream.getContents();
    
            const imgStream = new WritableStreamBuffer();
            await client.downloadTo(imgStream, `${carpetaCertificados}/img/firmadigitalv3_.png`);
            const imageBuffer = imgStream.getContents();
    
            const certBinary = certBuffer.toString("binary");
            const p12Asn1 = forge.asn1.fromDer(certBinary);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
            const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = bags[forge.pki.oids.certBag];
    
            if (!certBag || certBag.length === 0 || !certBag[0].cert) {
                return res.status(400).json({ ok: false, mensaje: "No se pudo extraer el certificado del archivo" });
            }
    
            const cert = certBag[0].cert;
            const cnAttr = cert.subject.attributes.find(attr => attr.name === "commonName");
            const nombreFirmante = typeof cnAttr?.value === "string"
                ? cnAttr.value
                : Array.isArray(cnAttr?.value) ? cnAttr.value.join(" ") : "Firmante desconocido";
    
            const fechaActual = new Date();
            const fechaStr = fechaActual.toLocaleDateString();
            const horaStr = fechaActual.toLocaleTimeString();
    
            const resultados: any[] = [];
    
            for (const nombrePdf of nombresPdf) {
                try {
                    const pdfStream = new WritableStreamBuffer();
                    await client.downloadTo(pdfStream, `${carpetaOrigen}/${nombrePdf}`);
                    const pdfBuffer = pdfStream.getContents();
                    if (!pdfBuffer) {
                        return res.status(500).json({ ok: false, mensaje: "Error al leer el PDF desde el FTP" });
                    }
                    if (!imageBuffer) {
                        return res.status(500).json({ ok: false, mensaje: "Error al leer la imagen desde el FTP" });
                    }
                    if (!certBuffer) {
                        return res.status(500).json({ ok: false, mensaje: "Error al leer el certificado desde el FTP" });
                    }
                    const pdfDoc = await PDFDocument.load(pdfBuffer);
                    const firmaImage = await pdfDoc.embedPng(imageBuffer);
                    const pages = pdfDoc.getPages();
                    const firstPage = pages[0];
    
                    const scale = 0.5;
                    const { width, height } = firmaImage.scale(scale);
    
                    firstPage.drawImage(firmaImage, {
                        x: 0,
                        y: 750,
                        width,
                        height,
                    });
    
                    const visualSignedPdf = await pdfDoc.save({ useObjectStreams: false });
                    const visualSignedBuffer = Buffer.from(visualSignedPdf);
    
                    const opcionesFirma = {
                        reason: "Firma digital",
                        location: ubicacion,
                        signerName: nombreFirmante,
                        annotationAppearanceOptions: {
                            signatureCoordinates: { left: 0, bottom: 750, right: 200, top: 830 },
                            signatureDetails: [
                                { value: "Firmado por: " + nombreFirmante, fontSize: 5, transformOptions: { xPos: 20, yPos: 50, space: 1, rotate: 0, tilt: 0 } },
                                { value: "Cargo: " + cargo, fontSize: 5, transformOptions: { xPos: 20, yPos: 40, space: 1, rotate: 0, tilt: 0 } },
                                { value: "Fecha: " + fechaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 30, space: 1, rotate: 0, tilt: 0 } },
                                { value: "Hora: " + horaStr, fontSize: 5, transformOptions: { xPos: 20, yPos: 20, space: 1, rotate: 0, tilt: 0 } }
                            ]
                        }
                    };
    
                    const signedPdfBuffer = await sign(visualSignedBuffer, certBuffer, password, opcionesFirma);
    
                    const nombreFirmado = `firmado-${nombrePdf}`;
                    const fullOutputPath = `${carpetaFirmados}/${nombreFirmado}`;
                    await client.ensureDir(carpetaFirmados);
                    const readableSignedPdf = Readable.from(signedPdfBuffer);
                    await client.uploadFrom(readableSignedPdf, fullOutputPath);
    
                    resultados.push({
                        archivo: nombrePdf,
                        estado: "firmado",
                        firmadoComo: nombreFirmante
                    });
    
                } catch (error) {
                    resultados.push({
                        archivo: nombrePdf,
                        estado: "error",
                        error: error instanceof Error ? error.message : String(error)
                    });
                }
            }
    
            return res.status(200).json({
                ok: true,
                mensaje: "Proceso de firmado completado",
                resultados
            });
    
        } catch (error) {
            console.error("❌ Error general en lote de firmado:", error);
            return res.status(500).json({
                ok: false,
                mensaje: "Error general al procesar los documentos",
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            client?.close();
            this.isRunning = false;
        }
    }

    public async buscarFirmaDigitalByUsername(req: Request, res: Response): Promise<any> {
        const { username } = req.body;
      
        if (!username) {
          return res.status(400).json({
            ok: false,
            mensaje: "El nombre de usuario es requerido.",
          });
        }
      
        let client
        try {
          client = await createFtpClientConexion();
      
          // Acceder a la carpeta donde están los certificados
          await client.cd('CERTIFICADOS');
          const fileList = await client.list();
      
          const nombreCertificado = `${username}.pfx`;
          const archivoEncontrado = fileList.find(file => file.name === nombreCertificado);
      
          if (!archivoEncontrado) {
            return res.status(404).json({
              existe: false,
              mensaje: `No existe certificado `,
            });
          }
      
          // Certificado encontrado, pero no intentamos abrirlo
          return res.status(200).json({
            existe: true,
            mensaje: `Certificado asociado`,
            certificado: nombreCertificado
          });
      
        } catch (error) {
          console.error("❌ Error al buscar firma digital por username:", error);
          return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar firma digital por username",
            error: error instanceof Error ? error.message : String(error)
          });
        } finally {
          client?.close();
        }
      }
          
}

const ftpServerController = new FtpServerController();
export default ftpServerController;