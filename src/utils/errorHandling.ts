@@ .. @@
+export interface StorageError {
+  code: string;
+  message: string;
+  suggestion?: string;
+}
+
+export const STORAGE_ERROR_CODES = {
+  NOT_INITIALIZED: 'STORAGE_NOT_INITIALIZED',
+  CONNECTION_ERROR: 'STORAGE_CONNECTION_ERROR',
+  PERMISSION_ERROR: 'STORAGE_PERMISSION_ERROR',
+  NOT_FOUND: 'STORAGE_NOT_FOUND',
+} as const;
+
+export function handleStorageError(error: unknown): StorageError {
+  if (error instanceof Error) {
+    if (error.message.includes('not initialized')) {
+      return {
+        code: STORAGE_ERROR_CODES.NOT_INITIALIZED,
+        message: 'Storage service is initializing',
+        suggestion: 'Please try again in a moment'
+      };
+    }
+    if (error.message.includes('permission')) {
+      return {
+        code: STORAGE_ERROR_CODES.PERMISSION_ERROR,
+        message: 'Access denied',
+        suggestion: 'Please check your permissions'
+      };
+    }
+    if (error.message.includes('not found')) {
+      return {
+        code: STORAGE_ERROR_CODES.NOT_FOUND,
+        message: 'Record not found',
+        suggestion: 'The requested data may have been deleted'
+      };
+    }
+  }
+  return {
+    code: STORAGE_ERROR_CODES.CONNECTION_ERROR,
+    message: 'Unable to connect to storage service',
+    suggestion: 'Please check your internet connection'
+  };
+}