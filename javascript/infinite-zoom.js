// Function to download data to a file
function exportPrompts(cppre,p, cpsuf,np, filename = "infinite-zoom-prompts.json") {

    let J = { prompts: p, negPrompt: np, prePrompt: cppre, postPrompt: cpsuf }

    var file = new Blob([JSON.stringify(J,null,2)], { type: "text/csv" });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function _make_value_source(value) {
    return {value: value, source: "infinite_zoom"};
}

async function iz_get_all_model_info(model_title, res) {
    const checkpoint_titles = [_make_value_source(model_title)];
    const prompts = [
        _make_value_source(res[3]),
        _make_value_source(res[5]),
        _make_value_source(res[6]),
        ...res[4].data.map((item) => _make_value_source(item[1]))
    ];
    return await getAllModelInfoByCheckpointsAndPrompts(checkpoint_titles, prompts);
}

async function iz_submit() {
    addGenerateGtagEvent("#iz_submit_button > span", "#iz_generate_button");
    await tierCheckButtonInternal("InfiniteZoom");

    var id = randomId();
    localStorage.setItem("iz_task_id", id);

    const mainModel = gradioApp().querySelector("#sd_model_checkpoint_dropdown input");

    var res = Array.from(arguments);
    res[0] = id;
    res[1] = `model_title(${mainModel.value})`;
    res[2] = JSON.stringify(await iz_get_all_model_info(mainModel.value, res));

    return res;
}

document.addEventListener("DOMContentLoaded", () => {
    const onload = () => {

        if (typeof gradioApp === "function") {
            /* move big buttons directly under the tabl of prompts as SMall ones */
            const wrap = gradioApp().querySelector("#tab_iz_interface .gradio-dataframe .controls-wrap")

            if (wrap) {
                let butts = gradioApp().querySelectorAll("#tab_iz_interface .infzoom_tab_butt")
                butts.forEach(b => {
                    wrap.appendChild(b)
                    b.classList.replace("lg", "sm") // smallest
                });
            }
            else {
                setTimeout(onload, 2000);
            }
        }
        else {
            setTimeout(onload, 2000);
        }
    };
    onload();
});








