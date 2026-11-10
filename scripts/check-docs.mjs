#!/usr/bin/env node
// Read-only bilingual checks. Translation content is never generated or overwritten.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'docs');
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
  });
}
const english = path.join(root, 'i18n/en/docusaurus-plugin-content-docs/current');
const chineseFiles = walk(docs);
const englishFiles = walk(english);
const files = [...chineseFiles, ...englishFiles];
const failures = [];
const fail = (p, message) => failures.push(`${path.relative(root, p)}: ${message}`);
const zhPaths = new Set(chineseFiles.map(p => path.relative(docs, p)));
const enPaths = new Set(englishFiles.map(p => path.relative(english, p)));
for (const name of zhPaths) if (!enPaths.has(name)) fail(docs, `Missing English page: ${name}`);
for (const name of enPaths) if (!zhPaths.has(name)) fail(english, `No Chinese counterpart: ${name}`);
const retired = [
  /当前 P[01]/,
  /QuickJsTransition/,
  /QuickJS 将在/,
  /仍使用过渡 QuickJS/,
  /当前.*尚未.*(?:tuple|BigInt|Unity 优化)/,
  /ZenTS\/Generate\/All/,
  /ref 的新引用也通过结果元组返回/,
  /Bytes[^\n]*↔[^\n]*JS\s*`?string/,
  /ZenTSTest|ZTSTest/i,
  /[A-Za-z]:[\\/]workspace[\\/]/i,
];
for (const p of files) {
  const s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
  if (!s.startsWith('---\n') && !s.startsWith('---\r\n')) fail(p, '缺少 frontmatter');
  if (!/^title:/m.test(s)) fail(p, '缺少 title');
  for (const pattern of retired) if (pattern.test(s)) fail(p, `过时内容 ${pattern}`);
  if (p.startsWith(english + path.sep) && /[\u3400-\u9fff]/u.test(s))
    fail(p, 'English page contains untranslated Chinese');
  let inCode = false;
  const prose = [];
  for (const line of s.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { inCode = !inCode; continue; }
    if (inCode && /\bzents\.(register_method|make_generic_method)\s*\(/.test(line))
      fail(p, '代码示例调用已删除 API');
    if (!inCode) {
      prose.push(line);
      const outsideInline = line.replace(/`+[^`\n]*`+/g, '');
      if (p.startsWith(english + path.sep) && /\b(?:Nullable|GetComponent|Span|GetFunction)<[^>\n]+>/.test(outsideInline))
        fail(p, 'Escape generic angle brackets outside code to prevent HTML tag parsing');
    }
  }
  if (inCode) fail(p, '代码围栏未关闭');
  // Full locale builds additionally verify MDX, routes, and anchors.
  for (const m of prose.join('\n').matchAll(/\]\(([^\s)]+\.md(?:#[^)]*)?)\)/g)) {
    const target = m[1].split('#')[0];
    if (/^(?:https?:|\/|#)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(p), decodeURIComponent(target))))
      fail(p, `不存在的相对文档链接 ${target}`);
  }
}
function walkJson(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walkJson(p) : e.name.endsWith('.json') ? [p] : [];
  });
}
for (const p of walkJson(path.join(root, 'i18n/en'))) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [key, value] of Object.entries(data)) {
    const message = value?.message;
    if (typeof message === 'string' && /[\u3400-\u9fff]/u.test(message))
      fail(p, `Untranslated English UI: ${key}`);
    if (typeof message === 'string' && /(?:on QuickJS|Unity 2021\.3|Zero-config)/i.test(message))
      fail(p, `Stale English UI: ${key}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Bilingual documentation checks passed: ${chineseFiles.length} Chinese / ${englishFiles.length} English pages. No files written.`);
}
