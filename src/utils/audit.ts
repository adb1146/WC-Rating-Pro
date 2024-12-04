import { AuditLogEntry } from '../types/admin';

const auditLog: AuditLogEntry[] = [];

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  auditLog.unshift(newEntry);
  return newEntry;
}

export function getAuditLog() {
  return auditLog;
}

export function exportAuditLog() {
  return JSON.stringify(auditLog, null, 2);
}