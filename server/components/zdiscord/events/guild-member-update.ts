import { GatewayDispatchEvents } from '@discordjs/core';
import { guildId } from '../../../utils/env.js';
import { GatewayEvent } from '../../types.js';
import { members } from '../exports.js';

export const guildMemberUpdate = {
    name: GatewayDispatchEvents.GuildMemberUpdate,
    type: 'on',
    async execute({ data }) {
        if (!guildId || data.guild_id !== guildId) return;

        const member = members.get(data.user.id)!;
        member.nick = data.nick;
        member.globalName = data.user.global_name;
        member.username = data.user.username;
        member.roles = data.roles;

        console.log(data.nick);
    },
} satisfies GatewayEvent<GatewayDispatchEvents.GuildMemberUpdate>;
