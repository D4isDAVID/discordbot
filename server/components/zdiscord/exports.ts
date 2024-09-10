import { Collection } from '@discordjs/collection';
import { Snowflake } from '@discordjs/core';
import { zdiscordBridge } from '../../utils/env.js';

function zdiscordExports(name: string, cb: Function) {
    if (!zdiscordBridge) return;

    on(`__cfx_export_zdiscord_${name}`, (setCB: (cb: Function) => void) =>
        setCB(cb),
    );
}

export interface ZDiscordMemberData {
    nick: string | null | undefined;
    globalName: string | null;
    username: string;
    roles: string[];
}

export const members = new Collection<Snowflake, ZDiscordMemberData>();

function getMember(userId: string): ZDiscordMemberData | false {
    return members.get(userId) ?? false;
}

function getMemberFromSource(playerId: number): ZDiscordMemberData | false {
    const userId = GetPlayerIdentifierByType(`${playerId}`, 'discord');
    if (!userId) return false;

    return getMember(userId);
}

function parseMember(memberId: string | number): ZDiscordMemberData | false {
    if (!memberId) return false;

    return typeof memberId === 'number'
        ? getMemberFromSource(memberId)
        : getMember(memberId);
}

zdiscordExports(
    'isRolePresent',
    (memberId: string | number, role: string | string[]): boolean => {
        if (!memberId || !role) return false;

        const member = parseMember(memberId);
        if (!member) return false;

        return typeof role === 'object'
            ? member.roles.filter((r) => role.includes(r)).length > 0
            : member.roles.includes(role);
    },
);

zdiscordExports('getMemberRoles', (memberId: string | number): string[] => {
    if (!memberId) return [];

    const member = parseMember(memberId);
    if (!member) return [];

    return member.roles;
});

zdiscordExports('getName', (memberId: string | number): string | false => {
    const member = parseMember(memberId);
    if (!member) return false;

    return member.nick ?? member.globalName ?? member.username;
});

zdiscordExports('getDiscordId', (playerId: number): string | false => {
    return GetPlayerIdentifierByType(`${playerId}`, 'discord') || false;
});
