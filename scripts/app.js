const VERSION = "1.0.0"
var bitcoins = 0
var bitcoinRate = 0

// Every item in the game
var items = [
  {
    "name": "item_oldCalculator"
  },
  {
    "name": "item_oldCpu"
  },
  {
    "name": "item_oldComputerFromGrandpa"
  },
  {
    "name": "item_rapsberrypy"
  },
  {
    "name": "item_smartphone"
  },
  {
    "name": "item_middleClassPC"
  },
  {
    "name": "item_cheapServer"
  },
  {
    "name": "item_gamingPC"
  },
  {
    "name": "item_cheapMiner"
  },
  {
    "name": "item_highEndUltraPC"
  },
  {
    "name": "item_newGoodMiner"
  },
  {
    "name": "item_bigMiner"
  },
  {
    "name": "item_miningFarm"
  },
  {
    "name": "item_nasaPC"
  },
  {
    "name": "item_quantumRig"
  },
  {
    "name": "item_miningFarmSpace"
  },
  {
    "name": "item_miningFarmMoon"
  },
  {
    "name": "item_bitcoinTimeMachine"
  },
  {
    "name": "item_blackHolePoweredMiner"
  }
]

var bSec = null;

localStorage.setItem("bitcoins", "0");

if(localStorage.getItem("bitcoins") === null){
  // Bitcoins are 0
  bitcoins = 0

  // Set the localStorage Item for the first time
  localStorage.setItem("bitcoins", "0");

  // Write the current amount of Bitcoins on the page
  $(".bitcoinAmount").text(bitcoins.toFixed(8))

}else{

  // Get the amount of Bitcoins and parse them to a float number
  bitcoins = parseFloat(localStorage.getItem("bitcoins"))

  // Set the text on the page
  // Rounding the number at specific values
  if(bitcoins >= 1000){
    $(".bitcoinAmount").text(bitcoins.toFixed(0))
  }else if(bitcoins >= 1){
    $(".bitcoinAmount").text(bitcoins.toFixed(2))
  }else{
    $(".bitcoinAmount").text(bitcoins.toFixed(8))
  }
  $(".satoshiAmount").text(Math.round(bitcoins * 100000000))

}

// Calculates the Bitcoin/sec rate with the amount of every item multiplied with their given Bitcoins/second rate.
setBitcoinPerSecondRateAtBeginning()

// Stating the interval with the calculated Bitcoin/second rate.
bSec = setInterval(function () {
  bSecFunction(bitcoinRate);
}, 1000)

$(document).ready(function () {

  // Write the version into the .version span element
  $(".version").text("Version " + VERSION)

  // Write the bitcoin per second rate into the .bSecRateNumber span element
  if(bitcoinRate >= 1000){
    $(".bSecRateNumber").text(bitcoinRate.toFixed(0))
  }else if(bitcoinRate >= 1 ){
    $(".bSecRateNumber").text(bitcoinRate.toFixed(2))
  }else{
    $(".bSecRateNumber").text(bitcoinRate.toFixed(8))
  }


  // If clicked on the big Bitcoin
  $(".bitcoin").click(function () {

    // Add 1^-8 Bitcoins (equal to 1 satoshi)
    bitcoins = bitcoins + 0.00000001

    // Show the new number on the page
    if(bitcoins >= 1000){
      $(".bitcoinAmount").text(bitcoins.toFixed(0))
    }else if(bitcoins >= 1){
      $(".bitcoinAmount").text(bitcoins.toFixed(2))
    }else{
      $(".bitcoinAmount").text(bitcoins.toFixed(8))
    }
    $(".satoshiAmount").text(Math.round(bitcoins * 100000000))

    // Save the new amount of Bitcoins in the localStorage storage
    localStorage.setItem("bitcoins", "" + bitcoins + "")

  });


  // If any item from the list was clicked...
  $(".purchaseItem").click(function () {

    // Get following attributes and children elements
    var id = $(this).attr("id")
    var price = parseFloat($(this).attr("data-price"))
    var bitcoinsPerSecond = parseFloat($(this).attr("data-bits-per-sec"))
    var amountDisplay = $(this).children()[0]
    var amountDisplayAmount = parseInt(amountDisplay.textContent)

    // If you have enough Bitcoins, it´ll buy one item
    if(bitcoins >= price){

      // Substract the price from the current Bitcoin number and set it to the bitcoins variable.
      bitcoins = bitcoins - price

      // Save the new amount of Bitcoins in the localStorage storage
      localStorage.setItem("bitcoins", "" + bitcoins + "")

      // Changing amount number on the right of the item
      amountDisplayAmount = amountDisplayAmount + 1
      amountDisplay.textContent = amountDisplayAmount.toString()

      // Changing the Bitcoins amount
      // Rounding the Bitcoin number at specific values
      if(bitcoins >= 1000){
        $(".bitcoinAmount").text(bitcoins.toFixed(0))
      }else if(bitcoins >= 1){
        $(".bitcoinAmount").text(bitcoins.toFixed(2))
      }else{
        $(".bitcoinAmount").text(bitcoins.toFixed(8))
      }

      // Calculation the Satoshi amount
      $(".satoshiAmount").text(Math.round(bitcoins * 100000000))

      // Increasing the amount of the specific item
      itemAction(id)

      // Stops the interval
      stopBsec()

      // Saving the new calculated Bitcoin/second rate in a variable
      var newRate = setNewBitcoinRate(bitcoinsPerSecond)

      // Restarting the interval with the new rate
      bSec = setInterval(function () {
        bSecFunction(newRate);
      }, 1000)

    }

  })

});

/**
 * Function to increase the amount of the item (in the localStorage) with the specific identifier.
 *
 * @param id - The identifier of the item (the id from the list element)
 */
function itemAction(id) {

  var item = id
  var itemAmount = 0;

  if(localStorage.getItem(item) === null){
    localStorage.setItem(item, "1");
  }else{
    itemAmount = parseInt(localStorage.getItem(item))

    localStorage.setItem(item, "" + (itemAmount + 1) + "");

  }

}

/**
 * Calculating the Bitcoins per Second - rate when the page was opened.
 *
 */
function setBitcoinPerSecondRateAtBeginning () {

  for(var i = 0; i < items.length; i++){
    if(localStorage.getItem(items[i].name) === null){
      localStorage.setItem(items[i].name, "0")
    }else{
      $("#" + items[i].name).children()[0].textContent = localStorage.getItem(items[i].name)

      var bits_per_sec = $("#" + items[i].name).attr("data-bits-per-sec")
      var amountOfItem = parseInt(localStorage.getItem(items[i].name))

      var before = bitcoinRate

      bitcoinRate = bitcoinRate + (amountOfItem * bits_per_sec)
      console.log("i = " + i + " | B/sec before: " + before.toFixed(8) +
        " - Calculation made: " + before.toFixed(8) + " + (" + amountOfItem + " * " + bits_per_sec + ") = " +  bitcoinRate.toFixed(8) +
        " | New B/sec at " + bitcoinRate.toFixed(8))
    }
  }

}

/**
 * Function which sets a new "Bitcoin per Second" rate
 *
 * @param rate - The number which must be added to the current Bitcoin per Second - rate
 * @returns {Number} - Returning the new Bitcoin per Second - rate
 */
function setNewBitcoinRate (rate) {

  // Logging the new Bitcoin per second rate
  console.log("setNewBitcoinRate -> New rate: " + (bitcoinRate + rate).toFixed(8) )

  // Showing the new rate on the page
  // Rounding at specific values
  if((bitcoinRate + rate) >= 1000){
    $(".bSecRateNumber").text((bitcoinRate + rate).toFixed(0))
  }else if((bitcoinRate + rate) >= 1 ){
    $(".bSecRateNumber").text((bitcoinRate + rate).toFixed(2))
  }else{
    $(".bSecRateNumber").text((bitcoinRate + rate).toFixed(8))
  }

  // Returning the new rate
  return bitcoinRate = bitcoinRate + rate;

}

/**
 * The function which adds new generated Bitcoins to the current Bitcoin amount.
 *
 * @param rate - The Bitcoin per second rate; Needed for adding the generated Bitcoins every second
 */
function bSecFunction (rate) {

  bitcoins = bitcoins + rate

  // Show both values on the page
  // Rounding the bitcoin number at specific set values
  if(bitcoins >= 1000){
    $(".bitcoinAmount").text(bitcoins.toFixed(0))
  }else if(bitcoins >= 1){
    $(".bitcoinAmount").text(bitcoins.toFixed(2))
  }else{
    $(".bitcoinAmount").text(bitcoins.toFixed(8))
  }
  $(".satoshiAmount").text(Math.round(bitcoins * 100000000))

  // Save bitcoin amount in the storage
  localStorage.setItem("bitcoins", "" + bitcoins + "")

  console.log("bSec -> B/sec at " + rate.toFixed(8))

}

/**
 * Stops the B/sec interval.
 */
function stopBsec () {
  clearInterval(bSec)
}



