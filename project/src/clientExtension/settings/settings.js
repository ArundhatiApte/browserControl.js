"use strict";

const settings = require("./../common/settings.js"),
      domSaveButton = document.querySelector("input[type='button']"),
      domPortInput =  document.querySelector("input[type='text']");
      
domSaveButton.onclick = function() {
  const portRaw = domPortInput.value,
        port = parseInt(portRaw);
  if (!isNaN(port)) {
    settings.setControlPort(port);
  }
};

(async function showPort() {
  const port = await settings.getControlPort();
  domPortInput.value = port;
})();
