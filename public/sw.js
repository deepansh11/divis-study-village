const CACHE = "divi-village-shell-__BUILD_ID__";
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const response = await fetch("/");
      const html = await response.text();
      const assets = [
        ...html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g),
      ].map((match) => match[1]);
      const characterResponse = await fetch("/characters/manifest.json");
      if (!characterResponse.ok)
        throw new Error("Character assets could not be cached");
      const characters = await characterResponse.json();
      await cache.put(
        "/",
        new Response(html, { headers: { "Content-Type": "text/html" } }),
      );
      await cache.addAll([
        ...new Set(assets),
        "/icon.svg",
        "/apple-touch-icon.png",
        "/manifest.webmanifest",
        "/fonts/dm-sans.ttf",
        "/fonts/lora.ttf",
        "/characters/manifest.json",
        ...Object.keys(characters).map((name) => `/characters/${name}.webp`),
      ]);
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key !== CACHE && key.startsWith("divi-village-"))
          await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put("/", response.clone());
          }
          return response;
        } catch {
          return (await caches.match("/")) || Response.error();
        }
      })(),
    );
    return;
  }
  event.respondWith(
    (async () => {
      // These are same-origin public static files. Preview/hosting servers may
      // add Vary: Origin; font requests include Origin while precache requests
      // may not. Ignore that irrelevant variation for reliable offline fonts.
      const cached = await caches.match(event.request, { ignoreVary: true });
      if (cached) return cached;
      const response = await fetch(event.request);
      if (
        response.ok &&
        new URL(event.request.url).pathname.startsWith("/assets/")
      ) {
        const cache = await caches.open(CACHE);
        await cache.put(event.request, response.clone());
      }
      return response;
    })(),
  );
});
