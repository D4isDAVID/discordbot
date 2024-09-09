import {
    APIInteraction,
    APIInteractionResponse,
    ApplicationCommandType,
    InteractionResponseType,
    InteractionType,
} from '@discordjs/core/http-only';
import { inspect } from 'util';
import { interactions, statefuls } from '../components/loader.js';
import { api } from '../utils/env.js';
import { HttpHandlerRequest, HttpHandlerResponse } from './types.js';
import { verifyDiscordRequest } from './verify.js';

function findStateful(id: string, list: string[]): string | undefined {
    return list
        .filter((s) => id.startsWith(s))
        .sort((a, b) => b.length - a.length)[0];
}

function handleInteraction(
    interaction: APIInteraction,
    cb: (response?: APIInteractionResponse) => void,
) {
    const props = { data: interaction, cb, api };

    switch (interaction.type) {
        case InteractionType.Ping:
            cb({ type: InteractionResponseType.Pong });
            break;

        case InteractionType.ApplicationCommand:
        case InteractionType.ApplicationCommandAutocomplete:
            const command = interactions.commands.get(interaction.data.name);

            if (!command)
                throw new Error(
                    `Command not defined for ${interaction.data.name}`,
                );

            if (
                interaction.type === InteractionType.ApplicationCommand &&
                (command.data.type ?? ApplicationCommandType.ChatInput) ===
                    interaction.data.type
            )
                //@ts-ignore
                command.execute(props);
            else if (command.autocomplete)
                //@ts-ignore
                command.autocomplete(props);
            break;

        case InteractionType.MessageComponent:
            const componentId = interaction.data.custom_id;

            let component = interactions.messageComponents.get(componentId);

            if (!component) {
                const staticId = findStateful(
                    componentId,
                    statefuls.messageComponents,
                );

                if (staticId)
                    component = interactions.messageComponents.get(staticId);
            }

            if (!component)
                throw new Error(
                    `Message component not defined for ${interaction.data.custom_id}.`,
                );

            if (component.data.type === interaction.data.component_type)
                //@ts-ignore
                component.execute(props);
            break;

        case InteractionType.ModalSubmit:
            const modalId = interaction.data.custom_id;

            let modal = interactions.modals.get(modalId);

            if (!modal) {
                const staticId = findStateful(modalId, statefuls.modals);

                if (staticId) modal = interactions.modals.get(staticId);
            }

            if (!modal)
                throw new Error(
                    `Modal not defined for ${interaction.data.custom_id}.`,
                );

            //@ts-ignore
            modal.execute(props);
            break;

        default:
            break;
    }
}

export function setupHttpHandler(verifyKey: string) {
    const verify = verifyDiscordRequest(verifyKey);

    async function handler(
        request: HttpHandlerRequest,
        response: HttpHandlerResponse,
    ) {
        request.setDataHandler(async (body) => {
            if (!verify(request, body)) {
                response.writeHead(401);
                return response.send('invalid request signature');
            }

            const interaction = JSON.parse(body) as APIInteraction;
            try {
                handleInteraction(interaction, (interactionResponse) => {
                    if (!interactionResponse) {
                        response.writeHead(202);
                        return response.send();
                    }

                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                    });
                    response.write(JSON.stringify(interactionResponse));
                    response.send();
                });
            } catch (e) {
                console.error(e instanceof Error ? e.message : inspect(e));
                response.writeHead(500);
                return response.send('internal server error');
            }
        });
    }

    SetHttpHandler(handler);
}
