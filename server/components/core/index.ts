import { Component } from '../types.js';
import { interactionHandler } from './interaction-handler.js';
import { ready } from './ready.js';

export default {
    gatewayEvents: [ready, interactionHandler],
} satisfies Component;
