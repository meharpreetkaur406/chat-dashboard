import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {

   private publicKeyBase64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtJ/mRn/tjMmZlR5i37S71ERw3aln3XefByAgrgIxkZeUp+sdB/pcbh3ylCv/8yWzpbkm6BEwD8kvAx+w0H0Ne5P1DHg3i2vwnarLQGBJGVZssbQVEb0C00Vc576R31/cdc6OmPsOBSWqe25gLFH+RVQnE9yCRa286hTdqpr+O58XI6O+wekVx+W3+iMrwCMcv7y3TWyN1fhPxNyTmxVfsX5tlR9MeevIti9bj/eKMGiwJfbu5C9O+DucW8tRhB3mtJ20hn7VHPglO4Gcc3ljK2OiR8iK8UbAPXWyTJN/bizsIfxzTjHs1jR3gMTdYbMtSGzY+kvN+QJRI98EP0reDwIDAQAB";

   private async importPublicKey() {
    const binaryDer = this.base64ToArrayBuffer(this.publicKeyBase64);

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      false,
      ["encrypt"]
    );
  }

  // Generate RSA keypair for the logged in user
  async generateUserKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Export public key -> send to backend (save in DB)
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);

    // Export private key -> store in browser (localStorage or IndexedDB)
    const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    localStorage.setItem("privateKey", this.arrayBufferToBase64(privateKey));

    return this.arrayBufferToBase64(publicKey);
  }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
    }

    async getPrivateKey() {
        const stored = localStorage.getItem("privateKey");
        if (!stored) throw new Error("Private key not found");

        return await crypto.subtle.importKey(
            "pkcs8",
            this.base64ToArrayBuffer(stored),
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["decrypt"]
        );
    }

    async decryptAesKey(encryptedKeyBase64: string) {

        const privateKey = await this.getPrivateKey();

        const decrypted = await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            this.base64ToArrayBuffer(encryptedKeyBase64)
        );

        const bytes = new Uint8Array(decrypted);

        return {
            key: bytes.slice(0, 32),   // AES 256 key
            iv: bytes.slice(32, 48)    // IV
        };
    }

    async decryptMessage(encryptedMessageBase64: string, encryptedKey: string) {

        const { key, iv } = await this.decryptAesKey(encryptedKey);

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            key,
            { name: "AES-CBC" },
            false,
            ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            cryptoKey,
            this.base64ToArrayBuffer(encryptedMessageBase64)
        );

        return new TextDecoder().decode(decrypted);
    }

    async verifyHash(message: string, serverHash: string) {

        const encoded = new TextEncoder().encode(message);

        const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);

        const localHash = this.arrayBufferToBase64(hashBuffer);

        return localHash === serverHash;
    }

}