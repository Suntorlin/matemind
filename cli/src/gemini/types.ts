import type { GeminiPermissionMode } from '@matemind/protocol/types';

export type PermissionMode = GeminiPermissionMode;

export interface GeminiMode {
    permissionMode: PermissionMode;
    model?: string;
}
