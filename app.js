(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const form = $("link-form");
  const input = $("media-url");
  const notice = $("notice");
  const resultCard = $("result-card");
  const savedList = $("saved-list");
  const emptyLibrary = $("empty-library");

  const platformInfo = {
    youtube: {
      name: "YouTube",
      short: "Official viewing, offline, and export options",
      avatar: "▶",
      url: "https://www.youtube.com/",
      guidance: "Use YouTube's own offline feature where available. For videos you uploaded, use YouTube Studio or Google Takeout. VidVault cannot download arbitrary YouTube videos from a page link.",
      disclaimer: "The official YouTube app or export tool controls whether a download is available.",
      home: "https://www.youtube.com/"
    },
    instagram: {
      name: "Instagram",
      short: "Reels and your own content exports",
      avatar: "◎",
      url: "https://www.instagram.com/",
      guidance: "Open the Reel in Instagram and use its native download option if available. For your own content, use Instagram's official export tools. Availability depends on the post, creator settings, and account access.",
      disclaimer: "VidVault does not log in to Instagram or extract private media.",
      home: "https://www.instagram.com/"
    },
    x: {
      name: "X / Twitter",
      short: "Post links and native download options",
      avatar: "𝕏",
      url: "https://x.com/",
      guidance: "Open the post in X and use its native Download video option when available. Download availability can depend on the post, uploader settings, and account access.",
      disclaimer: "VidVault does not bypass post permissions or platform restrictions.",
      home: "https://x.com/"
    },
    direct: {
      name: "Direct media link",
      short: "A URL that may point to a media file",
      avatar: "↓",
      url: "",
      guidance: "If this URL is a direct media file and you have permission to save it, open it in your browser. The server hosting the file controls whether it can be accessed or downloaded.",
      disclaimer: "This static website does not proxy, process, or host media files.",
      home: ""
    },
    unknown: {
      name: "Website link",
      short: "No supported platform was detected",
      avatar: "↗",
      url: "",
      guidance: "Open this link in your browser and look for the website's own download or export feature. Only download content you are authorized to save.",
      disclaimer: "A pasted URL is not necessarily a direct media file.",
      home: ""
    }
  };

  function safeUrl(value) {
    try {
      const url = new URL(value.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
      return url;
    } catch {
      return null;
    }
  }

  function platformFor(url) {
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be") return "youtube";
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "instagram";
    if (host === "x.com" || host.endsWith(".x.com") || host === "twitter.com" || host.endsWith(".twitter.com") || host === "t.co") return "x";
    if (/\.(mp4|webm|mov|m4v|mp3|m4a|aac|ogg|opus|wav|flac)$/i.test(url.pathname)) return "direct";
    return "unknown";
  }

  function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.classList.toggle("error", isError);
    notice.hidden = false;
  }

  function detect(raw) {
    const url = safeUrl(raw);
    if (!url) {
      showNotice("Enter a complete http:// or https:// URL to continue.", true);
      resultCard.hidden = true;
      return;
    }
    const kind = platformFor(url);
    const info = platformInfo[kind];
    $("platform-avatar").textContent = info.avatar;
    $("platform-name").textContent = info.name;
    $("platform-subtitle").textContent = info.short;
    $("platform-guidance").textContent = info.guidance;
    $("result-disclaimer").textContent = info.disclaimer;

    const openLink = $("open-platform");
    openLink.href = kind === "direct" || kind === "unknown" ? url.href : url.href;
    openLink.textContent = kind === "direct" ? "Open media link ↗" :
      kind === "unknown" ? "Open website ↗" : `Open ${info.name} ↗`;

    resultCard.hidden = false;
    showNotice(kind === "direct"
      ? "Direct media URL pattern detected. Actual download behavior depends on the source server."
      : `${info.name} link detected. VidVault will hand off to the official website; it will not extract the video.`
    );
    resultCard.dataset.url = url.href;
    resultCard.dataset.platform = kind;
  }

  function loadItems() {
    try {
      const parsed = JSON.parse(localStorage.getItem("vidvault-links-v1") || "[]");
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.url === "string") : [];
    } catch {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem("vidvault-links-v1", JSON.stringify(items.slice(0, 100)));
      return true;
    } catch {
      showNotice("This browser could not save the list. Check browser storage settings.", true);
      return false;
    }
  }

  function renderItems() {
    const items = loadItems();
    savedList.replaceChildren();
    emptyLibrary.hidden = items.length > 0;
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "saved-item";
      const icon = document.createElement("div");
      icon.className = "saved-symbol";
      icon.textContent = item.platform === "youtube" ? "▶" : item.platform === "instagram" ? "◎" : item.platform === "x" ? "𝕏" : "↗";
      const meta = document.createElement("div");
      meta.className = "saved-meta";
      const title = document.createElement("strong");
      title.textContent = item.name || "Saved link";
      const url = document.createElement("span");
      url.textContent = item.url;
      meta.append(title, url);
      const open = document.createElement("a");
      open.href = item.url;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
      open.textContent = "Open ↗";
      const remove = document.createElement("button");
      remove.className = "text-button";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.name || "saved link"}`);
      remove.addEventListener("click", () => {
        const current = loadItems();
        current.splice(index, 1);
        saveItems(current);
        renderItems();
      });
      li.append(icon, meta, open, remove);
      savedList.append(li);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    detect(input.value);
  });

  $("paste-button").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.readText) throw new Error("Clipboard access unavailable");
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        showNotice("Your clipboard is empty.", true);
        return;
      }
      input.value = text.trim();
      detect(input.value);
    } catch {
      input.focus();
      showNotice("Clipboard access was blocked. Tap the link field and paste using your keyboard.");
    }
  });

  $("clear-button").addEventListener("click", () => {
    input.value = "";
    resultCard.hidden = true;
    notice.hidden = true;
    input.focus();
  });

  $("copy-link").addEventListener("click", async () => {
    const url = resultCard.dataset.url;
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      showNotice("Link copied.");
    } catch {
      showNotice("Copy was blocked by your browser. Select and copy the URL from the input field.");
    }
  });

  $("save-link").addEventListener("click", () => {
    const url = resultCard.dataset.url;
    const kind = resultCard.dataset.platform;
    if (!url || !kind) return;
    const items = loadItems();
    if (items.some(item => item.url === url)) {
      showNotice("This link is already in your saved list.");
      return;
    }
    const info = platformInfo[kind];
    items.unshift({ url, platform: kind, name: info?.name || "Saved link", savedAt: new Date().toISOString() });
    if (saveItems(items)) {
      renderItems();
      showNotice("Link saved in this browser.");
    }
  });

  $("clear-library").addEventListener("click", () => {
    if (!loadItems().length) return;
    if (window.confirm("Clear all VidVault saved links from this browser?")) {
      localStorage.removeItem("vidvault-links-v1");
      renderItems();
      showNotice("Saved list cleared.");
    }
  });

  // Handle links shared to the site when a browser supports Web Share Target only if hosted/configured.
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("url") || params.get("text");
  if (shared) {
    input.value = shared;
    detect(shared);
  }
  renderItems();
})();
