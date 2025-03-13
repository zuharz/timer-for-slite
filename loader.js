(function() {
  'use strict';

  // Configuration
  const timerUrl = 'https://zuharz.github.io/timer-for-slite/';
  const defaultDuration = 300; // 5 minutes default

  // Find all timer elements to initialize
  function initTimers() {
    const timerElements = document.querySelectorAll('.slite-timer');
    
    if (!timerElements || timerElements.length === 0) {
      return;
    }

    timerElements.forEach(function(element) {
      createTimerIframe(element);
    });
  }

  // Create an iframe for each timer
  function createTimerIframe(element) {
    // Get custom settings if provided
    const duration = element.getAttribute('data-duration') || defaultDuration;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.allowTransparency = true;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    
    // Set the source URL with parameters
    iframe.src = `${timerUrl}?embed=true&duration=${duration}`;
    
    // Replace the link with the iframe
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '0';
    container.style.paddingBottom = '25%';
    container.style.overflow = 'hidden';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    
    // Add optional title from the original element
    if (element.title) {
      const title = document.createElement('div');
      title.textContent = element.title;
      title.style.textAlign = 'center';
      title.style.padding = '5px';
      title.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
      title.style.fontSize = '14px';
      title.style.color = '#333';
      container.appendChild(title);
    }
    
    container.appendChild(iframe);
    
    // Replace the element with our container
    if (element.parentNode) {
      element.parentNode.replaceChild(container, element);
    }
  }

  // Handle iframe message events (for communications between iframe and parent)
  function setupMessageHandling() {
    window.addEventListener('message', function(event) {
      // Verify source origin for security
      if (event.origin !== timerUrl) {
        return;
      }
      
      // Handle messages from the timer iframe
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'timerComplete') {
          console.log('Timer completed');
          // You can add custom behavior here when timer completes
        }
      } catch (e) {
        console.error('Error processing message from timer:', e);
      }
    });
  }

  // Initialize when the DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTimers);
    } else {
      initTimers();
    }
    
    setupMessageHandling();
  }

  // Start initialization
  init();
})();
