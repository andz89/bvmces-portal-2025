// Client side of the file-upload API routes (see utils/lib/formRoute.js).
// Sends a FormData and returns the route's JSON ({ error } or
// { success, ... }) — the same shape the old server actions returned.
//
// If something between the user and the app (Cloudflare, a school network
// filter, antivirus) answers instead, the reply isn't our JSON. Turn that
// into a readable error, with the cf-ray id so the block can be looked up
// in Cloudflare → Security → Events. Network failures still throw.
export async function postForm(url, formData) {
  const response = await fetch(url, { method: "POST", body: formData });
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    const cfRay = response.headers.get("cf-ray");

    console.error("[postForm] non-JSON response", {
      url,
      status: response.status,
      server: response.headers.get("server"),
      cfRay,
      cfMitigated: response.headers.get("cf-mitigated"),
      body: text.slice(0, 300),
    });

    const ref = cfRay ? ` (ref: ${cfRay})` : "";

    if (response.status === 403) {
      return {
        error: `Upload was blocked by the network (HTTP 403). Try another connection, like mobile data, or send this to the admin${ref}.`,
      };
    }

    return {
      error: `Upload failed (HTTP ${response.status}). Please try again${ref}.`,
    };
  }
}
