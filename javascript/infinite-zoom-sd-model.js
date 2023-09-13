function monitorMainModelSelectionInfniteZoom() {
  const sdCheckpointDropdown = gradioApp().querySelector("#sd_model_checkpoint_dropdown");
  const config = { attributes: true, childList: true, subtree: true };

  const updateModelName = () => {
    const mainModel = gradioApp().querySelector("#sd_model_checkpoint_dropdown input");
    const mainModelName = mainModel.value;
    if (mainModelName) {
      const infZoomModel = gradioApp().querySelector("#infzoom_sd_model textarea");
      infZoomModel.value = mainModelName;
      infZoomModel.dispatchEvent(new Event("input"));
    }
  };

  const observer = new MutationObserver(updateModelName);
  observer.observe(sdCheckpointDropdown, config);
}

onUiLoaded(monitorMainModelSelectionInfniteZoom);
