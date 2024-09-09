import { GatewayDispatchEvents } from '@discordjs/core';
import { GatewayEvent } from '../types.js';

export const ready = {
    name: GatewayDispatchEvents.Ready,
    type: 'once',
    async execute({ data }) {
        const { username, discriminator } = data.user;
        console.log(`Ready as ${username}#${discriminator}!`);
    },
} satisfies GatewayEvent<GatewayDispatchEvents.Ready>;
