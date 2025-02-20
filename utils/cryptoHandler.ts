import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(String(process.env.ENCRYPTION_KEY))
  .digest()
  .subarray(0, 32);

/**
 * 암호화 함수
 * @param text : 암호화 할 string 변수
 * @returns 암호화 된 토큰
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv); //return Cipher object
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted; // IV와 암호문을 함께 저장 (IV는 복호화에 필요)
}

/**
 * 복호화 함수
 * @param data - iv와 암호문이 콜론(:)으로 결합된 문자열
 * @returns 복호화된 평문
 */
function decrypt(data: string): string {
  const parts = data.split(':');
  // 저장했던 IV 복원 (16바이트)
  const iv = Buffer.from(parts.shift() as string, 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}