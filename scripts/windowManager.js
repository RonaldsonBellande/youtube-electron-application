const { app, BrowserWindow } = require('electron');

var isFullScreen = false;
var isEntertainmentStreamingScreen = false;

function toggleFullscreen(state) {
  var window = BrowserWindow.getAllWindows()[0];
  var actualState = window.isFullScreen();
  if (isFullScreen != state || actualState != state) {
    if (state || !isEntertainmentStreamingScreen) {
      window.setFullScreen(state);
      isFullScreen = state;
      console.log("Fullscreen state changed to: " + state);

      if (state) {
        focusWindow();
      }
    }
  }
}

function toggleEntertainmentStreamingMode(state) {
  if (isEntertainmentStreamingScreen != state) {
    isEntertainmentStreamingScreen = state;
    console.log("Entertainment streaming mode state changed to: " + state);
  }

  toggleFullscreen(isEntertainmentStreamingScreen);

  if (state) {
    focusWindow();
  }
}

function switchFullscreenState() {
  if (isFullScreen) {
    toggleFullscreen(false);
  } else {
    toggleFullscreen(true);
  }
}

function focusWindow() {
  BrowserWindow.getAllWindows()[0].focus();
}

app.on('browser-window-created', async function(event, window) {
  window.on("leave-full-screen", async function(event, window) {
    event.preventDefault();
    if (isEntertainmentStreamingScreen) {
      toggleFullscreen(true);
    }
  });
  window.on('page-title-updated', async function(event, title) {
    toggleEntertainmentStreamingMode(title.includes('on Youtube'));
  });
});

module.exports = { toggleFullscreen, switchFullscreenState };
