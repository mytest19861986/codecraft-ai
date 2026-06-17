import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const PASSWORD_HASH_VERSION = "scrypt-v1";
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_SALT_LENGTH = 16;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1
};

function deriveKey(password: string, salt: Buffer, keyLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, SCRYPT_OPTIONS, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SCRYPT_SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt, SCRYPT_KEY_LENGTH);

  return `${PASSWORD_HASH_VERSION}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [version, encodedSalt, encodedHash] = storedHash.split("$");

  if (version !== PASSWORD_HASH_VERSION || !encodedSalt || !encodedHash) {
    return false;
  }

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedHash = Buffer.from(encodedHash, "base64url");

  if (salt.length !== SCRYPT_SALT_LENGTH || expectedHash.length !== SCRYPT_KEY_LENGTH) {
    return false;
  }

  const actualHash = await deriveKey(password, salt, expectedHash.length);

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}
