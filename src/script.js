const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = calculator.querySelector(".calculator__display").childNodes[0];
const smallDisplay = calculator.querySelector(".calculator__smallDisplayText")
.childNodes[0];
const smallOperatorDisplay = calculator.querySelector(
".calculator__smallOperatorDisplay"
);
const { previousKeyType } = calculator.dataset;

//quick fix...
// smallDisplay.textContent = String.fromCharCode(160);
keys.addEventListener("click", (event) => {
if (!event.target.closest("button"))
  return; /* do nothing if the click is in between the buttons - on the 2px grid-gap, which would otherwise return the whole keys buttons */

const key = event.target;
const keyValue = key.textContent;
let displayValue = display.textContent;
const displaySmallValue = smallDisplay.textContent;
const displaySmallOperatorValue = smallOperatorDisplay.textContent;
const { type } = key.dataset; // for verbose simplicity
// ^ same as const type = key.dataset.type

// if number key :
switch(type){

  case "number":
    executeNumber(keyValue, displayValue, calculator.dataset.previousKeyType);
    updateDisplayFontSize();
    break;

  case "operator":


    if (display.textContent !== "invalid input") {
      executeOperation(displayValue, keyValue);
    }
    break;

  case "expression":
    displayValue = emptyDecimal(displayValue);
    executeExpression(keyValue,displayValue, previousKeyType);
    smallDisplaySuccessiveExpression(keyValue, displayValue, previousKeyType);
    break; 

  case "equal":
    if(calculator.dataset.firstNumber && calculator.dataset.operator){
      executeEqual(displayValue, previousKeyType);
    }
    //TODO remove truncate and updateDisplayFontSize instead ? 
    break;

  case "clear": 
    display.textContent = "0";
    resetDisplayFontSize();
    break;

  case "clearAll":
    executeClearAll();
    resetSmallDisplayPosition();
    resetDisplayFontSize();

    break;

  case "back":
    clearOneChar(displayValue);
    updateDisplayFontSize();
    break;

}

enableArrowsVisibility();
calculator.dataset.previousKeyType = type;


});

document.addEventListener("click", (event) => {
if (!event.target.closest("button"))
  if(event.target.id === "left_arrow"){
    translateSmallDisplay("left");
  } else if(event.target.id === "right_arrow"){
    translateSmallDisplay("right");
  }
});

//get the left position of small display field relative to its parent container using getBoundingClientRec *before* the x-transition.
smallDisplay.parentNode.addEventListener('transitionend', e => {

const long = smallDisplay.parentNode.getBoundingClientRect().left;
const short  = calculator.getBoundingClientRect().left;

const diff  = long - short;

enableArrowsVisibility();
});

window.addEventListener("keydown", (event) => {
let type = "";

let numbersArray = (Array.from(Array(10).keys())).map(String);


if (numbersArray.includes(event.key)
    ) {
  executeNumber(
    event.key,
    display.textContent,
    calculator.dataset.previousKeyType
  );
  type = "number";
} else if (event.key === "Backspace") {
  clearOneChar(display.textContent);
  type = "back";
} else if (event.key === "." || event.key === ",") {
  if (!display.textContent.includes(".")) {
    display.textContent += ".";
  }
  type = "number";
} else if (event.key === "+") {
  executeOperation(display.textContent, "+");
  type = "operator";
} else if (event.key === "-") {
  executeOperation(display.textContent, "-");
  type = "operator";
} else if (event.key === "*") {
  executeOperation(display.textContent, "×");
  type = "operator";
} else if (event.key === "/") {
  executeOperation(display.textContent, "÷");
  type = "operator";
} else if (event.key === "%") {
  executeOperation(display.textContent, "%");
  type = "operator";
} else if (
  (event.key === "Enter" || event.key === "=") &&
  calculator.dataset.firstNumber &&
  calculator.dataset.operator
) {
  executeEqual(display.textContent, calculator.dataset.previousDataType);
  type = "equal";
} else if (event.key === "Escape"){
  executeClearAll();
}

calculator.dataset.previousKeyType = type;
});

function executeNumber(keyValue, displayValue, previousKeyType) {
if (keyValue === ".") {
  if (!display.textContent.includes(".")) {
    if (previousKeyType == "operator") {
      display.textContent = "0.";
    } else {
      if (display.textContent.length < 24) {
        display.textContent = displayValue + keyValue;
      }
    }
  }
} else {
  if (displayValue === "0") {
    display.textContent = keyValue;
  } else if (previousKeyType === "operator") {
    display.textContent = keyValue;
  } else if (previousKeyType === "equal") {
    display.textContent = keyValue;
    smallDisplay.textContent = "\xA0";
    smallOperatorDisplay.textContent = "\xA0";
  } else {
    if (display.textContent.length < 24) {
      display.textContent = displayValue + keyValue;
    }
  }
}
}
function executeOperation(displayValue, keyValue) {
displayValue = emptyDecimal(displayValue);

if (smallDisplay.textContent !== String.fromCharCode(160)) {
}

if (calculator.dataset.firstNumber !== String.fromCharCode(160)) {
  // += displayValue with prevKeyOperatorType ??
  if (!calculator.dataset.firstNumber) {
    calculator.dataset.firstNumber = " ";
  }
  if (!calculator.dataset.operator) {
    calculator.dataset.operator = " ";
  }

  if(calculator.dataset.previousKeyType === 'operator'){
    if(!calculator.dataset.firstNumber){
      calculator.dataset.firstNumber = displayValue; 
    }
  } else {
    calculator.dataset.firstNumber +=
      " " + calculator.dataset.operator + " " + displayValue; 
  }
} else {
  calculator.dataset.firstNumber = displayValue;
}
calculator.dataset.operator = keyValue;

//if smallDisplay already exists treat differently.
updateSmallDisplay(calculator.dataset.firstNumber, keyValue);
}

function executeExpression(keyValue, displayValue, previousKeyType){
  if (keyValue === "𝑥²") {
    if (display.textContent !== "invalid input") {
      display.textContent = truncateValue(Math.pow(displayValue, 2));
    }
  } else if (keyValue === "√") {
    if (
      display.textContent.charAt(0) === "-" || display.textContent === "invalid input"
    ) {
      display.textContent = "invalid input";
    } else {
      display.textContent = truncateValue(Math.sqrt(displayValue));
    }
  } else if (keyValue === '-') {
    if (display.textContent !== "0") {
      if (display.textContent !== "invalid input") {
        if (display.textContent.charAt(0) === "-") {
          display.textContent = display.textContent.substring(1);
        } else {
          display.textContent = "-" + truncateValue(displayValue);
        }
        smallDisplaySuccessiveExpression("-", displayValue, previousKeyType);
      }
    }
  } else if (keyValue === '10x'){
    if(display.textContent !== "invalid input"){
      display.textContent = truncateValue(Math.pow(10, parseInt(display.textContent)));
    }
  }
}

function executeEqual(displayValue, previousKeyType) {
previousKeyType = calculator.dataset.previousKeyType;
displayValue = emptyDecimal(displayValue);
//perform calculation
let firstNumber, operator, secondNumber;

if (previousKeyType === "equal") {
  firstNumber = displayValue;
  secondNumber = calculator.dataset.secondNumber;
} else {
  firstNumber = calculator.dataset.firstNumber;
  secondNumber = displayValue;
  calculator.dataset.secondNumber = secondNumber;
}

operator = calculator.dataset.operator;

display.textContent = truncateValue(
  calculate(firstNumber, operator, secondNumber)
);

smallDisplay.textContent = firstNumber + " " + operator + " " + secondNumber;
smallOperatorDisplay.textContent = "=";
}

function smallDisplaySuccessiveExpression( expression, displayValue, previousKeyType ) {

if(expression === '𝑥²') expression = '²';
//expression == '-' || '√' || '²'
if (
  smallDisplay.textContent !== String.fromCharCode(160) &&
  previousKeyType !== "equal"
) {
  //successive negation hits
  if (
    smallDisplay.textContent.charAt(0) === "√" ||
    (smallDisplay.textContent.charAt(smallDisplay.textContent.length - 1) ===
      "²" &&
      smallDisplay.textContent.charAt(0) === "(") ||
    smallDisplay.textContent.charAt(0) === "-"
  ) {
    if (expression === "√" || expression === "-") {
      smallDisplay.textContent =
        expression + "(" + smallDisplay.textContent + ")";
    } else {
      smallDisplay.textContent = "(" + smallDisplay.textContent + ")²";
    }
  } else {
    if (expression === "√" || expression === "-") {
      smallDisplay.textContent = calculator.dataset.firstNumber + " " + calculator.dataset.operator +
        " " + expression + "(" + displayValue + ")";
    } else {
      smallDisplay.textContent =calculator.dataset.firstNumber + " " + calculator.dataset.operator + " " +
        "(" + displayValue + ")²";
    }
  }
} else {
  if (expression === "√" || expression === "-") {
    smallDisplay.textContent = expression + "(" + displayValue + ")";
  } else {
    smallDisplay.textContent = "(" + displayValue + ")²";
  }
}
smallOperatorDisplay.textContent = "\xA0";
}

function updateSmallDisplay(firstNumber, operator) {
smallDisplay.textContent = firstNumber;
smallOperatorDisplay.textContent = operator;
}

function executeClearAll(){
display.textContent = "0";
smallDisplay.textContent = "\xA0";
smallOperatorDisplay.textContent = "\xA0";
delete calculator.dataset.firstNumber;
delete calculator.dataset.operator;
}

function clearOneChar(displayValue) {
let val = displayValue;
if (val.length > 1) {
  display.textContent = displayValue.substring(0, displayValue.length - 1);
} else {
  display.textContent = "0";
}
}

function calculate(firstNumber, operator, secondNumber) {
firstNumber = parseFloat(firstNumber);
secondNumber = parseFloat(secondNumber);

if (operator === "+") return firstNumber + secondNumber;
else if (operator === "-") return firstNumber - secondNumber;
else if (operator === "×") return firstNumber * secondNumber;
else if (operator === "÷") return firstNumber / secondNumber;
else if (operator === "%") return firstNumber % secondNumber;
}

function formatDecimal(value) {
var valueNum = Math.abs(valueNum);
var decimal = valueNum - Math.floor(valueNum) , length = decimal.toString().length;

return (length > 2) ? value.toFixed(2) : value;
}

function truncateValue(value) {
result = String(value);
return (result.length < 16) ? result : result.substring(0,15);
//truncate the result to fit the display

}

function emptyDecimal(value) {
if (value.charAt(value.length - 1) === ".") return value + "0";

return value;
}

function resetSmallDisplayPosition(){
smallDisplay.parentNode.style = '';
}

function enableArrowsVisibility(){
const left_arrow = document.getElementById('left_arrow');
const right_arrow = document.getElementById('right_arrow');

const long = smallDisplay.parentNode.getBoundingClientRect().left;
const short  = calculator.getBoundingClientRect().left;
const diff  = long - short;

(diff < 29) ? left_arrow.style.opacity = "100%" : left_arrow.style.opacity = "20%";
//29 instead of 30 to account for float values

(diff + smallDisplay.parentNode.offsetWidth) > (calculator.offsetWidth-29) ? right_arrow.style.opacity = "100%" : right_arrow.style.opacity = "20%";

}

function translateSmallDisplay(arrowDirection) {
let translationValue = 150;
const long = smallDisplay.parentNode.getBoundingClientRect().left;
const short  = calculator.getBoundingClientRect().left;
const diff  = long - short;


if(diff <= 31){    
  if (arrowDirection === "left") {
    if(diff + translationValue < 30){
      smallDisplay.parentNode.style.transform += "translateX(" + translationValue.toString() + "px" + ")";  

    } else {  

      const newDiff =  30 - diff;
      smallDisplay.parentNode.style.transform += "translateX(" + newDiff.toString() + "px" + ")";
    }

  } else {

    if((diff + smallDisplay.parentNode.offsetWidth) - translationValue > (calculator.offsetWidth - 30)){

      smallDisplay.parentNode.style.transform += "translateX(" + "-" + translationValue.toString() + "px" + ")";  

    } else {  


      var newDiff =  (diff + smallDisplay.parentNode.offsetWidth)-(calculator.offsetWidth - 30);
      smallDisplay.parentNode.style.transform += "translateX(" + "-" + newDiff.toString() + "px" + ")";

    }

  } 
}
enableArrowsVisibility();
}

function updateDisplayFontSize(){
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

var text = display.textContent;

context.font = window.getComputedStyle(display, null).font;
context.fontSize = window.getComputedStyle(display, null).getPropertyValue('font-size');

var font_size = parseFloat(context.fontSize);

if(context.measureText(text).width >= (calculator.offsetWidth-100)) {
  //container.offsetWidth-10 for the padding
  new_font_index = 1;
  do {
    display.style.fontSize = parseFloat(window.getComputedStyle(display, null).getPropertyValue('font-size')) -0.1 + "px";
    context.font = window.getComputedStyle(display, null).font;
    context.fontSize = window.getComputedStyle(display, null).getPropertyValue('font-size');
    new_font_index++;

  } while(context.measureText(text).width >= calculator.offsetWidth-100);
  display.style.fontSize = (font_size - new_font_index/10) + "px";
}
}

function resetDisplayFontSize(){
display.style.setProperty('font-size' , 'calc(1rem * 1.2 * 1.2)');
//display.style.fontSize = "calc(1rem * 1.2 * 1.2)";
}

function smallDisplayFormat() {
// compute the total length of the firstNumber and operator then parse through the string and format the number of decimals such that they are at least >= 1.
}

/* document.querySelector(selector) returns the first Element that matches the specified selector. If none are found the 'null' is returned */

/* event.target returns the target of the click. In this case <button class = "number x">x</button> */
