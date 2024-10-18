import {
    APIActionRowComponent,
    APIButtonComponentWithCustomId,
    APIMessageActionRowComponent,
    ButtonStyle,
    ComponentType,
} from '@discordjs/core';
import { createStatefulInteraction } from '../../../utils/stateful.js';
import { Button } from '../../types.js';
import { playerlistEmbed, playerlistPageCount } from './embed.js';

export enum PlayerlistButtonType {
    First,
    Previous,
    Reload,
    Next,
    Last,
}

const typeData: Record<
    PlayerlistButtonType,
    {
        emoji: string;
        state: (page: number) => string;
    }
> = {
    [PlayerlistButtonType.First]: {
        emoji: '⏪',
        state: () => 'first',
    },
    [PlayerlistButtonType.Previous]: {
        emoji: '⬅️',
        state: (page) => `${page - 1}`,
    },
    [PlayerlistButtonType.Reload]: {
        emoji: '🔃',
        state: (page) => `${page}`,
    },
    [PlayerlistButtonType.Next]: {
        emoji: '➡️',
        state: (page) => `${page + 1}`,
    },
    [PlayerlistButtonType.Last]: {
        emoji: '⏩',
        state: () => 'last',
    },
};

export const playerlistButtonBase = createStatefulInteraction<Button>({
    data: {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        custom_id: 'playerlist_button',
    },
    async execute({ data: interaction, api, state }) {
        const pageCount = playerlistPageCount();
        let page = Math.min(
            {
                first: 1,
                last: pageCount,
            }[state] ?? parseInt(state),
            pageCount,
        );

        await api.interactions.updateMessage(
            interaction.id,
            interaction.token,
            {
                embeds: [playerlistEmbed(page)],
                components: [playerlistActionRow(page)],
            },
        );
    },
});

function playerlistButton(
    type: PlayerlistButtonType,
    page: number = 1,
): APIButtonComponentWithCustomId {
    const data = typeData[type];
    const buttonData = playerlistButtonBase.stateful(data.state(page));
    buttonData.emoji = { name: data.emoji };

    if (
        (page === 1 &&
            [
                PlayerlistButtonType.First,
                PlayerlistButtonType.Previous,
            ].includes(type)) ||
        (page === playerlistPageCount() &&
            [PlayerlistButtonType.Next, PlayerlistButtonType.Last].includes(
                type,
            ))
    ) {
        buttonData.disabled = true;
    }

    return buttonData;
}

export function playerlistActionRow(
    page: number = 1,
): APIActionRowComponent<APIMessageActionRowComponent> {
    return {
        type: ComponentType.ActionRow,
        components: [
            playerlistButton(PlayerlistButtonType.First, page),
            playerlistButton(PlayerlistButtonType.Previous, page),
            playerlistButton(PlayerlistButtonType.Reload, page),
            playerlistButton(PlayerlistButtonType.Next, page),
            playerlistButton(PlayerlistButtonType.Last, page),
        ],
    };
}
