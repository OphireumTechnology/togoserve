import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateBase32Secret,
  generateTOTP,
  verifyTOTP,
  hashPassword,
  safeCompare,
  createAuthRouter
} from '../../server/authServer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('TOTP Engine: RFC 6238 mathematical validation and window tolerance', () => {
  const secret = 'JBSWY3DPEHPK3PXP'; // Base32 RFC test secret
  const currentCode = generateTOTP(secret);

  assert.match(currentCode, /^\d{6}$/, 'TOTP code must be exactly 6 decimal digits');
  assert.equal(verifyTOTP(secret, currentCode), true, 'Current TOTP code must verify successfully');

  // Window tolerance test: step -1 and step +1
  const prevCode = generateTOTP(secret, -1);
  const nextCode = generateTOTP(secret, 1);
  assert.equal(verifyTOTP(secret, prevCode), true, 'Previous 30s window step must verify');
  assert.equal(verifyTOTP(secret, nextCode), true, 'Next 30s window step must verify');

  // Rejection tests: Out of window steps
  const farPastCode = generateTOTP(secret, -5);
  const farFutureCode = generateTOTP(secret, 5);
  assert.equal(verifyTOTP(secret, farPastCode), false, 'Expired window token must be strictly rejected');
  assert.equal(verifyTOTP(secret, farFutureCode), false, 'Future out-of-window token must be strictly rejected');

  // Insecure placeholders must be rejected
  assert.equal(verifyTOTP(secret, '846201'), false, 'Legacy test placeholder 846201 must be strictly rejected');
  assert.equal(verifyTOTP(secret, '000000'), false, '000000 must be strictly rejected');
  assert.equal(verifyTOTP(secret, '123456'), false, '123456 must be strictly rejected');
});

test('Password Hashing: Salted PBKDF2 with timing-safe comparison', () => {
  const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
  const rawPass = 'TogoServe#ProductionTest2026!';
  const hash1 = hashPassword(rawPass, salt);
  const hash2 = hashPassword(rawPass, salt);
  assert.equal(hash1, hash2, 'PBKDF2 hash must be deterministic for identical salt and pass');

  assert.equal(safeCompare(hash1, hash2), true, 'Timing-safe comparison must return true for identical hashes');

  const wrongHash = hashPassword('WrongPassword123!', salt);
  assert.equal(safeCompare(hash1, wrongHash), false, 'Different passwords must not match');
});

test('Production Security Audit: No hardcoded demo passwords or fixed MFA bypasses in frontend or server', () => {
  const enterpriseModalPath = path.resolve(__dirname, '../../components/auth/EnterpriseLoginModal.tsx');
  const modalContent = fs.readFileSync(enterpriseModalPath, 'utf-8');

  assert.equal(modalContent.includes('applyPresetAccount'), false, 'EnterpriseLoginModal must not contain applyPresetAccount');
  assert.equal(modalContent.includes('Authorized Test Roles'), false, 'EnterpriseLoginModal must not contain autofill demo buttons');
  assert.equal(modalContent.includes('846201'), false, 'EnterpriseLoginModal must not contain hardcoded MFA 846201 code');

  const authServerPath = path.resolve(__dirname, '../../server/authServer.ts');
  const serverContent = fs.readFileSync(authServerPath, 'utf-8');
  assert.equal(serverContent.includes('isMasterCode'), false, 'authServer must not contain master code bypass');
  assert.equal(serverContent.includes('cleanCode === \'846201\''), false, 'authServer must not bypass 846201');
});

test('Auth API Router: End-to-end Enterprise Login and TOTP Verification Flow', async () => {
  const router = createAuthRouter();
  const rootAccount = (router as any)._getAccount('root');
  assert.ok(rootAccount, 'Root administrator account must exist in store');
  assert.equal(rootAccount.role, 'SUPER_ADMIN', 'Root account must have SUPER_ADMIN role');

  // Simulate Express handler helper
  const executeHandler = (method: string, pathUrl: string, body: any = {}, headers: any = {}) => {
    return new Promise<{ status: number; body: any }>((resolve) => {
      const matchedLayer = (router as any).stack.find((layer: any) => {
        return layer.route && layer.route.path === pathUrl && layer.route.methods[method.toLowerCase()];
      });

      if (!matchedLayer) {
        return resolve({ status: 404, body: { error: 'Route not found' } });
      }

      const req: any = {
        method,
        path: pathUrl,
        body,
        headers,
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.1' },
      };

      let responseStatus = 200;
      const res: any = {
        status: (code: number) => {
          responseStatus = code;
          return res;
        },
        json: (data: any) => {
          resolve({ status: responseStatus, body: data });
        },
      };

      matchedLayer.route.stack[0].handle(req, res, () => {});
    });
  };

  // 1. Health check
  const healthRes = await executeHandler('GET', '/health');
  assert.equal(healthRes.status, 200);
  assert.equal(healthRes.body.status, 'healthy');
  assert.equal(healthRes.body.mfaEngine, 'RFC-6238-TOTP');

  // 2. Reject incorrect password
  const failLogin = await executeHandler('POST', '/enterprise-login', {
    username: 'root',
    password: 'CompletelyWrongPassword123!',
  });
  assert.equal(failLogin.status, 401);
  assert.equal(failLogin.body.success, false);

  // 3. Authenticate with root password
  // Retrieve the generated password salt & hash to test matching candidate
  // We can test by setting a known password hash in the account
  const testRootPass = 'TogoServe#Root2026MasterKey!';
  rootAccount.passwordHash = hashPassword(testRootPass, rootAccount.passwordSalt);

  const step1 = await executeHandler('POST', '/enterprise-login', {
    username: 'root',
    password: testRootPass,
  });

  assert.equal(step1.status, 200, 'Valid credentials must succeed step 1');
  assert.equal(step1.body.success, true);
  assert.equal(step1.body.requiresMfa, true);
  assert.ok(step1.body.mfaSessionToken, 'Must issue mfaSessionToken');

  const challengeToken = step1.body.mfaSessionToken;

  // 4. Reject invalid/placeholder MFA token
  const fakeMfa = await executeHandler('POST', '/verify-mfa', {
    mfaSessionToken: challengeToken,
    mfaCode: '000000',
  });
  assert.equal(fakeMfa.status, 401, 'Invalid TOTP code must be rejected with 401');
  assert.equal(fakeMfa.body.success, false);

  // 5. Generate REAL RFC 6238 TOTP code using the account secret and verify
  const realTotpCode = generateTOTP(rootAccount.mfaSecret);
  const step2 = await executeHandler('POST', '/verify-mfa', {
    mfaSessionToken: challengeToken,
    mfaCode: realTotpCode,
  });

  assert.equal(step2.status, 200, 'Real TOTP code must be accepted');
  assert.equal(step2.body.success, true);
  assert.ok(step2.body.session, 'Must issue enterprise session');
  assert.equal(step2.body.session.user.role, 'SUPER_ADMIN');
  assert.equal(step2.body.session.mfaVerified, true);

  const bearerToken = step2.body.session.token;

  // 6. Verify Session
  const sessionCheck = await executeHandler('GET', '/session', {}, { authorization: `Bearer ${bearerToken}` });
  assert.equal(sessionCheck.status, 200);
  assert.equal(sessionCheck.body.valid, true);
  assert.equal(sessionCheck.body.session.user.name, 'Master Enterprise Administrator');

  // 7. Revoke Session
  const revokeRes = await executeHandler('POST', '/revoke', { token: bearerToken });
  assert.equal(revokeRes.status, 200);
  assert.equal(revokeRes.body.success, true);

  // 8. Verify Session is now revoked
  const afterRevoke = await executeHandler('GET', '/session', {}, { authorization: `Bearer ${bearerToken}` });
  assert.equal(afterRevoke.status, 401);
  assert.equal(afterRevoke.body.valid, false);
});
