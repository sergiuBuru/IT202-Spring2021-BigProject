//Templates
const newsCardTemplate = `<div class="mdc-card__primary-action">
                                <div class="mdc-card__media mdc-card__media--square mdc-card__media--16-9"></div>
                            </div>
                            <div>
                              <strong class="card-title"></strong>
                              <p class="card-description"></p>
                            </div>              
                            <div class="mdc-card__actions mdc-card__actions--full-bleed">
                              <a class="mdc-button mdc-card__action mdc-card__action--button" target="_blank" href="">
                                <div class="mdc-button__ripple"></div>
                                <span class="mdc-button__label">Read article</span>
                              </a>
                          </div>`
const trendingChartTemplate = `<div class="crypto-div-title border-bottom"></div>
                               <div class="crypto-price-grid">
                                 <div class="crypto-usd-price"></div>
                                 <div class="crypto-growth"></div>
                               </div>
                              <div id="curve_chart" class="crypto-curve"></div>`

const selectTemplate = `
                          <div class="mdc-select__anchor"
                              role="button"
                              aria-haspopup="listbox"
                              aria-expanded="false"
                              aria-labelledby="demo-label demo-selected-text">
                            <span class="mdc-select__ripple"></span>
                            <span id="demo-label" class="mdc-floating-label">Pick the crypto</span>
                            <span class="mdc-select__selected-text-container">
                              <span id="demo-selected-text" class="mdc-select__selected-text"></span>
                            </span>
                            <span class="mdc-select__dropdown-icon">
                              <svg
                                  class="mdc-select__dropdown-icon-graphic"
                                  viewBox="7 10 10 5" focusable="false">
                                <polygon
                                    class="mdc-select__dropdown-icon-inactive"
                                    stroke="none"
                                    fill-rule="evenodd"
                                    points="7 10 12 15 17 10">
                                </polygon>
                                <polygon
                                    class="mdc-select__dropdown-icon-active"
                                    stroke="none"
                                    fill-rule="evenodd"
                                    points="7 15 12 10 17 15">
                                </polygon>
                              </svg>
                            </span>
                            <span class="mdc-line-ripple"></span>
                          </div>

                          <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                            <ul class="mdc-list" role="listbox" aria-label="Crypto picker listbox">
                              
                            </ul>
                          </div>`;

const searchbuttonTemplate = `<span class="mdc-button__ripple"></span>
                        <span class="mdc-button__label">Search</span>
                        <span class="mdc-button__touch"></span>`;

const addbuttonTemplate = `<span class="mdc-button__ripple"></span>
                        <span class="mdc-button__label">Add Crypto</span>
                        <span class="mdc-button__touch"></span>`;

const textfieldTemplate = `<span class="mdc-text-field__ripple"></span>
                           <span class="mdc-floating-label" id="my-label-id">Crypto Name</span>
                           <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
                           <span class="mdc-line-ripple"></span>`;

const selectItemTemplate = `  <span class="mdc-list-item__ripple"></span>
                              <span class="mdc-list-item__text"></span>`;

const snackBarTemplate = `<div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                            <div class="mdc-snackbar__label" aria-atomic="false">
                               
                            </div>
                          </div>`;

//HTML ELEMENTS, VARIABLES AND INSTANTIATIONS
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const nav = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('main');
// const drawerScrim = document.querySelector(".mdc-drawer-scrim");
const hamburgerButton = document.querySelector("#nav-burgerbutton");
const drawerAddButton = document.querySelector("#home-button");
const drawerNewsButton = document.querySelector("#news-button");
const drawerTrendingButton = document.querySelector("#trending-button");
const drawerInvestmentsButton = document.querySelector("#investments-button");
const container = document.querySelector(".container");
const barIcon = document.querySelector("#bar-icon");
const newsGrid = document.createElement("div");
newsGrid.classList.add("news-grid");
const screenCover = document.createElement("div");
screenCover.classList.add("screen-cover");
const cryptoForm = document.createElement("div");
cryptoForm.classList.add("crypto-form");
const cryptoFormTextfield = document.createElement("label");
cryptoFormTextfield.classList.add("mdc-text-field","mdc-text-field--filled","crypto-form-textfield");
cryptoFormTextfield.innerHTML = textfieldTemplate;
const cryptoFormSearchbutton = document.createElement("button");
cryptoFormSearchbutton.classList.add("mdc-button", "mdc-button--raised", "crypto-form-searchbutton");
cryptoFormSearchbutton.innerHTML = searchbuttonTemplate;
const cryptoFormSelect = document.createElement("div");
cryptoFormSelect.classList.add("mdc-select", "mdc-select--filled", "demo-width-class");
cryptoFormSelect.innerHTML = selectTemplate;
const selectUL = cryptoFormSelect.querySelector("ul");
const cryptoFormAddbutton = document.createElement("button");
cryptoFormAddbutton.classList.add("mdc-button", "mdc-button--raised", "crypto-form-addbutton");
cryptoFormAddbutton.innerHTML = addbuttonTemplate;
let select, textfield, searchButtonRipple, addButtonRipple;

//GLOBAL VARIABLES
const COINGECKO_TRENDING_URL = "https://api.coingecko.com/api/v3/search/trending";
const LUNARCRUSH_FEED_URL = "https://api.lunarcrush.com/v2?data=feeds&sources=news&key=25wd02gbkx519y03yeha2f";
const COIN_GECKO_COIN_LIST = "https://api.coingecko.com/api/v3/coins/list?include_platform=false";
let cryptoFormInput = "";
let investmentsDB = new Dexie("app_db");
investmentsDB.version(1).stores({
  cryptoNames: "name"
});
let possibleCryptosDB = new Dexie("app_db2");
possibleCryptosDB.version(1).stores ({
  names: "name"
});

//EVENT HANDLERS
hamburgerButton.addEventListener("click", (event) => {
    drawer.open = true;
    hamburgerButton.classList.remove("burger-no-ripple");
});

listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.body.addEventListener('MDCDrawer:closed', () => {
  // mainContentEl.querySelector('input, button').focus();
});

cryptoFormAddbutton.addEventListener("click", (event) => {
  let cryptoSelected;
  //Find the crypto the user selected and store it in the DB
  cryptoSelected = select.selectedText.textContent;
  //Get the id and name of this crypto and store them in the investments DB
  possibleCryptosDB.names.get({name: cryptoSelected})
    .then(obj => {
      investmentsDB.cryptoNames.put({name: obj.name, id: obj.id});
    })
  let snackBar = document.createElement("div");
  snackBar.classList.add("mdc-snackbar");
  snackBar.innerHTML = snackBarTemplate;
  container.appendChild(snackBar);
  const snackbar = new mdc.snackbar.MDCSnackbar(snackBar);
  snackbar.labelText = cryptoSelected + " has been added to your investments page.";
  snackbar.open();
});

cryptoFormSearchbutton.addEventListener("click", (event) => {
  cryptoFormAddbutton.disabled = false;
  removeAllChildNodes(selectUL);
  //Get the input from the textfield
  cryptoFormInput = cryptoFormTextfield.querySelector("input").value;

  //Based on the crypto name input given, find all crypto's whose names are similar
  // to the input
  //Fetch all crypos from the api and match them against the input
  fetch(COIN_GECKO_COIN_LIST)
    .then(response => response.json())
    .then(coins => {
      coins.forEach(coin => {
        //If the strings are 70% or more similar insert them into the select element
        if(stringSimilarity(coin.name, cryptoFormInput) >= 0.7) {
          //Store them in the DB
          possibleCryptosDB.names.put({id: coin.id, name: coin.name});
          const selectItem = document.createElement("li");
          selectItem.classList.add("mdc-list-item");
          selectItem.ariaSelected = "false";
          selectItem.innerHTML = selectItemTemplate;
          selectItem.setAttribute("role", "option");
          selectItem.setAttribute("data-value", coin.name.toLowerCase());
          selectItem.querySelector(".mdc-list-item__text").innerHTML = coin.name;
          selectUL.appendChild(selectItem);
        }
      })
    });
});

drawerAddButton.addEventListener("click", (event) => {
  barIcon.innerHTML = "add";
  hamburgerButton.classList.add("burger-no-ripple");
  removeAllChildNodes(container);
  removeAllChildNodes(selectUL);
  cryptoFormTextfield.querySelector("input").value = "";
  
  //Add the crypto form to the container then append all the elemnts in the form
  container.appendChild(cryptoForm);

  cryptoForm.appendChild(cryptoFormTextfield);
  textField = new mdc.textField.MDCTextField(document.querySelector(".mdc-text-field"));
  
  cryptoForm.appendChild(cryptoFormSearchbutton);
  searchButtonRipple = new mdc.ripple.MDCRipple(document.querySelector(".crypto-form-searchbutton"));

  cryptoForm.appendChild(cryptoFormSelect);
  select = new mdc.select.MDCSelect(document.querySelector(".mdc-select"));

  cryptoFormAddbutton.disabled = true;
  cryptoForm.appendChild(cryptoFormAddbutton);
  addButtonRipple = new mdc.ripple.MDCRipple(document.querySelector(".crypto-form-addbutton"));
});

drawerNewsButton.addEventListener("click", (event) => {
  //Remove all nodes from the container
  removeAllChildNodes(container)
  barIcon.innerHTML = "announcements";
  hamburgerButton.classList.add("burger-no-ripple");
  
  //Fetch crypto,economy,stock news from the API
  fetch(LUNARCRUSH_FEED_URL)
  .then(response => response.json())
  .then(news => {
    container.appendChild(newsGrid);
    let nIndex = 0;
    shuffleArray(news.data);
    for(let i = 1; i < 4; i++) {
      for(let j = 1; j < 3; j++) {
        //Put each pice of news in its own card on the grid
        let card = document.createElement("div");
        let newsObj = news.data[nIndex];
        card.classList.add(`mdc-card`, `news-card`,`news-grid-item${nIndex+1}`);
        card.innerHTML = newsCardTemplate;
        card.querySelector(".mdc-card__media").style.backgroundImage = `url(${newsObj.thumbnail})`;
        card.querySelector(".card-title").innerHTML = newsObj.title;
        card.querySelector(".card-title").classList.add("news-card-title");
        card.querySelector(".card-description").innerHTML = (newsObj.description.length < 160) ? (newsObj.description) : (newsObj.description + "...");
        card.querySelector(".card-description").classList.add("news-card-description");
        card.querySelector(".mdc-card__action--button").href = newsObj.url
        newsGrid.appendChild(card);
        nIndex += 1;
      }
    }
  })
});

drawerTrendingButton.addEventListener("click", (event) => {
  barIcon.innerHTML = "whatshot";
  hamburgerButton.classList.add("burger-no-ripple");
  removeAllChildNodes(container);
  fetch(COINGECKO_TRENDING_URL)
    .then(response => response.json())
    .then(trendingCryptos => {
      trendingCryptos.coins.forEach(crypto => {
        //For each trending coin fetch the price over the last 14 days\
        let days;
        let interval = (window.innerWidth < 700) ? ("hourly") : ("daily");
        
        if(window.innerWidth < 700) {
          days = 7;
          interval = "daily";
        } else {
          days = 14;
          interval = "hourly";
        }
        fetch(`https://api.coingecko.com/api/v3/coins/${crypto.item.id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`)
          .then(response => response.json())
          .then(data => {
            if(data.prices.length < (days - 1)) { return;}
            drawChart(data.prices, crypto.item);
          })

      });
    })
});

drawerInvestmentsButton.addEventListener("click", (event) => {
  barIcon.innerHTML = "timeline";
  hamburgerButton.classList.add("burger-no-ripple");
  removeAllChildNodes(container);
  
  //Go through all coins in the DB and display each on a graph
  investmentsDB.cryptoNames.each( crypto => {
    let days;
    let interval;
    
    if(window.innerWidth < 700) {
      days = 7;
      interval = "daily";
    } else {
      days = 14;
      interval = "hourly";
    }
    fetch(`https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`)
      .then(response => response.json())
      .then(data => {
        fetch(`https://api.coingecko.com/api/v3/coins/${crypto.id}?localization=false`)
          .then(response => response.json())
          .then(coin => {
            drawChart(data.prices, coin);
          })
      })
  })


});


window.addEventListener('deviceorientation', (event) => {
  console.log(event.gamma);
  if(event.gamma >= 30) {
    drawer.open = true;
  }
}, true);

screenCover.addEventListener("click", (event) => {
  document.body.removeChild(screenCover);
})

//When the page laods on the news screen, display the news
document.addEventListener("DOMContentLoaded", (event) => {
  //Fetch crypto,economy,stock news from the API
  fetch(LUNARCRUSH_FEED_URL)
  .then(response => response.json())
  .then(news => {
    container.appendChild(newsGrid);
    let nIndex = 0;
    shuffleArray(news.data);
    for(let i = 1; i < 4; i++) {
      for(let j = 1; j < 3; j++) {
        //Put each pice of news in its own card on the grid
        let card = document.createElement("div");
        let newsObj = news.data[nIndex];
        card.classList.add(`mdc-card`, `news-card`,`news-grid-item${nIndex+1}`);
        card.innerHTML = newsCardTemplate;
        card.querySelector(".mdc-card__media").style.backgroundImage = `url(${newsObj.thumbnail})`;
        card.querySelector(".card-title").innerHTML = newsObj.title;
        card.querySelector(".card-title").classList.add("news-card-title");
        card.querySelector(".card-description").innerHTML = (newsObj.description.length < 160) ? (newsObj.description) : (newsObj.description + "...");
        card.querySelector(".card-description").classList.add("news-card-description");
        card.querySelector(".mdc-card__action--button").href = newsObj.url
        newsGrid.appendChild(card);
        nIndex += 1;
      }
    }
  })
});


//HELPER FUNCTIONS
//Credit: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
const removeAllChildNodes = function(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
//Credit: https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
const shuffleArray = function(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function drawChart(coinPrices, coin) {
  //Create the chart div element for each crypto
  let chartDiv = document.createElement("div");
  chartDiv.classList.add("crypto-div");
  chartDiv.innerHTML = trendingChartTemplate;
  chartDiv.querySelector(".crypto-div-title").innerHTML = `${coin.name} (${coin.symbol})`;
  let currentPrice = coinPrices[coinPrices.length-1][1];
  let firstPrice = coinPrices[0][1];
  let change = ((currentPrice - firstPrice) / firstPrice) * 100;
  chartDiv.querySelector(".crypto-usd-price").innerHTML = `$${currentPrice.toFixed(2)} USD`;
  chartDiv.querySelector(".crypto-growth").innerHTML = `${change.toFixed(2)}%`;
  let color = (change < 0) ? ("price-decrease") : ("price-increase");
  chartDiv.querySelector(".crypto-growth").classList.add(color);  
  container.appendChild(chartDiv);

  let dataArray = [
    ['Date', 'Price'],
  ]
  coinPrices.forEach(price => {
    dataArray.push([formatDate(price[0]), price[1]])
  });

  console.log("");

  let options = {
    // width: chartDiv.offsetWidth,
    // height: .7 * chartDiv.offsetHeight,
    color: '#000000',
    chartArea: {backgroundColor: 'white'},
    chartArea: {
                width: '80%', 
                height: '80%'
               },
    legend: { position: 'bottom' }
  };

  let chart = new google.visualization.LineChart(chartDiv.querySelector("#curve_chart"));

  let data = google.visualization.arrayToDataTable(dataArray);
  chart.draw(data, options);
}

//Given a unix timestamp output the date in "Month day year format"
const formatDate = function(timestamp) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let d = new Date(timestamp);
  let day = d.getDate();
  let month = months[d.getMonth()]
  return month + " " + day;
}

//Credit: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
//Function that computes similarity percentage between two strings
const stringSimilarity = function(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
//------------