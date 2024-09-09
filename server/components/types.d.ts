import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIButtonComponentWithCustomId,
    APIChannelSelectComponent,
    APIChatInputApplicationCommandInteraction,
    APIContextMenuInteraction,
    APIInteraction,
    APIMentionableSelectComponent,
    APIMessageApplicationCommandInteraction,
    APIMessageComponentButtonInteraction,
    APIMessageComponentInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIModalInteractionResponseCallbackData,
    APIModalSubmitInteraction,
    APIRoleSelectComponent,
    APIStringSelectComponent,
    APIUserApplicationCommandInteraction,
    APIUserSelectComponent,
    ApplicationCommandType,
    ComponentType,
    MappedEvents,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    WithIntrinsicProps,
} from '@discordjs/core';
import { RestEvents } from '@discordjs/rest';
import { Awaitable } from '@discordjs/util';
import { ManagerShardEventsMap } from '@discordjs/ws';

export type EventName =
    | keyof RestEvents
    | keyof ManagerShardEventsMap
    | keyof MappedEvents;

export type EventExecuteArgs<T extends EventName> = T extends keyof RestEvents
    ? RestEvents[T]
    : T extends keyof ManagerShardEventsMap
      ? ManagerShardEventsMap[T]
      : T extends keyof MappedEvents
        ? MappedEvents[T]
        : never;

export interface IEvent<T extends EventName> {
    readonly type: 'on' | 'once';
    readonly name: T;
    readonly execute: (...args: EventExecuteArgs<T>) => Awaitable<void>;
}

export type ContextMenuInteractionType<T extends APIContextMenuInteraction> =
    T extends APIUserApplicationCommandInteraction
        ? ApplicationCommandType.User
        : T extends APIMessageApplicationCommandInteraction
          ? ApplicationCommandType.Message
          : never;

export interface MessageComponentDataMap {
    [ComponentType.ActionRow]: never;
    [ComponentType.Button]: APIButtonComponentWithCustomId;
    [ComponentType.StringSelect]: APIStringSelectComponent;
    [ComponentType.TextInput]: never;
    [ComponentType.UserSelect]: APIUserSelectComponent;
    [ComponentType.RoleSelect]: APIRoleSelectComponent;
    [ComponentType.MentionableSelect]: APIMentionableSelectComponent;
    [ComponentType.ChannelSelect]: APIChannelSelectComponent;
}

export type InteractionData<T extends APIInteraction> =
    T extends APIApplicationCommandInteraction
        ? T extends APIChatInputApplicationCommandInteraction
            ? RESTPostAPIChatInputApplicationCommandsJSONBody
            : T extends APIContextMenuInteraction
              ? RESTPostAPIContextMenuApplicationCommandsJSONBody & {
                    type: ContextMenuInteractionType<T>;
                }
              : never
        : T extends APIMessageComponentInteraction
          ? MessageComponentDataMap[T['data']['component_type']]
          : T extends APIModalSubmitInteraction
            ? APIModalInteractionResponseCallbackData
            : never;

export type InteractionExecuteArgs<T extends APIInteraction> =
    WithIntrinsicProps<T>;

export interface IInteraction<T extends APIInteraction> {
    readonly data: InteractionData<T>;
    readonly execute: (props: InteractionExecuteArgs<T>) => Awaitable<void>;
    readonly autocomplete?: T extends APIChatInputApplicationCommandInteraction
        ? (
              props: InteractionExecuteArgs<APIApplicationCommandAutocompleteInteraction>,
          ) => Awaitable<void>
        : never;
}

export type SelectMenuInteractionWithType<T extends ComponentType> =
    APIMessageComponentSelectMenuInteraction & { data: { component_type: T } };

export type RestEvent<T extends keyof RestEvents> = IEvent<T>;
export type WebSocketEvent<T extends keyof ManagerShardEventsMap> = IEvent<T>;
export type GatewayEvent<T extends keyof MappedEvents> = IEvent<T>;

export type RestEventsMap = {
    [T in keyof RestEvents]: RestEvent<T>;
};
export type WebSocketEventsMap = {
    [T in keyof ManagerShardEventsMap]: WebSocketEvent<T>;
};
export type GatewayEventsMap = {
    [T in keyof MappedEvents]: GatewayEvent<T>;
};
export type EventsMap = RestEventsMap & WebSocketEventsMap & GatewayEventsMap;

export type ChatInputCommand =
    IInteraction<APIChatInputApplicationCommandInteraction>;
export type UserCommand = IInteraction<APIUserApplicationCommandInteraction>;
export type MessageCommand =
    IInteraction<APIMessageApplicationCommandInteraction>;
export type ContextMenuCommand = UserCommand | MessageCommand;
export type ApplicationCommand = ChatInputCommand | ContextMenuCommand;

export type Button = IInteraction<APIMessageComponentButtonInteraction>;
export type StringSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.StringSelect>
>;
export type UserSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.UserSelect>
>;
export type RoleSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.RoleSelect>
>;
export type MentionableSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.MentionableSelect>
>;
export type ChannelSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.ChannelSelect>
>;
export type SelectMenu =
    | StringSelect
    | UserSelect
    | RoleSelect
    | MentionableSelect
    | ChannelSelect;
export type MessageComponent = Button | SelectMenu;

export type Modal = IInteraction<APIModalSubmitInteraction>;

export interface Component {
    readonly restEvents?: RestEventsMap[keyof RestEvents][];
    readonly wsEvents?: WebSocketEventsMap[keyof ManagerShardEventsMap][];
    readonly gatewayEvents?: GatewayEventsMap[keyof MappedEvents][];
    readonly commands?: ApplicationCommand[];
    readonly messageComponents?: MessageComponent[];
    readonly modals?: Modal[];
}
