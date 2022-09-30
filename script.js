let fiveCoins = [];
hideAside();
let coins = [];
$.ajax({
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: data => {
        coins = data.slice(0, 100);
        creatCoins(coins);
    },
    error: err => console.log(err)
});

function creatCoins(data){
    $("#container").html("")
    let html = "";
    data.forEach(coin => {
        // console.log(coin.name.replace(/./g,'').replace(/ /g,''));
        html += (`
        <div class="coin">
            <span>${coin.name}</span>
            <label onchange="chartList(this)" class="switch">
                <input id="${coin.name}" type="checkbox">
                <span class="slider"></span>
            </label>

            <div>${coin.symbol}</div>

            <button id="${coin.id}" onclick="findInfo(this)" class="btn btn-primary" type="button">more info</button>
        </div>`)
    });
    $("#container").html(html);
}


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

function showJumpingWindow(){
    let html = ""
    fiveCoins.forEach(coin => {        
        html += `<div><span>${coin}</span><button onclick="DeleteFromFiveCoins(this)">remove</button></div>`
    })
    $("aside").show(500).children("section").html(html)
}
function DeleteFromFiveCoins(btn){
    let id = $(btn).siblings("span").text();
    fiveCoins = fiveCoins.filter(coin => coin !== id);
    hideAside();
    document.getElementById(id).checked = false;
    // $(`#${id}`).children("input").prop('checked', false);
    console.log(fiveCoins);
}
// (()=>{
// })()

// function search(){
//     let inp = $("input").val();
//     if(inp.length < 2) {
//         console.log("Too Short");
//         return;
//     }    
//     let searchData = coins.filter(coin => )
//     console.log(searchData);
//     ShowResults(searchData)
// }


// find the faster and trutworthy way to get information about the coin
function findInfo(btn) {
    if(!$(btn).next().length){
        $(btn).parent().append("<div>").children("button + div").addClass(`${btn.id}div`).html($('<img>',{class:'smlPlaceHolder',src:'bitcoin.png'})).hide().slideDown(300)
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
    get_data(`https://api.coingecko.com/api/v3/coins/${btn.id}`, addInfo);
}

// edit coins's information list
function addInfo(info){
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

// get api data with call back
function get_data(api, call_back){
    $.ajax({
        url: api,
        success: data => call_back(data),
        error: err => console.log(err)
    })
}

// show the coin's information on the collapse div
function showInfo(info){
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







// $("#container").append("<div>").children().addClass("coin")
// .html("<span>").children().text(coin.name).parent()
// .append("<label>").children("label").addClass("switch").html("<input>").children().attr('type','checkbox').parent()
// .append("<span>").children("span").addClass("slider").parent().parent()
// .append("<div>").text()

// console.log(coins)
// let coin = document.createElement("div");
// coin.classList.add("coin");
// let container = document.querySelector("#container").appendChild(coin);