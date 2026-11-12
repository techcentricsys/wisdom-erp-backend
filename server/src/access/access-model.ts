/* Server-side copy of the frontend access model (src/data/accessModel.js).
   The backend is the source of truth: every role matrix is normalised here
   before it is stored or returned. */

export type BaseRole = 'Super Admin' | 'Local Admin' | 'Local User';
export const BASE_ROLES: BaseRole[] = ['Super Admin', 'Local Admin', 'Local User'];
export const CUSTOM_BASE_ROLES: BaseRole[] = ['Local Admin', 'Local User'];

export const SYSTEM_ROLE_IDS: Record<BaseRole, string> = {
  'Super Admin': 'role-super-admin',
  'Local Admin': 'role-local-admin',
  'Local User': 'role-local-user',
};

export const ACTIONS = ['access', 'view', 'create', 'edit', 'delete'] as const;
export type Action = (typeof ACTIONS)[number];
export type Cell = Record<Action, boolean>;
export type Matrix = Record<string, Cell>;

const LOCAL_USER_HIDDEN = new Set([
  'Setup / Accounts', 'Supplier', 'Customer', 'Shipping Agent', 'Manufacturer', 'Salesperson',
  'Commercial Person', 'Customer Assignment', 'Bank', 'Account Category', 'Account List',
  'Setup / Other', 'Mail Setup', 'Origin (Country)', 'Port', 'Incoterm', 'Shipping Mode',
  'Payment Term', 'Currency', 'Checklist', 'Product Category', 'Product Type', 'Unit of Measure',
  'Shipment', 'Shipment Document',
  'Debit Note', 'Payment', 'Commission Receive', 'Data Import',
  'Users', 'Departments', 'Designations', 'Setup / Organization',
]);

export const SUPER_ONLY = new Set(['Setup / Organization', 'Users', 'Departments', 'Designations', 'Roles']);

type Screen = { label: string; kind: 'screen' | 'report' };
const s = (label: string): Screen => ({ label, kind: 'screen' });
const r = (label: string): Screen => ({ label, kind: 'report' });

export const MODULES: { name: string; screens: Screen[] }[] = [
  { name: 'Dashboard', screens: [r('Dashboard')] },
  { name: 'Setup / Accounts', screens: ['Supplier', 'Customer', 'Shipping Agent', 'Manufacturer', 'Salesperson', 'Commercial Person', 'Customer Assignment', 'Bank', 'Account Category', 'Account List'].map(s) },
  { name: 'Setup / Organization', screens: ['Users', 'Departments', 'Designations', 'Roles'].map(s) },
  { name: 'Setup / Other', screens: ['Mail Setup', 'Origin (Country)', 'Port', 'Incoterm', 'Shipping Mode', 'Payment Term', 'Currency', 'Checklist'].map(s) },
  { name: 'Product', screens: [s('Product List'), s('Product Category'), s('Product Type'), s('Unit of Measure'), r('Product Report')] },
  { name: 'Inquiry', screens: [s('Customer Inquiry'), s('Supplier Rate'), r('Inquiry Report')] },
  { name: 'Offer', screens: [s('Offer'), s('Offer Status')] },
  { name: 'Indent', screens: [s('Indent'), r('Indent Report')] },
  { name: 'Order / PO', screens: [s('Purchase Order'), r('PO Report')] },
  { name: 'Shipment', screens: [s('Shipment'), s('Shipment Document'), r('Shipment Report')] },
  { name: 'Accounts', screens: [s('Debit Note'), s('Commission Receive')] },
  { name: 'Product Sample', screens: [s('Sample Receive'), s('Sample Issue'), r('Sample Receive Report'), r('Sample Issue Report'), r('Sample Stock Report')] },
  { name: 'Tools', screens: [r('Reports'), s('Data Import')] },
];

export const ALL_SCREENS: Screen[] = MODULES.flatMap((m) => m.screens);
const KIND: Record<string, string> = Object.fromEntries(ALL_SCREENS.map((x) => [x.label, x.kind]));

export const isKnownScreen = (label: string) => label in KIND;
export const isApplicable = (label: string, action: Action) =>
  !(KIND[label] === 'report' && ['create', 'edit', 'delete'].includes(action));
export const isLockedForRole = (baseRole: BaseRole, label: string) =>
  SUPER_ONLY.has(label) && baseRole !== 'Super Admin';

const emptyCell = (): Cell => ({ access: false, view: false, create: false, edit: false, delete: false });

const legacyCanView = (baseRole: BaseRole, label: string) => {
  if (baseRole === 'Super Admin') return true;
  if (SUPER_ONLY.has(label)) return false;
  if (baseRole === 'Local User') return !LOCAL_USER_HIDDEN.has(label);
  return true;
};

/* create/edit/delete => view => access; no access => nothing; locked / n.a. cells off */
export function normalizeCell(cell: Partial<Cell> | undefined, label: string, baseRole: BaseRole): Cell {
  const c: Cell = { ...emptyCell(), ...(cell ?? {}) };
  if (baseRole === 'Super Admin') {
    return {
      access: true,
      view: true,
      create: isApplicable(label, 'create'),
      edit: isApplicable(label, 'edit'),
      delete: isApplicable(label, 'delete'),
    };
  }
  if (isLockedForRole(baseRole, label)) return emptyCell();
  for (const a of ACTIONS) if (!isApplicable(label, a)) c[a] = false;
  if (c.create || c.edit || c.delete) c.view = true;
  if (c.view) c.access = true;
  if (!c.access) return emptyCell();
  return c;
}

export function normalizePermissions(perms: Record<string, Partial<Cell>> | null | undefined, baseRole: BaseRole): Matrix {
  return Object.fromEntries(ALL_SCREENS.map((x) => [x.label, normalizeCell(perms?.[x.label], x.label, baseRole)]));
}

/* default matrix of the system roles = the old hard-coded rules */
export function seedPermissions(baseRole: BaseRole): Matrix {
  const out: Record<string, Cell> = {};
  for (const x of ALL_SCREENS) {
    const on = legacyCanView(baseRole, x.label);
    out[x.label] = { access: on, view: on, create: on, edit: on, delete: on };
  }
  return normalizePermissions(out, baseRole);
}
