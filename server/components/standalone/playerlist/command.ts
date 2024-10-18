import {
    ApplicationCommandType,
    ApplicationIntegrationType,
    InteractionContextType,
    MessageFlags,
} from '@discordjs/core';
import { ChatInputCommand } from '../../types.js';
import { playerlistActionRow } from './action-row.js';
import { playerlistEmbed } from './embed.js';

export const playerlistCommand = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'playerlist',
        description: 'Player list',
        default_member_permissions: '0',
        integration_types: [ApplicationIntegrationType.GuildInstall],
        contexts: [InteractionContextType.Guild],
    },
    async execute({ data: interaction, api }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            embeds: [playerlistEmbed()],
            components: [playerlistActionRow()],
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies ChatInputCommand;
