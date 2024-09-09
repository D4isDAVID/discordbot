import { setTimeout } from 'timers/promises';
import { inspect } from 'util';
import { setupHttpHandler } from './http/handler.js';
import { api, botToken } from './utils/env.js';

(async () => {
    await setTimeout(0);

    if (!botToken) {
        console.log(
            '^1[ERROR] Please provide a bot token with the ^3discordbot:botToken ^1convar and restart the resource.^7',
        );
        return;
    }

    const app = await api.oauth2.getCurrentBotApplicationInformation();
    setupHttpHandler(app.verify_key);
})().catch((e) => console.log(inspect(e)));
