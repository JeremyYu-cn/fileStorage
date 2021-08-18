import { createHash } from 'crypto';

export function getMd5Code(msg: string) {
  return createHash('md5').update(msg).digest('hex');
}
