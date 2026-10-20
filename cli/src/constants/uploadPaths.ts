import { join } from 'path'
import { tmpdir } from 'os'

export const MATEMIND_BLOBS_DIR_NAME = 'matemind-blobs'

export function getMatemindBlobsDir(): string {
    return join(tmpdir(), MATEMIND_BLOBS_DIR_NAME)
}
