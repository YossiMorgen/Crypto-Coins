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
    hide("#chartContainer")
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
document.querySelector("aside > button").addEventListener("click", ()=> hide("aside"))

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
    hide(".placeHolder");
    document.querySelector("#container").style.display = "none";
    document.getElementById("about").innerHTML  = `<section id="about">
                <h2>this is a crypto coin project for a college assignment </h2>
                <div>my name is yossi and i built this project as js ajax jquery project</div>
                <div>this project first show ".placeHolder"list of 100 coins toggle button and info button</div>
                <div>with the toggle button you'll be able to choose five coins to get even more information</div>
                <img src="assets/climing.png" alt="">
            </section>` 
}

async function liveReport() {
    let infoArr = getInfo("fiveCoins");
    show("#chartContainer");
    let chartContainer = document.getElementById("chartContainer")
    chartContainer.innerHTML = "";
    console.log(chartContainer);
    if(infoArr.length === 0){
        hide(".placeHolder")
        let h2 = document.createElement("h2")
        h2.innerText = "you need to choose some coins from the home page"
        chartContainer.appendChild(h2)
        h2.addEventListener("click",()=>{
            document.getElementsByTagName("a")[0].click();
            chartContainer.removeChild(h2);
        })

        return;
    }
    show(".placeHolder");
    
    var data = [];
	var chart;
    for(let i = 0; i < infoArr.length; i++){
        try {
            let result = await getData(`https://min-api.cryptocompare.com/data/price?fsym=${infoArr[i][1]}&tsyms=USD&api_key=361e0baeba01d65a81b0c8405542b62e1392156c2c0a565b05fe50d9c8e016ea`);
            if(typeof (result.USD) !=="undefined"){
                data.push({
                    type: "spline",
                    name: infoArr[i][1],
                    showInLegend: true,
                    xValueType: "dateTime",
                    xValueFormatString: "DD MMM hh:mm TT",
                    dataPoints: [{
                    x: new Date().getTime(),
                    y: result.USD,
                    }]
                })
            }
        } catch (error) {
            console.log(error);
        }
    };
    hide(".placeHolder")
    chart = new CanvasJS.Chart("chartContainer",{
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "Coins Live Report"
        },
        subtitles: [{
            text: "Click Legend to Hide or Show Coin Data"
        }],
        axisX: {
            title: "States",
            labelFormatter: function ( e ) {
                return e.value;  
            },
        },
        axisY: {
            title: "Coins's Price",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
        },
        data:   data,
    });

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
        let j = 0;
        let interval = setInterval(async() => {
            for(let i = 0; i < infoArr.length; i++){
                try {
                    for (let i = 0; i < data.length; i++) {
                        let result = await getData(`https://min-api.cryptocompare.com/data/price?fsym=${infoArr[i][1]}&tsyms=USD&api_key=361e0baeba01d65a81b0c8405542b62e1392156c2c0a565b05fe50d9c8e016ea`);
                        console.log(result);
                        if(typeof (result.USD) !=="undefined"){
                            data[i].dataPoints.push({
                                x: new Date().getTime(),
                                y: result.USD,
                            })
                            console.log(data[i]);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                chart.render();
                j ++;
                if(j >= 3){
                    clearInterval(interval);
                }
            }
        }, 3000)
    console.log(data);
}

async function home() {
    document.querySelector("#about").innerHTML = " ";
    let div = document.createElement("div");
    document.querySelector("#container").style.display = "flex";
    let coins = [];
    console.log(coins);
    if(document.querySelector("#container").innerHTML !== " "){ 
        hide(".placeHolder");
        return;
    }
    show(".placeHolder");
    
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
        show(".placeHolder");
        let searchCoins = coins.filter(coin => coin.name.search(inp) != -1);
        document.querySelector("#container").innerHTML = " ";
        creatCoins(searchCoins)
        })
    div.appendChild(search);
    div.appendChild(btn); 

    
    console.log(coins);
    if(coins.length === 0){
        try {
            coins = await getData('https://api.coingecko.com/api/v3/coins/list');
            creatCoins(coins); 
            return;
        } catch (error) {
            console.log(error);
        }
    }
    creatCoins(coins);
}

function creatCoins(data){
    let currentCoins = data.slice(0, 100)
    console.log(currentCoins);
    hide(".placeHolder");
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
        btn.className = "btn-primary";
        btn.classList.add("btn");
        btn.innerText = "More Info";
        let div3 = document.createElement("div");
        div3.className = "hide";

        btn.addEventListener("click", async()=> {
            if(div3.className !== "hide"){
                div3.classList.add("hide");return;
            }
            div3.classList.remove("hide");
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
        div.appendChild(btn);
        div.appendChild(div3);
    })
    let fiveCoins = getInfo("fiveCoins");
    console.log(fiveCoins);
    fiveCoins.forEach(arrCoin => {
        console.log(arrCoin);
        for (const checkCoin of document.getElementsByClassName(arrCoin[0])) {
            console.log(checkCoin);
            if (checkCoin.className === arrCoin[0]) 
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
    console.log(info);
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
    if(typeof (info.eur) === "undefined"){
        console.log("undefined");
        div.innerHTML = `sorry we can't find the info you wanted`
        div.style.color = "red"
        return;
    }
    div.innerHTML = `&euro;${info.eur} &nbsp; &nbsp; &#8362;${info.ils} &nbsp; &nbsp;  &#x24;${info.usd}`
    let img = document.createElement("img")
    img.setAttribute("src", info.image)
    div.appendChild(img);
}

// manage the five coins's list
function fiveCoinsList(input, coin){
    let fiveCoins = getInfo("fiveCoins");
    console.log(fiveCoins);
    if(document.querySelector("aside").className !== "hide"){
        input.checked = !(input.checked); return;
    }
    if(input.checked == true && fiveCoins.find(arrCoin => arrCoin[0] === coin.name) !== -1){
        if(fiveCoins.length > 4){
            input.checked = false;
            showJumpingWindow(fiveCoins, input, coin.symbol); 
            return;
        }
        fiveCoins.push([coin.name, coin.symbol]);
        saveInfo(fiveCoins, "fiveCoins");
        return;
    }
    fiveCoins = fiveCoins.filter(arrCoin => arrCoin[0] !== coin.name); 
    saveInfo(fiveCoins, "fiveCoins");
}

// showing jumping window and create the coins
function showJumpingWindow(fiveCoins, nextBtn, symbol){
    let section = document.querySelector("aside > section");
    section.innerHTML = " ";
    fiveCoins.forEach(coin => {
        let div = document.createElement("div");
        section.appendChild(div);
        let span = document.createElement("span");
        span.innerHTML = coin[0];
        div.appendChild(span);
        let btn = document.createElement("button");
        btn.innerText = "remove";
        btn.addEventListener("click", ()=>{
            nextBtn.checked = "true";
            fiveCoins.push([nextBtn.className, symbol]);
            fiveCoins = fiveCoins.filter(arrCoin => arrCoin[0] !== coin[0]);
            saveInfo(fiveCoins, "fiveCoins")
            console.log(fiveCoins);
            hide("Aside");
            let oldSlider = document.getElementsByClassName(coin[0])[0];
            if(oldSlider){
                oldSlider.checked = false;
            }
        })
        div.appendChild(btn);
    })
    show("aside")
}

// save the update local storage info
function saveInfo(info, name){
    localStorage.setItem(name, JSON.stringify(info));
}

// get the available information in local storage
function getInfo(name){
    return JSON.parse(localStorage.getItem(name) || "[]")
}

// show coin place holder
function show(element){
    document.querySelector(element).classList.remove("hide")
}

// hide coin place holder
function hide(element){
    document.querySelector(element).classList.add("hide")
}

// returning async data for url
async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}



