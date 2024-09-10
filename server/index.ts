import { setTimeout } from 'node:timers/promises';
import { inspect } from 'node:util';
import {
    globalCommands,
    guildSpecificCommands,
    loadComponents,
} from './components/loader.js';
import { api, botToken, gateway, guildId } from './utils/env.js';

(async () => {
    await setTimeout(0); // avoids console messages possibly conflicting with annoying experimental warning

    if (!botToken) {
        console.log(
            '^1Please provide a bot token with the ^3discordbot:botToken ^1convar and restart the resource^7',
        );
        return;
    }
    if (!guildId) {
        console.log(
            "^3Server-specific commands won't work because the ^5discordbot:guildId ^3convar wasn't specified^7",
        );
    }

    loadComponents();

    const app = await api.oauth2.getCurrentBotApplicationInformation();
    RegisterCommand(
        'discordbot:deployCommands',
        async () => {
            const global =
                await api.applicationCommands.bulkOverwriteGlobalCommands(
                    app.id,
                    globalCommands,
                );

            let guildSpecific = null;
            if (guildId)
                guildSpecific =
                    await api.applicationCommands.bulkOverwriteGuildCommands(
                        app.id,
                        guildId,
                        guildSpecificCommands,
                    );

            console.log(
                `Successfully deployed ${global.length} global command(s)${guildSpecific ? ` and ${guildSpecific.length} server-specific command(s)` : ''}!`,
            );
        },
        true,
    );

    await gateway.connect();
})().catch((e) => console.log(inspect(e)));
