// Browser-side calls to the Netlify Functions. The Anthropic API key never touches this code.

const PASSWORD_KEY = "experts-app-password";

export function getPassword() {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) || "";
  } catch {
    return "";
  }
}
export function setPassword(value) {
  try {
    sessionStorage.setItem(PASSWORD_KEY, value);
  } catch {
    /* storage unavailable: the password is kept only for this request */
  }
}

export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function post(path, body, signal) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json", "x-app-password": getPassword() },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* not JSON (e.g. a platform timeout page) */
    }
    if (res.status === 404) throw new ApiError("The API isn't available. Run the app with `netlify dev` or deploy it to Netlify.");
    throw new ApiError(data.error || `Request failed (${res.status}).`, data.code);
  }
  return res;
}

export async function postJson(path, body, signal) {
  return (await post(path, body, signal)).json();
}

// Reads a newline-delimited JSON stream; calls onText for each text chunk.
export async function streamNdjson(path, body, onText, signal) {
  const res = await post(path, body, signal);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = null;
  for (;;) {
    const { value, done: finished } = await reader.read();
    if (finished) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      const event = JSON.parse(line);
      if (event.type === "text") onText(event.text);
      else if (event.type === "error") throw new ApiError(event.message);
      else if (event.type === "done") done = event;
    }
  }
  if (!done) throw new ApiError("The answer was cut off before it finished (the server may have hit its time limit). Try asking for a shorter answer.");
  return done;
}
