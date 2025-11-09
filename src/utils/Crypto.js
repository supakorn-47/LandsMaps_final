
import CryptoJS from 'crypto-js';

var KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export const setSession = (keys = "", values = {}) => {
    var encrypt = CryptoJS.AES.encrypt(typeof values === 'object' ? JSON.stringify(values) : values, KEY + keys);
    sessionStorage.setItem(keys, encrypt);
    return true;
}
export const getSession = (keys = "") => {
  try {
    const encrypted = sessionStorage.getItem(keys);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, KEY + keys);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // ✅ พยายาม parse JSON ถ้าไม่ใช่ JSON ก็คืนค่าเดิม
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted || null;
    }
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
};


// export const getSession = (keys = "") => {
//     try {
//         var bytes = CryptoJS.AES.decrypt(sessionStorage.getItem(keys), KEY + keys);
//         var plaintext = bytes.toString(CryptoJS.enc.Utf8);
//         return JSON.parse(plaintext);
//     } catch (error) {
//         var plaintext;
//         var bytes;
//         if (sessionStorage.getItem(keys) != undefined) {
//             bytes = CryptoJS.AES.decrypt(sessionStorage.getItem(keys), KEY + keys);
//             plaintext = bytes.toString(CryptoJS.enc.Utf8);
//         }
//         return plaintext;
//     }
// }