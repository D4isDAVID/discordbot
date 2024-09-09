import { setTimeout } from 'node:timers/promises';
import { inspect } from 'node:util';
import { commands, loadComponents } from './components/loader.js';
import { api, botToken, gateway } from './utils/env.js';

(async () => {
    await setTimeout(0);

    if (!botToken) {
        console.log(
            '^1[ERROR] Please provide a bot token with the ^3discordbot:botToken ^1convar and restart the resource.^7',
        );
        return;
    }

    loadComponents();

    const app = await api.oauth2.getCurrentBotApplicationInformation();
    RegisterCommand(
        'discordbot:deploy',
        async () => {
            const result =
                await api.applicationCommands.bulkOverwriteGlobalCommands(
                    app.id,
                    commands,
                );
            console.log(`Successfully deployed ${result.length} command(s)!`);
        },
        true,
    );

    await gateway.connect();
})().catch((e) => console.log(inspect(e)));
