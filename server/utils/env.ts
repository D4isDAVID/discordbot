import { Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';

export const botToken = GetConvar('discordbot:botToken', '');
export const guildId = GetConvar('discordbot:guildId', '');

export const rest = new REST({ version: '10' }).setToken(botToken);
export const gateway = new WebSocketManager({
    token: botToken,
    intents: 0,
    rest: rest,
});

export const client = new Client({ rest, gateway });
export const api = client.api;
