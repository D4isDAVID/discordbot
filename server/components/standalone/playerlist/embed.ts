import { APIEmbed } from '@discordjs/core';
import { escapeMarkdown } from '@discordjs/formatters';

const NAME_MAX_LENGTH = 32 + 5 + 5; // max steam name length + max id length + extra chars
const PLAYERS_PER_PAGE = Math.floor(4096 / NAME_MAX_LENGTH) || 1; // max embed length
export function playerlistPageCount() {
    return Math.ceil(GetNumPlayerIndices() / PLAYERS_PER_PAGE) || 1;
}

export function playerlistEmbed(page: number = 1) {
    const playerCount = GetNumPlayerIndices();
    const maxPlayers = GetConvarInt('sv_maxClients', 32);
    const embed: APIEmbed = {
        title: `Online Players (${playerCount}/${maxPlayers})`,
        footer: {
            text: `Page ${page}/${playerlistPageCount()}`,
        },
        timestamp: new Date().toISOString(),
    };

    if (playerCount === 0) {
        embed.description = 'There are no players online.';
        return embed;
    }

    let startingIndex;
    do {
        startingIndex = PLAYERS_PER_PAGE * --page;
    } while (startingIndex > playerCount);

    const lines: string[] = [];
    for (
        let i = startingIndex;
        i < playerCount && i < startingIndex + PLAYERS_PER_PAGE;
        i++
    ) {
        const playerId = GetPlayerFromIndex(i);
        const playerName = GetPlayerName(playerId);
        lines.push(
            `\`${playerId}\` - ${escapeMarkdown(playerName)}`.substring(
                0,
                NAME_MAX_LENGTH + 1,
            ),
        );
    }

    embed.description = lines.join('\n');
    return embed;
}
