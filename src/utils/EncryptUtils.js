import { webcrypto } from 'crypto'

export default class EncryptUtils {
  static async populateSensitiveUserData(value = '') {
    if (!value) return null; // Retorna null se o valor for vazio ou não definido

    const { subtle } = webcrypto;

    const encoder = new TextEncoder();
    const value_utf8 = encoder.encode(value); // Converte uma string para UTF-8
    const hash_sha256 = await subtle.digest('SHA-256', value_utf8); // Computa o hash (digest) usando o algoritmo SHA-256
    const hash_array = Array.from(new Uint8Array(hash_sha256)); // Converte o ArrayBuffer para um array de bytes
    return hash_array.map(b => b.toString(16).padStart(2, '0')).join(''); // Retorna a string hexadecimal do hash
  }
}