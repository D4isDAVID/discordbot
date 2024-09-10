import { GatewayDispatchEvents } from '@discordjs/core';
import { guildId } from '../../../utils/env.js';
import { GatewayEvent } from '../../types.js';
import { members } from '../exports.js';

export const guildMemberAdd = {
    name: GatewayDispatchEvents.GuildMemberAdd,
    type: 'on',
    async execute({ data: member }) {
        if (!guildId || member.guild_id !== guildId) return;

        members.set(member.user.id, {
            nick: member.nick,
            globalName: member.user.global_name,
            username: member.user.username,
            roles: member.roles,
        });
    },
} satisfies GatewayEvent<GatewayDispatchEvents.GuildMemberAdd>;
