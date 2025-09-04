import { sha256 } from 'js-sha256';

export async function getFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  if (window.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    console.warn("Web Crypto API no disponible, usando js-sha256.");
    const hash = sha256(new Uint8Array(arrayBuffer));
    return hash;
  }
}