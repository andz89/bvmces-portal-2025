# Wrangler Commands — School Portal

Useful commands for debugging and monitoring the Next.js + OpenNext + Cloudflare Worker deployment.

## 1. Run the Cloudflare Worker locally

```bash
npx wrangler dev
```

Runs the OpenNext/Cloudflare Worker locally.

Use this to test the application in a Cloudflare Worker-like runtime instead of the normal Next.js development server.

`console.log()` output should appear directly in the terminal.

## 2. Watch logs from the deployed production Worker

```bash
npx wrangler tail
```

Streams logs from the deployed Cloudflare Worker.

You can specify the Worker name:

```bash
npx wrangler tail bvasquezmces
```

This does **not** deploy anything. It only watches the already deployed Worker.

## 3. Use readable log output

```bash
npx wrangler tail bvasquezmces --format pretty
```

Recommended for normal production debugging.

## 4. Show only POST requests

```bash
npx wrangler tail bvasquezmces --method POST --format pretty
```

Useful for debugging uploads, Server Actions, API requests, and other POST requests.

## 5. Search for a specific console.log message

```bash
npx wrangler tail bvasquezmces --search "LESSON PLAN UPLOAD"
```

For example, if your code contains:

```js
console.log("========== LESSON PLAN UPLOAD START ==========");
```

you can search for that message.

Another example:

```bash
npx wrangler tail bvasquezmces --search "BEFORE APPSCRIPT"
```

## 6. Add clear start/end logs

At the beginning of a Route Handler:

```js
console.log("========== UPLOAD ROUTE START ==========");
```

At the end:

```js
console.log("========== UPLOAD ROUTE FINISHED ==========");
```

A useful debugging sequence is:

```text
UPLOAD ROUTE START
FILE RECEIVED
ARRAYBUFFER DONE
BASE64 DONE
BEFORE APPSCRIPT
AFTER APPSCRIPT: 200
UPLOAD ROUTE FINISHED
```

The last message you see helps identify where the request stopped.

## 7. Debugging Server Actions

Put a log at the very first line:

```js
export async function addLessonPlan(formData) {
  console.log("========== ADD LESSON PLAN START ==========");

  // ...
}
```

Then:

```bash
npx wrangler tail bvasquezmces --format pretty
```

If the browser shows a Server Action request but this log never appears, the action may be failing or being rejected before the function starts.

## 8. Debugging a Route Handler

Example:

```js
export async function POST(request) {
  console.log("========== ROUTE HANDLER START ==========");

  // ...

  console.log("FILE RECEIVED:", file.name);
  console.log("FILE SIZE:", file.size);

  // ...

  console.log("ARRAYBUFFER DONE");

  // ...

  console.log("BASE64 DONE");

  // ...

  console.log("BEFORE APPSCRIPT");

  // ...

  console.log("AFTER APPSCRIPT:", response.status);
}
```

Then:

```bash
npx wrangler tail bvasquezmces --format pretty
```

## 9. Recommended production upload debugging

Start with:

```bash
npx wrangler tail bvasquezmces --format pretty
```

Then reproduce the problem in the production browser.

If there are too many GET requests:

```bash
npx wrangler tail bvasquezmces --method POST --format pretty
```

If you have a distinctive console log:

```bash
npx wrangler tail bvasquezmces --search "LESSON PLAN UPLOAD"
```

## 10. `wrangler dev` vs `wrangler tail`

### Local Worker

```bash
npx wrangler dev
```

Runs your Worker locally:

```text
Local browser
    ↓
Local OpenNext
    ↓
Local Cloudflare Worker
```

### Production Worker

```bash
npx wrangler tail bvasquezmces
```

Watches the deployed production Worker:

```text
Production browser
    ↓
Cloudflare
    ↓
Production Worker
```

## Quick reference

| Purpose | Command |
|---|---|
| Run Worker locally | `npx wrangler dev` |
| Watch production logs | `npx wrangler tail bvasquezmces` |
| Readable production logs | `npx wrangler tail bvasquezmces --format pretty` |
| Only POST requests | `npx wrangler tail bvasquezmces --method POST --format pretty` |
| Search console logs | `npx wrangler tail bvasquezmces --search "LESSON PLAN UPLOAD"` |

### Recommended workflow

For a production upload problem:

```bash
npx wrangler tail bvasquezmces --format pretty
```

Then reproduce the problem in the browser.

If there are too many GET requests:

```bash
npx wrangler tail bvasquezmces --method POST --format pretty
```

If you have a distinctive `console.log()`:

```bash
npx wrangler tail bvasquezmces --search "YOUR LOG MESSAGE"
```
