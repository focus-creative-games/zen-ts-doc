#!/usr/bin/env node
// docs/spec is the maintained source. Never overwrite it from a legacy snapshot.
console.log('docs/spec 是规范维护源；sync-spec 现仅执行只读检查，不复制旧快照。');
await import('./check-docs.mjs');
