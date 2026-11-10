#!/usr/bin/env node
// Translation is authored, never copied over from another locale.
console.log('Read-only bilingual audit. No translations are copied or overwritten.');
await import('./check-docs.mjs');
