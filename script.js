"use strict";
const url = new URL(window.location);
moveTo(url.hash);
window.addEventListener('popstate', e => moveTo(e.state.target))
let container = document.getElementById("container");

function navTo(el) {
    event.preventDefault();
    const target = el.dataset.target;
    moveTo(target);
    document.querySelectorAll('nav > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
    history.pushState({ target: target }, 'target', target);
}

function moveTo(target) {
    document.querySelector("#container").style.display = "none";
    document.querySelector("#about").innerHTML = " ";
    app.innerHTML = nav();
    let html;
    switch (target) {
        case '#home': home(); break;
        case '#about': html =  about(); break;
        case '#liveReport': html = liveReport(); break;
        default: html = home(); break;
    }
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
    hide();   
    document.querySelector("#container").style.display = "none";
    document.getElementById("about").innerHTML  = `<section id="about">
                <h2>this is a crypto coin project for a college assignment </h2>
                <div>my name is yossi and i built this project as js ajax jquery project</div>
                <div>this project first show list of 100 coins toggle button and info button</div>
                <div>with the toggle button you'll be able to choose five coins to get even more information</div>
                <img src="assets/climing.png" alt="">
            </section>` 
}

function liveReport() {
    document.querySelector("#about").innerHTML = " ";
    document.querySelector("#container").style.display = "none";
    show();
    // document.getElementById("container").innerHTML = ` <div id="chartContainer"></div>`
    
    // https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=INSERT-
}

async function home() {
    document.querySelector("#about").innerHTML = " ";
    let div = document.createElement("div");
    div.id = "search";
    document.getElementById("mainHead").appendChild(div);
    let search = document.createElement("input");
    search.type = "search";
    let btn = document.createElement("button");
    btn.innerText = "search";
    search.addEventListener("change", ()=>{
        if(document.querySelector("input").value == ""){
            document.querySelector("#container").innerHTML = " ";
            creatCoins(coins);
        }
    })

    btn.addEventListener("click", ()=>{
        let inp = $("input").val();
        if(inp.length < 2) {
            alert("Too Short");
            return;
        }
        show();
        let searchCoins = coins.filter(coin => coin.name.search(inp) != -1);
        document.querySelector("#container").innerHTML = " ";
        creatCoins(searchCoins)
        })
    div.appendChild(search);
    div.appendChild(btn); 

    document.querySelector("#container").style.display = "flex";
    let coins = [];
    console.log(coins);
    if(document.querySelector("#container").innerHTML !== " "){
        hide();
        return;
    }
    show();
    
    console.log(coins);
    if(coins.length === 0){
        try {
            coins = await getData('https://api.coingecko.com/api/v3/coins/list')        
            creatCoins(coins); return;
        } catch (error) {
            console.log(error);
        }
    }
    creatCoins(coins);
}

function creatCoins(data){
    let currentCoins = data.slice(0, 100)
    console.log(currentCoins);
    hide()
    currentCoins.forEach(coin => {
        let div = document.createElement("div");
        div.classList.add("coin");
        container.appendChild(div);

        let span = document.createElement("span");
        span.innerText = coin.name;
        div.appendChild(span);

        let label = document.createElement("label");
        label.className = "switch";
        div.appendChild(label);

        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = coin.name;
        label.appendChild(input);

        let span2 = document.createElement("span");
        span2.className = "slider";
        label.appendChild(span2);

        label.addEventListener("change", () => fiveCoinsList(input, coin));        
        let div2 = document.createElement("div");
        div2.innerText = coin.symbol;
        div.appendChild(div2);

        let btn = document.createElement("button");
        // btn.type = "button"
        btn.className = "btn-primary";
        btn.classList.add("btn");
        btn.innerText = "More Info";
        let div3 = document.createElement("div");
        div3.className = "hide";

        // 
        btn.addEventListener("click", async()=> {
            // div3.classList.toggle("hide");
            if(div3.className !== "hide"){
                div3.classList.add("hide");return;
            }
            div3.classList.remove("hide")
            if(div3.innerHTML == ""){
                let placeHolder = document.createElement("img");
                placeHolder.className = "smlPlaceHolder";
                placeHolder.setAttribute("src", "assets/bitcoin.png");
                div3.appendChild(placeHolder);

                let coinsInfo = getInfo("coinsInfo");
                let info  = coinsInfo.find(coinInfo => coinInfo.id == coin.name);
                console.log(info);
                if(info){
                    if((new Date().toString().slice(0, 21)) === info.time && new Date().getMinutes() -  info.minuts <= 2){
                        showInfo(info, div3);
                        return;
                    }
                    coinsInfo = coinsInfo.filter(coinInfo => coinInfo.id !== coin.name);
                    saveInfo(coinsInfo, "coinsInfo");
                }
                addInfo(div3, coin.id);
            }
        })
        // 


        div.appendChild(btn);
        div.appendChild(div3);
    })
    let fiveCoins = getInfo("fiveCoins");
    console.log(fiveCoins);
    fiveCoins.forEach(arrCoin => {
        console.log(arrCoin);
        for (const checkCoin of document.getElementsByClassName(arrCoin)) {
            console.log(checkCoin);
            if (checkCoin.className === arrCoin) 
                checkCoin.checked = "true";
            }
        console.log(arrCoin);
    })
}

// edit coins's information list
async function addInfo(div, coin){
    let info;
    try {
        info = await getData(`https://api.coingecko.com/api/v3/coins/${coin}`)     
    } catch (error) {
        console.log(error);
    }
    let infoArray = getInfo(`coinsInfo`);
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
    saveInfo(infoArray, `coinsInfo`);
    showInfo(information, div)
}

// show the coin's information on the collapse div
function showInfo(info, div){   
    div.innerHTML = `&euro;${info.eur} &nbsp; &nbsp; &#8362;${info.ils} &nbsp; &nbsp;  &#x24;${info.usd}`
    let img = document.createElement("img")
    img.setAttribute("src", info.image)
    div.appendChild(img);
}

function fiveCoinsList(input, coin){
    let fiveCoins = getInfo("fiveCoins");
    console.log(fiveCoins);
    if(document.querySelector("aside").className !== "hide"){
        input.checked = !(input.checked); return;
    }
    if(input.checked == true && fiveCoins.find(arrCoin => arrCoin === coin.name) !== -1){
        if(fiveCoins.length > 4){
            input.checked = false;
            showJumpingWindow(fiveCoins, input); 
            console.log(fiveCoins);
            return;
        }
        fiveCoins.push(coin.name);
        saveInfo(fiveCoins, "fiveCoins") 
        console.log(fiveCoins);
        return;
    }
    console.log(coin.name);
    fiveCoins = fiveCoins.filter(arrCoin => arrCoin !== coin.name); 
    saveInfo(fiveCoins, "fiveCoins");
    console.log(fiveCoins);
}

// showing jumping window and create the coins
function showJumpingWindow(fiveCoins, nextBtn){
    let section = document.querySelector("aside > section");
    section.innerHTML = " ";
    fiveCoins.forEach(coin => {
        let div = document.createElement("div");
        section.appendChild(div);
        let span = document.createElement("span");
        span.innerHTML = coin;
        div.appendChild(span);
        let btn = document.createElement("button");
        btn.innerText = "remove";
        btn.addEventListener("click", ()=>{
            nextBtn.checked = "true";
            fiveCoins.push(nextBtn.className);
            fiveCoins = fiveCoins.filter(arrCoin => arrCoin !== coin);
            saveInfo(fiveCoins, "fiveCoins")
            console.log(fiveCoins);
            hideAside();
            document.getElementsByClassName(coin)[0].checked = false;
        })
        div.appendChild(btn);
    })
    document.querySelector("aside").classList.remove("hide");
}

// save the update coins's information
function saveInfo(info, name){
    localStorage.setItem(name, JSON.stringify(info));
}

// get the available information about the coins 
function getInfo(name){
    return JSON.parse(localStorage.getItem(name) || "[]")
}

// hide the jumping window
function hide(){
    document.querySelector("aside").classList.add("hide")
}

// show coin place holder
function show(){
    document.querySelector(".placeHolder").classList.remove("hide")
}

// show coin place holder
function hide(){
    document.querySelector(".placeHolder").classList.add("hide")
}

async function getData(url) {
    console.log(url);
    const response = await fetch(url);
    return await response.json();
}



