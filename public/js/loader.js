loadPage();

function loadPageAnimation(){
    return new Promise(resolve => {
        setTimeout(() => {
            document.getElementsByTagName("body")[0].setAttribute("class", "loaded");
        }, 1200);
    })
}

async function loadPage(){
    await loadPageAnimation();
}
