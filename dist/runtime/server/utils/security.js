import { createRemoteJWKSet, jwtVerify } from "jose";
import { getRandomValues, subtle } from "uncrypto";
import { arrayBufferToBase64, base64ToText, base64ToUint8Array, uint8ArrayToBase64 } from "undio";
import { useOidcLogger } from "./oidc.js";
const unreservedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
async function encryptMessage(text, key, iv) {
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encoded
  );
  return arrayBufferToBase64(ciphertext, { urlSafe: false });
}
async function decryptMessage(text, key, iv) {
  const decoded = base64ToUint8Array(text);
  return await subtle.decrypt({ name: "AES-GCM", iv }, key, decoded);
}
export function generatePkceVerifier(length = 64) {
  if (length < 43 || length > 128) {
    throw new Error("Length must be between 43 and 128");
  }
  const randomValues = getRandomValues(new Uint8Array(length));
  let pkceVerifier = "";
  for (let i = 0; i < randomValues.length; i++) {
    pkceVerifier += unreservedCharacters[randomValues[i] % unreservedCharacters.length];
  }
  return pkceVerifier;
}
export async function generatePkceCodeChallenge(pkceVerifier) {
  const challengeBuffer = await subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(pkceVerifier));
  return arrayBufferToBase64(challengeBuffer, { urlSafe: true, dataURL: false });
}
export function generateRandomUrlSafeString(length = 48) {
  const randomBytes = new Uint8Array(length);
  getRandomValues(randomBytes);
  return uint8ArrayToBase64(randomBytes, { urlSafe: true, dataURL: false }).slice(0, length);
}
export async function encryptToken(token, key) {
  const secretKey = await subtle.importKey("raw", base64ToUint8Array(key), {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]);
  const iv = getRandomValues(new Uint8Array(12));
  const encryptedToken = await encryptMessage(token, secretKey, iv);
  return {
    encryptedToken,
    iv: uint8ArrayToBase64(iv, { dataURL: false })
  };
}
export async function decryptToken(input, key) {
  const { encryptedToken, iv } = input;
  const secretKey = await subtle.importKey("raw", base64ToUint8Array(key), {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]);
  const decrypted = await decryptMessage(encryptedToken, secretKey, base64ToUint8Array(iv));
  return new TextDecoder().decode(decrypted);
}
export function parseJwtToken(token, skipParsing) {
  if (skipParsing) {
    const logger = useOidcLogger();
    logger.info("Skipping JWT token parsing");
    return {};
  }
  try {
    const [header, payload, signature, ...rest] = token.split(".");
    if (!header || !payload || !signature || rest.length)
      throw new Error("Invalid JWT token");
    return JSON.parse(base64ToText(payload, { urlSafe: true }));
  } catch {
    throw new Error("Invalid token");
  }
}
export async function validateToken(token, options) {
  const jwks = createRemoteJWKSet(new URL(options.jwksUri));
  const { payload } = await jwtVerify(token, jwks, {
    issuer: options.issuer,
    audience: options.audience
  });
  return payload;
}
