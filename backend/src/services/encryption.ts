import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16; // Authentication tag length in bytes
const TAG_POSITION = IV_LENGTH; // Where the tag is in the output buffer
const ENCRYPTED_POSITION = IV_LENGTH + TAG_LENGTH;

// For MVP, key is derived from a simple secret. In production, use a more robust key management system.
// This secret should be a cryptographically secure random value, stored securely (e.g., in an environment variable).
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'a-very-secret-key-of-at-least-32-chars'; // Should be 32 bytes (256 bits)

const getKey = (): Buffer => {
  if (!ENCRYPTION_SECRET || ENCRYPTION_SECRET.length < 32) {
    throw new Error('ENCRYPTION_SECRET must be at least 32 characters long and stored securely.');
  }
  // Use a hash of the secret to ensure it's exactly 32 bytes
  return crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
};

export function encrypt(text: string): { encryptedData: Buffer, iv: Buffer, authTag: Buffer } {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: Buffer.from(encrypted, 'hex'),
    iv,
    authTag,
  };
}

export function decrypt(encryptedData: Buffer, iv: Buffer, authTag: Buffer): string {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
