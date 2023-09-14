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

onUiLoaded(() => {
  monitorMainModelSelectionInfniteZoom();
  systemMonitorState["tab_iz_interface"] = {
    generate_button_id: "iz_submit_button",
    timeout_id: null,
    functions: {
      "extensions.infinite_zoom": {
        params: {
          'steps': 35,
          'n_iter': 1,
          'batch_size': 5,
          "width": 512,
          "height": 512,
        },
        link_params: {}, // tab_name: function_name
        mutipliers: {}, // multipler_name: value
        link_mutipliers: {}, // function_name: param_name
      }
    }
  };
});
