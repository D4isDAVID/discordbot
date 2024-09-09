import { API } from '@discordjs/core/http-only';
import { REST } from '@discordjs/rest';

export const botToken = GetConvar('discordbot:botToken', '');

export const rest = new REST({ version: '10' }).setToken(botToken);
export const api = new API(rest);
