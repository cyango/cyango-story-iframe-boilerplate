document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("storyIframe");
  const buttonContainer = document.querySelector(".button-container");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const iframeContainer = document.querySelector(".iframe-container");
  const CYANGO_API_BASE_URL = "https://api.cyango.com";

  function sendMessageToIframe(data) {
    if (!iframe || !iframe.contentWindow) {
      console.warn("Iframe is not ready yet");
      return;
    }

    console.log("Sending message to iframe:", data);
    iframe.contentWindow.postMessage(data, "*");
  }

  function updateIframeScene(sceneId) {
    sendMessageToIframe({
      type: "GO_TO_SCENE",
      targetSceneId: sceneId,
    });
  }

  function setActiveButton(sceneId) {
    if (!buttonContainer) return;
    const cards = buttonContainer.querySelectorAll(".scene-card");
    cards.forEach((card) => {
      const isActive = card.getAttribute("data-scene") === sceneId;
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
      card.classList.toggle("scene-card--active", isActive);
    });
  }

  function getStoryIdFromIframeSrc(src) {
    try {
      const iframeUrl = new URL(src, window.location.href);
      const pathSegments = iframeUrl.pathname.split("/").filter(Boolean);

      const storyIdFromQuery =
        iframeUrl.searchParams.get("storyId") ||
        iframeUrl.searchParams.get("id") ||
        iframeUrl.searchParams.get("story");
      if (storyIdFromQuery) return storyIdFromQuery;

      const storyIndex = pathSegments.findIndex((segment) => segment === "story");
      if (storyIndex !== -1 && pathSegments[storyIndex + 1]) {
        return pathSegments[storyIndex + 1];
      }

      if (pathSegments[0]) {
        return pathSegments[0];
      }

      return null;
    } catch (error) {
      console.warn("Invalid iframe src URL:", error);
      return null;
    }
  }

  function getPreviewTokenFromIframeSrc(src) {
    try {
      const iframeUrl = new URL(src);
      return iframeUrl.searchParams.get("preview");
    } catch {
      return null;
    }
  }

  function getSceneLabel(scene, index) {
    const name = scene?.name;
    console.log("Scene name:", scene);
    if (typeof name === "string" && name.trim()) return name;
    if (name && typeof name === "object") {
      const firstTranslation = Object.values(name).find(
        (value) => typeof value === "string" && value.trim(),
      );
      if (firstTranslation) return firstTranslation;
    }
    return `Scene ${index + 1}`;
  }

  function getSceneThumbUrl(scene) {
    const asset = scene?.thumbnailAsset;
    if (!asset) return null;
    return asset.thumbnailUrl || asset.source?.[0]?.url || null;
  }

  function renderSceneButtons(scenes) {
    if (!buttonContainer) return;
    buttonContainer.innerHTML = "";

    scenes.forEach((scene, index) => {
      const card = document.createElement("button");
      card.className = "scene-card";
      card.type = "button";
      card.setAttribute("data-scene", scene.id);

      const thumbUrl = getSceneThumbUrl(scene);
      const label = getSceneLabel(scene, index);

      const mediaWrap = document.createElement("div");
      mediaWrap.className = "scene-card__media";

      if (thumbUrl) {
        const img = document.createElement("img");
        img.src = thumbUrl;
        img.alt = label;
        img.className = "scene-card__thumb";
        img.loading = "lazy";
        mediaWrap.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "scene-card__placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        mediaWrap.appendChild(placeholder);
      }

      const titleEl = document.createElement("span");
      titleEl.className = "scene-card__title";
      titleEl.textContent = label;
      mediaWrap.appendChild(titleEl);

      card.appendChild(mediaWrap);

      buttonContainer.appendChild(card);
    });
  }

  async function fetchStoryScenes(storyId, previewToken) {
    const payload = { storyId };
    if (previewToken) payload.previewToken = previewToken;

    const response = await fetch(`${CYANGO_API_BASE_URL}/story/getStoryJsonById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch story JSON (${response.status})`);
    }

    const data = await response.json();
    const storyJson = data?.content?.storyJson ?? {};
    const scenes = (storyJson.scenes ?? []).filter(
      (s) => s?.id && s?.sceneType !== "PASSWORD_SCENE"
    );
    return { scenes };
  }

  async function initializeDynamicSceneButtons() {
    if (!iframe) return;

    const iframeSrc = iframe.getAttribute("src");
    if (!iframeSrc) return;

    const storyId = getStoryIdFromIframeSrc(iframeSrc);
    if (!storyId) {
      console.warn("Could not extract story ID from iframe src");
      return;
    }

    const previewToken = getPreviewTokenFromIframeSrc(iframeSrc);

    try {
      const { scenes } = await fetchStoryScenes(storyId, previewToken);
      if (!scenes.length) {
        console.warn("No scenes found for story:", storyId);
        return;
      }

      renderSceneButtons(scenes);
      console.log(`Loaded ${scenes.length} scenes dynamically`);
    } catch (error) {
      console.warn("Using fallback static scene buttons:", error);
    }
  }

  if (buttonContainer) {
    buttonContainer.addEventListener("click", (event) => {
      event.preventDefault();
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const card = target.closest(".scene-card");
      if (!(card instanceof HTMLElement)) return;

      const scene = card.getAttribute("data-scene");
      if (!scene) return;

      setActiveButton(scene);
      updateIframeScene(scene);
    });
  }

  if (toggleBtn && sidebar && iframeContainer) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("closed");
      iframeContainer.classList.toggle("full-width");

      // Force a reflow to ensure smooth transition
      void iframeContainer.offsetWidth;
    });
  }

  // Listen for the iframe load event
  if (iframe) {
    iframe.addEventListener("load", () => {
      console.log("Iframe loaded");
    });
  }

  initializeDynamicSceneButtons();
});
