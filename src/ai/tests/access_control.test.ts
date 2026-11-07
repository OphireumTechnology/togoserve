import test from 'node:test';
import assert from 'node:assert/strict';
import { AccessControlService, ENTERPRISE_ROLES, PORTAL_ACCESS_RULES } from '../../auth/AccessControlService';
import { UserProfile } from '../../types';

test('AccessControlService: Guest is permitted on public portals and blocked on private operational portals', () => {
  const publicPortals = ['marketplace', 'padala', 'landing', 'customer'];
  for (const portal of publicPortals) {
    const res = AccessControlService.canAccessPortal(null, portal);
    assert.equal(res.allowed, true, `Guest should access public portal: ${portal}`);
  }

  const privatePortals = ['merchant', 'pos', 'rider', 'fleet', 'supplier', 'ai-center', 'admin', 'analytics'];
  for (const portal of privatePortals) {
    const res = AccessControlService.canAccessPortal(null, portal);
    assert.equal(res.allowed, false, `Guest must NOT access private portal: ${portal}`);
    assert.equal(res.requiresEnterpriseLogin, true, `Guest denied private portal must require enterprise login: ${portal}`);
  }
});

test('AccessControlService: Role-based authorization for MERCHANT_ADMIN and MERCHANT_STAFF', () => {
  const merchantAdmin: UserProfile = {
    id: 'usr-m1',
    name: 'Merchant Principal',
    email: 'merchant@store.ph',
    role: 'MERCHANT_ADMIN',
    provider: 'enterprise',
    verified: true,
  };

  assert.equal(AccessControlService.canAccessPortal(merchantAdmin, 'merchant').allowed, true);
  assert.equal(AccessControlService.canAccessPortal(merchantAdmin, 'pos').allowed, true);
  // Should NOT access AI supervisor or Fleet
  assert.equal(AccessControlService.canAccessPortal(merchantAdmin, 'ai-center').allowed, false);
  assert.equal(AccessControlService.canAccessPortal(merchantAdmin, 'fleet').allowed, false);
});

test('AccessControlService: Role-based authorization for RIDER', () => {
  const rider: UserProfile = {
    id: 'usr-r1',
    name: 'Courier Partner',
    email: 'rider@togoserve.ph',
    role: 'RIDER',
    provider: 'enterprise',
    verified: true,
  };

  assert.equal(AccessControlService.canAccessPortal(rider, 'rider').allowed, true);
  assert.equal(AccessControlService.canAccessPortal(rider, 'merchant').allowed, false);
  assert.equal(AccessControlService.canAccessPortal(rider, 'ai-center').allowed, false);
});

test('AccessControlService: Role-based authorization for AI_SUPERVISOR', () => {
  const aiSupervisor: UserProfile = {
    id: 'usr-ai-1',
    name: 'AI Operations Director',
    email: 'ai@internal.togoserve.com',
    role: 'AI_SUPERVISOR',
    provider: 'enterprise',
    verified: true,
  };

  assert.equal(AccessControlService.canAccessPortal(aiSupervisor, 'ai-center').allowed, true);
  assert.equal(AccessControlService.canAccessPortal(aiSupervisor, 'rider').allowed, false);
});

test('AccessControlService: SUPER_ADMIN (root) has access across all operational dashboards', () => {
  const rootAdmin: UserProfile = {
    id: 'usr-root',
    name: 'Master Enterprise Administrator',
    email: 'root@internal.togoserve.com',
    role: 'SUPER_ADMIN',
    provider: 'enterprise',
    verified: true,
  };

  const allPortals = Object.keys(PORTAL_ACCESS_RULES);
  for (const portal of allPortals) {
    const res = AccessControlService.canAccessPortal(rootAdmin, portal);
    assert.equal(res.allowed, true, `SUPER_ADMIN must have clearance for ${portal}`);
  }
});

test('AccessControlService: Cloud sync is strictly restricted to INFRASTRUCTURE_ADMIN and SUPER_ADMIN', () => {
  assert.equal(AccessControlService.canTriggerCloudSync(null), false);

  const customer: UserProfile = { id: 'c1', name: 'Cust', email: 'c@c.ph', role: 'CUSTOMER', provider: 'google', verified: true };
  assert.equal(AccessControlService.canTriggerCloudSync(customer), false);

  const merchant: UserProfile = { id: 'm1', name: 'Merch', email: 'm@m.ph', role: 'MERCHANT_ADMIN', provider: 'enterprise', verified: true };
  assert.equal(AccessControlService.canTriggerCloudSync(merchant), false);

  const infraAdmin: UserProfile = { id: 'i1', name: 'Infra', email: 'i@i.ph', role: 'INFRASTRUCTURE_ADMIN', provider: 'enterprise', verified: true };
  assert.equal(AccessControlService.canTriggerCloudSync(infraAdmin), true);

  const rootAdmin: UserProfile = { id: 'r1', name: 'Root', email: 'root@internal.togoserve.com', role: 'SUPER_ADMIN', provider: 'enterprise', verified: true };
  assert.equal(AccessControlService.canTriggerCloudSync(rootAdmin), true);
});

test('AccessControlService: Mandatory MFA enforcement policy', () => {
  assert.equal(AccessControlService.requiresMFA('SUPER_ADMIN'), true);
  assert.equal(AccessControlService.requiresMFA('SECURITY_ADMIN'), true);
  assert.equal(AccessControlService.requiresMFA('INFRASTRUCTURE_ADMIN'), true);
  assert.equal(AccessControlService.requiresMFA('AI_SUPERVISOR'), true);
  assert.equal(AccessControlService.requiresMFA('FINANCE_ADMIN'), true);

  assert.equal(AccessControlService.requiresMFA('MERCHANT_ADMIN'), false);
  assert.equal(AccessControlService.requiresMFA('RIDER'), false);
  assert.equal(AccessControlService.requiresMFA('CUSTOMER'), false);
});
