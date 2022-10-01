const url = new URL(window.location);
moveTo(url.hash);
let fiveCoins = [];
let coins = [];
hideAside();
window.addEventListener('popstate', e => moveTo(e.state.target))
let container = document.getElementById("container");

function navTo(el) {
    event.preventDefault();
    // createPlacecHolder()
    const target = el.dataset.target;
    moveTo(target);
    document.querySelectorAll('nav > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
    history.pushState({ target: target }, 'target', target);
}




function moveTo(target) {
    createPlacecHolder();
    app.innerHTML = nav();
    let html;
    switch (target) {
        case '#home': home(); break;
        case '#about': html =  about(); break;
        case '#liveReport': html = liveReport(); break;
        default: html = home(); break;
    }
    // document.getElementById("container").innerHTML = html
}

function nav() {
    return `
        <section id="mainHead">
            <nav>
                <a onclick="navTo(this)" class="${url.hash == '#home' && 'active'}" data-target='#home' href="">Home</a>
                <a onclick="navTo(this)" class="${url.hash == '#about' && 'active'}" data-target='#about' href="#about">About</a>
                <a onclick="navTo(this)" class="${url.hash == '#liveReport' && 'active'}" data-target='#liveReport' href="#liveReport">Live Report</a>
            </nav>
        </section>
        `;
}

function about() {
    document.getElementById("container").innerHTML  = `<section id="about">
                <h2>this is a crypto coin project for a college assignment </h2>
                <div>my name is yossi and i built this project as js ajax jquery project</div>
                <div>this project first show list of 100 coins toggle button and info button</div>
                <div>with the toggle button you'll be able to choose five coins to get even more information</div>
                <img src="assets/climing.png" alt="">
            </section>` 
}

function liveReport() {
    // <link rel="icon" type="image/png" href="http://example.com/image.png" />
}

async function home() {
    let div = document.createElement("div")
    div.id = "search"
    document.getElementById("mainHead").appendChild(div)
    let search = document.createElement("input")
    search.type = "search"
    let btn = document.createElement("button")
    btn.innerText = "search";
    search.addEventListener("change", ()=>{
        console.log($("input").val());
        if($("input").val() == ""){
            createPlacecHolder();
            creatCoins(coins)
        }
    })
    btn.addEventListener("click", ()=>{
        let inp = $("input").val();
        if(inp.length < 2) {
            alert("Too Short");
            return;
        }    
        createPlacecHolder();
        let searchCoins = coins.filter(coin => coin.name.search(inp) != -1);
        creatCoins(searchCoins)
    })
    div.appendChild(search)
    div.appendChild(btn)
    
    // $("#mainHead").append(`<div id="search">
    //         <input type="search">
    //         <button onclick="search()">search</button>
    //     </div>`)

    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const data = await response.json();
    coins = data.slice(0, 100)

    creatCoins(coins)    
}

function creatCoins(currentCoins){
    let html = ``
    currentCoins.forEach(coin => {
        html += `
        <div class="coin">
            <span>${coin.name}</span>
            <label onchange="chartList(this)" class="switch">
                <input id="${coin.name}" type="checkbox">
                <span class="slider"></span>
            </label>

            <div>${coin.symbol}</div>

            <button id="${coin.id}" onclick="findInfo(this)" class="btn btn-primary" type="button">more info</button>
        </div>`
    });
    container.innerHTML = html;
}

// add or dalete from the coins list
function chartList(slider){
    const id = $(slider).children("input").attr('id');
    if((fiveCoins.findIndex(coin => coin === id)) === -1){
        if(fiveCoins.length >= 5){
            $(slider).children("input").prop('checked', false);
            showJumpingWindow(); return;
        }
        fiveCoins.push(id);
    }else{
        fiveCoins = fiveCoins.filter(coin => coin !== id);
    }
    console.log(fiveCoins);
}

// showing jumping window and create the coins
function showJumpingWindow(){
    let html = ""
    fiveCoins.forEach(coin => {        
        html += `<div><span>${coin}</span><button onclick="DeleteCoinJumpingWindow(this)">remove</button></div>`
    })
    $("aside").show(500).children("section").html(html)
}

// delete the coin the user chose on the jumping window from the list
function DeleteCoinJumpingWindow(btn){
    let id = $(btn).siblings("span").text();
    fiveCoins = fiveCoins.filter(coin => coin !== id);
    hideAside();
    document.getElementById(id).checked = false;
}

// (()=>{
// })()

// find the faster and trutworthy way to get information about the coin
function findInfo(btn) {
    if(!$(btn).next().length){
        $(btn).parent().append("<div>").children("button + div").addClass(`${btn.id}div`).html($('<img>',{class:'smlPlaceHolder',src:'assets/bitcoin.png'})).hide().slideDown(300)
    }else{
        $(btn).next().remove(); return;
    }

    info = getInfo();
    const newInfo = info.find(element => element.id === btn.id);
    if(newInfo){
        if(newInfo.time == new Date().toString().slice(0, 21) && (new Date().getMinutes() -  newInfo.minuts) < 2){
            showInfo(newInfo); return;
        }else{
            info = info.filter(element => element.id != btn.id);
        }
    }
    saveInfo(info)
    // get_data(`btn.id`, addInfo);
    fetch(`https://api.coingecko.com/api/v3/coins/${btn.id}`)
        .then((response) => response.json())
        .then((data) => addInfo(data));
}

// edit coins's information list
function addInfo(info){
    console.log(info);

    let infoArray = getInfo(); 
    const information = {
        "time": new Date().toString().slice(0, 21),
        "minuts": new Date().getMinutes(),
        "id": info.id,
        "image": info.image.small, 
        "usd": info.market_data.current_price.usd,
        "eur": info.market_data.current_price.eur,
        "ils": info.market_data.current_price.ils
    }
    infoArray.push(information);
    saveInfo(infoArray);
    showInfo(information)
} 

// show the coin's information on the collapse div
function showInfo(info){
    if(info.eur === undefined){
        $(`.${info.id}div`).html(`sorry but we don't have any information about this coin`).css("background-image", `url("${info.image}")`).css("color", `red`)
        return;
    }
    $(`.${info.id}div`).html(`&euro;${info.eur} &nbsp; &nbsp; &#8362;${info.ils} &nbsp; &nbsp;  &#x24;${info.usd}`).css("background-image", `url("${info.image}")`)
}

// save the update coins's information
function saveInfo(info){
    localStorage.setItem(`coinsInfo`, JSON.stringify(info));
}

// get the available information about the coins 
function getInfo(){
    return JSON.parse(localStorage.getItem(`coinsInfo`) || "[]")
}

// hide the jumping window
function hideAside(){
    $("aside").hide();
}

// creat coin place holder
function createPlacecHolder(){
    var img = document.createElement('img');
    img.src = "assets/bitcoin.png"
    img.classList.add("placeHolder")
    let container = document.getElementById("container");
    container.innerHTML = ""
    container.appendChild(img);
}





// $("#container").append("<div>").children().addClass("coin")
// .html("<span>").children().text(coin.name).parent()
// .append("<label>").children("label").addClass("switch").html("<input>").children().attr('type','checkbox').parent()
// .append("<span>").children("span").addClass("slider").parent().parent()
// .append("<div>").text()

// console.log(coins)
// let coin = document.createElement("div");
// coin.classList.add("coin");
// let container = document.querySelector("#container").appendChild(coin);