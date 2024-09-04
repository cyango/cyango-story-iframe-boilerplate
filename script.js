document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("storyIframe");
  const buttons = document.querySelectorAll(".scene-button");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const iframeContainer = document.querySelector(".iframe-container");

  let currentScene = "";

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const scene = button.getAttribute("data-scene");
      updateIframeScene(scene);
    });
  });

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    iframeContainer.classList.toggle("full-width");

    // Force a reflow to ensure smooth transition
    void iframeContainer.offsetWidth;
  });

  function updateIframeScene(scene) {
    if (scene === currentScene) return; // Don't update if it's the same scene

    currentScene = scene;
    const baseUrl = "https://192.168.1.67:3001/story/66b9e27cef1caa2311610e92";
    const newUrl = `${baseUrl}?scene=${scene}`;

    // Update the iframe src, but prevent a full reload
    iframe.contentWindow.location.replace(newUrl);
  }

  // Listen for the iframe load event
  iframe.addEventListener("load", () => {
    // Extract the current scene from the iframe URL
    const iframeUrl = new URL(iframe.src);
    currentScene = iframeUrl.searchParams.get("scene") || "";
  });
});
