import nacl from 'tweetnacl';
import { HttpHandlerRequest } from './types.js';

export function verifyDiscordRequest(verifyKey: string) {
    return (request: HttpHandlerRequest, body: string): boolean => {
        const signature = request.headers['X-Signature-Ed25519'];
        const timestamp = request.headers['X-Signature-Timestamp'];
        if (!signature || !timestamp) return false;

        return nacl.sign.detached.verify(
            Buffer.from(timestamp + body),
            Buffer.from(signature, 'hex'),
            Buffer.from(verifyKey, 'hex'),
        );
    };
}
