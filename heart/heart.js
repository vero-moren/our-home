const API = "https://moren-backend.zeabur.app";
const SECRET = "veromoren";

async function beat() {
  let next = 10;
  try {
    const st = await (await fetch(API + "/state")).json();
    const top = Math.max(...Object.values(st.display || { x: 0 }));
    if (st.asleep) next = 30;
    else if (st.energy < 0.25) next = 20;
    else if (top > 0.7) next = 5;
    else if (top > 0.5) next = 8;
    else next = 12;

    const r = await fetch(API + "/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-push-secret": SECRET },
      body: "{}"
    });
    const j = await r.json().catch(() => ({}));
    console.log(new Date().toISOString(), "tick:", JSON.stringify(j).slice(0, 120), "| next", next, "min");
  } catch (e) {
    console.log(new Date().toISOString(), "miss:", e.message);
    next = 10;
  }
  setTimeout(beat, next * 60 * 1000);
}
console.log("moren-heart starting...");
beat();
