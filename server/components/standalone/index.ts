import { Component } from '../types.js';
import { playerlistButtonBase } from './playerlist/action-row.js';
import { playerlistCommand } from './playerlist/command.js';

export default {
    commands: [playerlistCommand],
    messageComponents: [playerlistButtonBase],
} satisfies Component;
