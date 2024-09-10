import { GatewayDispatchEvents } from '@discordjs/core';
import { guildId } from '../../../utils/env.js';
import { GatewayEvent } from '../../types.js';
import { members } from '../exports.js';

export const guildMemberRemove = {
    name: GatewayDispatchEvents.GuildMemberRemove,
    type: 'on',
    async execute({ data: member }) {
        if (!guildId || member.guild_id !== guildId) return;

        members.delete(member.user.id);
    },
} satisfies GatewayEvent<GatewayDispatchEvents.GuildMemberRemove>;
