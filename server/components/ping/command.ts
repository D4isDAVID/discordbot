import { WebSocketShardEvents } from '@discordjs/ws';
import { gateway } from '../../utils/env.js';
import { ChatInputCommand } from '../types.js';
import { getPing } from './heartbeat.js';

function pingMessage(p: string) {
    return `🏓 Pong! \`${p}\``;
}

export const command = {
    data: {
        name: 'ping',
        description: 'Ping command',
    },
    async execute({ api, data: interaction }) {
        let replied = false;

        if (getPing() < 0) {
            const heartbeatPromise = new Promise<unknown>((resolve) => {
                gateway.once(WebSocketShardEvents.HeartbeatComplete, resolve);
            });

            await api.interactions.reply(interaction.id, interaction.token, {
                content: pingMessage('fetching...'),
            });

            await heartbeatPromise;
            replied = true;
        }

        await api.interactions[replied ? 'editReply' : 'reply'](
            replied ? interaction.application_id : interaction.id,
            interaction.token,
            {
                content: pingMessage(`${getPing()}ms`),
            },
        );
    },
} satisfies ChatInputCommand;
