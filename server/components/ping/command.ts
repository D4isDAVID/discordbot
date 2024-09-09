import { ChatInputCommand } from '../types.js';

function pingMessage(p: string) {
    return `🏓 Pong! \`${p}\``;
}

export const command = {
    data: {
        name: 'ping',
        description: 'Ping command',
    },
    async execute({ api, data: interaction, cb }) {
        cb();

        const first = Date.now();
        await api.interactions.reply(interaction.id, interaction.token, {
            content: pingMessage('fetching...'),
        });

        const ping = Math.ceil((Date.now() - first) / 2);
        await api.interactions.editReply(
            interaction.application_id,
            interaction.token,
            {
                content: pingMessage(`${ping}ms`),
            },
        );
    },
} satisfies ChatInputCommand;
