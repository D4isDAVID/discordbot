import { Collection } from '@discordjs/collection';
import { RESTPutAPIApplicationCommandsJSONBody } from '@discordjs/core/http-only';
import EventEmitter from 'node:events';
import { inspect } from 'node:util';
import { rest } from '../utils/env.js';
import { isStatefulInteraction } from '../utils/stateful.js';
import ping from './ping/index.js';
import {
    ApplicationCommand,
    Component,
    EventName,
    EventsMap,
    MessageComponent,
    Modal,
} from './types.js';

export const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

export const commands: RESTPutAPIApplicationCommandsJSONBody = [];

export const statefuls = {
    messageComponents: [],
    modals: [],
} as { messageComponents: string[]; modals: string[] };

function registerEvent(emitter: EventEmitter, event: EventsMap[EventName]) {
    emitter[event.type](event.name, async (...args) => {
        try {
            await event.execute(...args);
        } catch (err) {
            console.error(inspect(err));
        }
    });
}

function registerEvents(emitter: EventEmitter, events: EventsMap[EventName][]) {
    for (const event of events) {
        registerEvent(emitter, event);
    }
}

function loadComponent({
    restEvents,
    commands: componentCommands,
    messageComponents,
    modals,
}: Component) {
    restEvents && registerEvents(rest, restEvents);

    componentCommands?.map((command) => {
        interactions.commands.set(command.data.name, command);
        commands.push(command.data);
    });
    messageComponents?.map((messageComponent) => {
        const customId = messageComponent.data.custom_id;
        interactions.messageComponents.set(customId, messageComponent);

        if (isStatefulInteraction(messageComponent))
            statefuls.messageComponents.push(customId);
    });
    modals?.map((modal) => {
        const customId = modal.data.custom_id;
        interactions.modals.set(customId, modal);

        if (isStatefulInteraction(modal)) statefuls.modals.push(customId);
    });
}

export function loadComponents() {
    loadComponent(ping);
}
