import { Component } from '../types.js';
import { command } from './command.js';
import { heartbeat } from './heartbeat.js';

export default {
    wsEvents: [heartbeat],
    commands: [command],
} satisfies Component;
