import { Component } from '../types.js';
import { guildMemberAdd } from './events/guild-member-add.js';
import { guildMemberRemove } from './events/guild-member-remove.js';
import { guildMemberUpdate } from './events/guild-member-update.js';

export default {
    gatewayEvents: [guildMemberAdd, guildMemberRemove, guildMemberUpdate],
} satisfies Component;
