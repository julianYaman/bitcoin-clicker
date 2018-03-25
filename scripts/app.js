var bitcoins = 0
var bitcoinRate = 0

var GameConst = {
  "priceMultiplier": 1.15,
  "VERSION": "1.1.0"
}

// Every item in the game
var items = [
  {
    "name": "item_oldCalculator",
    "price": "0.0000001"
  },
  {
    "name": "item_oldCpu",
    "price": "0.00000125"
  },
  {
    "name": "item_oldComputerFromGrandpa",
    "price": "0.00003"
  },
  {
    "name": "item_rapsberrypy",
    "price": "0.00005"
  },
  {
    "name": "item_smartphone",
    "price": "0.0005"
  },
  {
    "name": "item_middleClassPC",
    "price": "0.0015"
  },
  {
    "name": "item_cheapServer",
    "price": "0.004"
  },
  {
    "name": "item_gamingPC",
    "price": "0.015"
  },
  {
    "name": "item_cheapMiner",
    "price": "0.05"
  },
  {
    "name": "item_highEndUltraPC",
    "price": "0.15"
  },
  {
    "name": "item_bigMiner",
    "price": "1.5"
  },
  {
    "name": "item_miningFarm",
    "price": "250"
  },
  {
    "name": "item_nasaPC",
    "price": "5000"
  },
  {
    "name": "item_quantumRig",
    "price": "245000"
  },
  {
    "name": "item_miningFarmSpace",
    "price": "2000000"
  },
  {
    "name": "item_miningFarmMoon",
    "price": "75500000"
  },
  {
    "name": "item_bitcoinTimeMachine",
    "price": "975000000"
  },
  {
    "name": "item_blackHolePoweredMiner",
    "price": "750000000000"
  }
]

// Rate is null (at the beginning)
var bSec = null;

// Should be deleted after if is no more needed
localStorage.setItem("bitcoins", "0");

// If there is no bitcoins Item in the localStorage, create one.
// If there is one, do the other thing.
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

/**
 *
 *  <-- Setting up the game´s functions -->
 *
 */



// Game variable which will contain any needed major function for the game
var Game = {}

/**
 * Calculating every price for the items when the game was started (and if there are any items).
 *
 * @param element {HTMLElement} - The HTML element of the item on the game page
 * @param price {Number} - The price of the item, got from the items Object
 * @param itemAmount {Number} - The current amount of the item, saved in the localStorage
 */
Game.setPriceAtGameBeginning = function (element, price, itemAmount) {

  // Calculation of the price
  var multiplier = GameConst.priceMultiplier
  var calculation = (parseFloat(price) * Math.pow(multiplier, parseInt(itemAmount))).toFixed(8)

  // Showing the actual price
  element.children()[2].textContent = calculation + " Bitcoins"

  // Set the data-price attribute with the new price
  element.attr("data-price", calculation.toString())

}

/**
 * Function to increase the amount of the item (in the localStorage) with the specific identifier.
 *
 * @param id - The identifier of the item (the id from the list element)
 */
Game.itemAction = function (id) {

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
Game.setBitcoinPerSecondRateAtBeginning = function () {

  for(var i = 0; i < items.length; i++){
    if(localStorage.getItem(items[i].name) === null){
      localStorage.setItem(items[i].name, "0")
    }else{
      // HTML element on the game page
      var $element = $("#" + items[i].name)

      // Amnount of the item
      var itemAmount = localStorage.getItem(items[i].name)

      // Writing the amount on the page at the item´s element
      $element.children()[0].textContent = itemAmount

      // Only calculate the new price if there is more than 0 items.
      // If there are not enough items, it will just continue, and if there are,
      // it will execute the function and continue after it as well.
      if(itemAmount > 0) {
        Game.setPriceAtGameBeginning($element, parseFloat(items[i].price), parseInt(itemAmount))
      }

      // Getting the data-bits-per-sec attribute, needed for calculating the bitcoin/sec rate
      var bits_per_sec = $element.attr("data-bits-per-sec")
      itemAmount = parseInt(itemAmount)

      // The rate before
      var before = bitcoinRate

      // Calculating the rate
      bitcoinRate = bitcoinRate + (itemAmount * bits_per_sec)

      // Logging the calculation in the console
      console.log("i = " + i + " | B/sec before: " + before.toFixed(8) +
        " - Calculation made: " + before.toFixed(8) + " + (" + itemAmount + " * " + bits_per_sec + ") = " +  bitcoinRate.toFixed(8) +
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
Game.setNewBitcoinRate = function (rate) {

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
 * This function will check if there is any change in the localStorage,
 * especially looking at the item amount. So it will actually calculate every price again and
 * again. (This function should be recoded)
 *
 * TODO: Find a better way for setting the price after an item was bought.
 */
Game.setNewPrice = function()
{
  // for-loop for getting the price multiplier and to calculate the new price
  for(var i = 0; i < items.length; i++){
    if(localStorage.getItem(items[i].name) === null){
      localStorage.setItem(items[i].name, "0")
    }else{
      var $element = $("#" + items[i].name)
      var itemAmount = localStorage.getItem(items[i].name)

      $element.children()[0].textContent = itemAmount

      // Only calculate if there is more than 0 items
      if(itemAmount > 0) {

        // Calculation of the price
        var multiplier = GameConst.priceMultiplier
        var calculation = (parseFloat(items[i].price) * Math.pow(multiplier, parseInt(itemAmount))).toFixed(8)

        // Showing the actual price
        $element.children()[2].textContent = calculation + " Bitcoins"

        // Set the data-price attribute with the new price
        $element.attr("data-price", calculation.toString())

      }
    }
  }
  // End of the for-loop
}

/**
 * The function which adds new generated Bitcoins to the current Bitcoin amount.
 *
 * @param rate - The Bitcoin per second rate; Needed for adding the generated Bitcoins every second
 */
Game.bSecFunction = function (rate) {

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
Game.stopBsec = function () {
  clearInterval(bSec)
}

/**
 * <-- Now doing everything -->
 */


// Calculates the Bitcoin/sec rate with the amount of every item multiplied with their given Bitcoins/second rate.
Game.setBitcoinPerSecondRateAtBeginning()

// Stating the interval with the calculated Bitcoin/second rate.
bSec = setInterval(function () {
  Game.bSecFunction(bitcoinRate);
}, 1000)


// Doing everything here when the game is ready to be used.
$(document).ready(function () {

  // Write the version into the .version span element
  $(".version").text("Version " + GameConst.VERSION)

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

    var priceDisplay = $(this).children()[2]

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
      Game.itemAction(id)

      // Stops the interval
      Game.stopBsec()

      // Setting a new price and show it
      Game.setNewPrice()

      // Saving the new calculated Bitcoin/second rate in a variable
      var newRate = Game.setNewBitcoinRate(bitcoinsPerSecond)

      // Restarting the interval with the new rate
      bSec = setInterval(function () {
        Game.bSecFunction(newRate);
      }, 1000)

    }

  })

});



