// Dev tool: screenshot a lab URL with headless Chrome (software WebGL), no extra dependencies.
// Usage: node scripts/lab-shot.mjs "<url>" <out.png> [width=1280] [height=720] [timeoutMs=90000] [js to run before capture]
// Waits until the page sets window.__labReady = true, then captures. Prints console errors.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const [url, out, width = '1280', height = '720', timeout = '90000', script] = process.argv.slice(2);
if (!url || !out) { console.error('usage: node scripts/lab-shot.mjs <url> <out.png> [w] [h] [timeoutMs]'); process.exit(2); }
const userDir = mkdtempSync(path.join(tmpdir(), 'labshot-'));
const chrome = spawn('google-chrome', [
  '--headless=new', '--no-sandbox', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
  `--window-size=${width},${height}`, '--remote-debugging-port=0', `--user-data-dir=${userDir}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const errors = [];
let exitCode = 0;
try {
  const portFile = path.join(userDir, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const port = readFileSync(portFile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(`exception: ${msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text}`);
    if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) errors.push(`console.${msg.params.type}: ${msg.params.args.map(a => a.value ?? a.description ?? '').join(' ')}`);
  };
  const send = (method, params = {}) => new Promise(resolve => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: +width, height: +height, deviceScaleFactor: 1, mobile: +width < 700 });
  await send('Page.navigate', { url });
  const started = Date.now();
  let ready = false;
  while (Date.now() - started < +timeout) {
    const result = await send('Runtime.evaluate', { expression: 'window.__labReady === true', returnByValue: true });
    if (result.result?.result?.value === true) { ready = true; break; }
    await sleep(250);
  }
  await sleep(ready ? 400 : 0);
  if (script) {
    const result = await send('Runtime.evaluate', { expression: script, returnByValue: true, awaitPromise: true });
    console.log('script ->', JSON.stringify(result.result?.result?.value ?? result.result?.exceptionDetails?.text ?? null));
    await sleep(1500);
  }
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log(`${ready ? 'ready' : 'TIMEOUT (captured anyway)'} in ${Date.now() - started} ms -> ${out}`);
  if (!ready) exitCode = 1;
  ws.close();
} catch (error) {
  console.error('lab-shot failed:', error.message);
  exitCode = 1;
} finally {
  chrome.kill('SIGKILL');
  await sleep(200);
  rmSync(userDir, { recursive: true, force: true });
}
if (errors.length) console.log('Page errors/warnings:\n' + [...new Set(errors)].slice(0, 30).join('\n'));
process.exit(exitCode);
