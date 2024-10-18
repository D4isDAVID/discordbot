import { Collection } from '@discordjs/collection';
import {
    RESTPutAPIApplicationCommandsJSONBody,
    RESTPutAPIApplicationGuildCommandsJSONBody,
} from '@discordjs/core';
import EventEmitter from 'node:events';
import { inspect } from 'node:util';
import { client, gateway, rest, zdiscordBridge } from '../utils/env.js';
import { isStatefulInteraction } from '../utils/stateful.js';
import core from './core/index.js';
import ping from './ping/index.js';
import standalone from './standalone/index.js';
import {
    ApplicationCommand,
    Component,
    EventName,
    EventsMap,
    MessageComponent,
    Modal,
} from './types.js';
import zdiscord from './zdiscord/index.js';

export const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

export const globalCommands: RESTPutAPIApplicationCommandsJSONBody = [];
export const guildSpecificCommands: RESTPutAPIApplicationGuildCommandsJSONBody =
    [];

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
    wsEvents,
    gatewayEvents,
    commands: componentCommands,
    messageComponents,
    modals,
}: Component) {
    restEvents && registerEvents(rest, restEvents);
    wsEvents && registerEvents(gateway, wsEvents);
    gatewayEvents && registerEvents(client, gatewayEvents);

    componentCommands?.map((command) => {
        interactions.commands.set(command.data.name, command);
        (command.guildSpecific ? guildSpecificCommands : globalCommands).push(
            command.data,
        );
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
    loadComponent(core);
    loadComponent(ping);
    loadComponent(standalone);
    if (zdiscordBridge) {
        loadComponent(zdiscord);
        console.log('zdiscord bridge enabled');
    }
}
