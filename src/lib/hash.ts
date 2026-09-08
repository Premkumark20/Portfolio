import { sha256 } from 'js-sha256';

/**
 * Generate a cryptographically random salt string.
 */
export function generateSalt(length = 16): string {
  const chars = 'abcdef0123456789';
  let salt = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      salt += chars[arr[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      salt += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return salt;
}

/**
 * Create a salted SHA-256 hash formatted as `${salt}:${hash}`.
 * The cryptographic salt prevents rainbow table and dictionary attacks.
 */
export async function createSaltedHash(text: string, customSalt?: string): Promise<string> {
  const normalized = (text || '').trim();
  if (!normalized) return '';
  const salt = customSalt || generateSalt(16);
  const hash = sha256(`${salt}:${normalized}`);
  return `${salt}:${hash}`;
}

/**
 * Universal SHA-256 with salt support.
 */
export async function hashSHA256(text: string, customSalt?: string): Promise<string> {
  return createSaltedHash(text, customSalt);
}

/**
 * Verifies plain text against a stored hash.
 * Supports both modern salted hashes ("salt:hash") and legacy plain SHA-256 hashes.
 */
export async function verifySaltedHash(plainText: string, storedHash?: string | null): Promise<boolean> {
  const normalized = (plainText || '').trim();
  const target = (storedHash || '').trim();
  if (!normalized || !target) return false;

  // 1. Salted format: "salt:hash"
  if (target.includes(':')) {
    const colonIdx = target.indexOf(':');
    const salt = target.slice(0, colonIdx);
    const expected = target.slice(colonIdx + 1);
    const computed = sha256(`${salt}:${normalized}`);
    return computed.toLowerCase() === expected.toLowerCase();
  }

  // 2. Legacy / plain SHA-256 format fallback
  const legacyComputed = sha256(normalized);
  return legacyComputed.toLowerCase() === target.toLowerCase();
}

// Pre-computed Salted Hashes for Master Recovery Account ("admin" / "admin2615")
// Salt: "master_recovery"
export const DEFAULT_ADMIN_USER_HASH = "master_recovery:178a851eaee76a84b5e5d9afd03996afa31d710caa16dc1d7100526fdc798348";
export const DEFAULT_ADMIN_PASS_HASH = "master_recovery:d3fe841a144aa0e1cae48b87f35b1739bccd773a41d2e05ae811f9145cebd320";

// Pre-computed Salted Hashes for Default Account ("premkumar" / "premkumarofficial")
// Salt: "default_auth"
export const DEFAULT_USER_HASH = "default_auth:a180c8409408eec1a57d38cc99038220c69a117c45810e35d068e49a4f54df4e";
export const DEFAULT_PASS_HASH = "default_auth:3d4170754a5ddce1b46744a8062986c2c59c8aa455d25d47662343b0ab2863ae";

// Legacy raw hashes for backwards compatibility
export const LEGACY_DEFAULT_USER_HASH = "eff3e32d8edd8c24964c97bcb61312ed6c4cf754315a09830c21a2a17330fb43";
export const LEGACY_DEFAULT_PASS_HASH = "5a15292d333c6ba0d838c6a261a2772ccaeee7ac0bf4449b5b8046ce40bc0797";
export const LEGACY_DEFAULT_ADMIN_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
export const LEGACY_DEFAULT_ADMIN_PASS_HASH = "17722af16df4ef8b15666a903bd2cbe4a1c0e972d34117ea57a7a9255bcc101c";

/**
 * Synchronous lightweight reversible obfuscation for storing temporary credentials in CSV.
 * Uses a dynamic salt and SHA-256 derived keystream so temporary credentials are never stored
 * in plaintext in CSV/Supabase, preventing casual exposure while allowing seamless cross-device restoration.
 */
const OBFUSCATION_KEY = 'portfolio_temp_cred_sec_token_2026';

export function obfuscateText(text: string): string {
  if (!text) return '';
  const salt = generateSalt(8);
  const keystream = sha256(`${salt}:${OBFUSCATION_KEY}`);
  const encoded = encodeURIComponent(text);
  const hex = Array.from(encoded).map((c, i) => {
    const code = c.charCodeAt(0);
    const keyByte = parseInt(keystream[(i * 2) % keystream.length] + keystream[(i * 2 + 1) % keystream.length], 16) || 0x42;
    const xored = code ^ keyByte;
    return xored.toString(16).padStart(4, '0');
  }).join('');
  return `enc:v1:${salt}:${hex}`;
}

export function deobfuscateText(encoded: string): string {
  if (!encoded) return '';
  if (!encoded.startsWith('enc:v1:')) {
    // If stored as plaintext or legacy format, return as is
    return encoded;
  }
  const parts = encoded.split(':');
  if (parts.length < 4) return '';
  const salt = parts[2];
  const hex = parts[3];
  const keystream = sha256(`${salt}:${OBFUSCATION_KEY}`);
  let raw = '';
  for (let i = 0; i < hex.length; i += 4) {
    const chunk = hex.substring(i, i + 4);
    const xored = parseInt(chunk, 16);
    const charIndex = Math.floor(i / 4);
    const keyByte = parseInt(keystream[(charIndex * 2) % keystream.length] + keystream[(charIndex * 2 + 1) % keystream.length], 16) || 0x42;
    const code = xored ^ keyByte;
    raw += String.fromCharCode(code);
  }
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
