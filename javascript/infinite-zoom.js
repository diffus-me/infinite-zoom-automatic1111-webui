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

async function iz_submit() {
    await tierCheckButtonInternal("InfiniteZoom");

    var id = randomId();
    localStorage.setItem("iz_task_id", id);

    var res = Array.from(arguments);
    res[0] = id;
    const creditsInfoStr= document.querySelector("#iz_submit_button > span");
    if (typeof extractNumberFromGenerateButton === "function" && creditsInfoStr) {
      const credits = extractNumberFromGenerateButton(creditsInfoStr.textContent);
      if (credits && typeof gtag === "function") {
        gtag("event", "spend_virtual_currency", {
          value: credits,
          virtual_currency_name: "credits",
          item_name: "iz_submit_button"
        });
      }
    }
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








