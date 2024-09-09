import {
    APIApplicationCommandBasicOption,
    APIApplicationCommandInteractionDataBasicOption,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteractionData,
    APIModalSubmission,
    ApplicationCommandOptionType,
} from '@discordjs/core';

type MappedChatInputOptionValues = Record<string, string | number | boolean>;

function isBasicOption(
    option:
        | APIApplicationCommandInteractionDataOption
        | APIApplicationCommandBasicOption,
): option is APIApplicationCommandInteractionDataBasicOption {
    return [
        ApplicationCommandOptionType.Attachment,
        ApplicationCommandOptionType.Boolean,
        ApplicationCommandOptionType.Channel,
        ApplicationCommandOptionType.Integer,
        ApplicationCommandOptionType.Mentionable,
        ApplicationCommandOptionType.Number,
        ApplicationCommandOptionType.Role,
        ApplicationCommandOptionType.String,
        ApplicationCommandOptionType.User,
    ].includes(option.type);
}

export function mapChatInputOptionValues({
    options,
}:
    | APIChatInputApplicationCommandInteractionData
    | APIApplicationCommandSubcommandOption): MappedChatInputOptionValues {
    return (
        options?.reduce((values, option) => {
            if (isBasicOption(option)) {
                values[option.name] = option.value;
            }

            return values;
        }, {} as MappedChatInputOptionValues) ?? {}
    );
}

export function mapModalTextInputValues({
    components,
}: APIModalSubmission): Record<string, string> {
    return components.reduce(
        (values, { components: [textInput] }) => {
            values[textInput!.custom_id] = textInput!.value;
            return values;
        },
        {} as Record<string, string>,
    );
}
