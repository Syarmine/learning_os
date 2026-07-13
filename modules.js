// modules.js — the registry the hub reads. Each learning module is one entry.
// To add a topic: copy modules/_template to modules/<id>/, author its
// js/data.js, then add ONE entry below. `status: 'ready'` links the card;
// 'planned' shows a placeholder card with no link.

window.MODULES = [
  {
    id: 'claude-agentic',
    title: 'Working Agentically with Claude',
    emoji: '🧭',
    path: 'modules/claude-agentic/index.html',
    description:
      'A guided, interactive path from “what is an AI agent?” to orchestrating ' +
      'Claude across chat, Cowork, and Claude Code. For the curious and the technical alike.',
    tags: ['chat', 'Cowork', 'Code', 'MCP', 'skills', 'agents'],
    status: 'ready',
  },

  // Example of a future module a different chat could build in its own folder.
  // It stays a placeholder until modules/financial/ exists and status flips to 'ready'.
  {
    id: 'financial',
    title: 'Financial Literacy (example)',
    emoji: '💹',
    path: 'modules/financial/index.html',
    description:
      'Placeholder showing how the hub grows: spin up another chat, copy ' +
      'modules/_template into modules/financial/, and this card goes live.',
    tags: ['example'],
    status: 'planned',
  },
];
