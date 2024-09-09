import { WebSocketShardEvents } from '@discordjs/ws';
import { WebSocketEvent } from '../types.js';

let ping = -1;
export function getPing() {
    return ping;
}

export const heartbeat = {
    name: WebSocketShardEvents.HeartbeatComplete,
    type: 'on',
    async execute({ latency }) {
        ping = latency;
    },
} satisfies WebSocketEvent<WebSocketShardEvents.HeartbeatComplete>;
