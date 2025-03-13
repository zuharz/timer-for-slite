/**
 * Countdown Timer Loader for Slite
 * This script handles the embedding of the timer in Slite documents
 */

(function() {
  // Configuration
  const config = {
    timerUrl: "https://zuharz.github.io/timer-for-slite/",
    defaultDuration: 300 // 5 minutes in seconds
  };

  /**
   * Initialize all timer elements on the page
   */
  function initTimers() {
    // Find all timer elements
    const timerElements = document.querySelectorAll(".slite-timer");
    
    // Initialize each timer
    timerElements.forEach(element => {
      createTimerIframe(element);
    });
  }

  /**
   * Create an iframe for a single timer element
   * @param {HTMLElement} element - The container element
   */
  function createTimerIframe(element) {
    // Get timer settings from element attributes
    const duration = element.getAttribute("data-duration") || config.defaultDuration;
    
    // Build URL with parameters
    let timerSrc = `${config.timerUrl}?embed=true&duration=${duration}`;
    
    // Create iframe element
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", timerSrc);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("title", element.getAttribute("title") || "Countdown Timer");
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";
    
    // Add iframe to element
    element.appendChild(iframe);
    
    // Set up message handling for communication with iframe
    setupMessageHandling(iframe, element);
  }

  /**
   * Set up message handling for timer communication
   * @param {HTMLIFrameElement} iframe - The timer iframe
   * @param {HTMLElement} element - The container element
   */
  function setupMessageHandling(iframe, element) {
    window.addEventListener("message", function(event) {
      // Only accept messages from our timer origin
      if (event.origin !== new URL(config.timerUrl).origin) return;
      
      try {
        // Parse the message data
        const data = JSON.parse(event.data);
        
        // Handle timer completion
        if (data.type === "timerComplete") {
          element.dispatchEvent(new CustomEvent("timerComplete"));
          
          // Dispatch a DOM event that Slite can potentially listen for
          const customEvent = new CustomEvent("sliteTimerComplete", {
            bubbles: true,
            detail: { element: element }
          });
          element.dispatchEvent(customEvent);
        }
      } catch (e) {
        console.error("Error processing timer message:", e);
      }
    });
  }

  /**
   * Initialize the timers when DOM is ready
   */
  function init() {
    // If DOM is already ready, initialize immediately
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(initTimers, 1);
    } else {
      // Otherwise wait for DOM to be ready
      document.addEventListener("DOMContentLoaded", initTimers);
    }
  }

  // Initialize the loader
  init();
})();
