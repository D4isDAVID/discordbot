import {
    APIInteraction,
    APIInteractionResponse,
    InteractionResponseType,
    InteractionType,
} from '@discordjs/core/http-only';
import { HttpHandlerRequest, HttpHandlerResponse } from './types.js';
import { verifyDiscordRequest } from './verify.js';

async function handleInteraction(
    interaction: APIInteraction,
): Promise<APIInteractionResponse | void> {
    switch (interaction.type) {
        case InteractionType.Ping:
            return { type: InteractionResponseType.Pong };
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
            const result = await handleInteraction(interaction);
            result && response.send(JSON.stringify(result));
        });
    }

    SetHttpHandler(handler);
}
