document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("storyIframe");
  const buttons = document.querySelectorAll(".scene-button");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const iframeContainer = document.querySelector(".iframe-container");

  function sendMessageToIframe(data) {
    console.log("Sending message to iframe:", data);
    iframe.contentWindow.postMessage(JSON.stringify(data), "*");
  }

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
    sendMessageToIframe({ action: "GO_TO_SCENE", sceneId: scene });
  }

  // Listen for the iframe load event
  iframe.addEventListener("load", () => {
    // You might want to send an initial message or perform any setup here
    console.log("Iframe loaded");
  });
});
