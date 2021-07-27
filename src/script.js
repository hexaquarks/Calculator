const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = calculator.querySelector(".calculator__display").childNodes[0];
const smallDisplay = calculator.querySelector(".calculator__smallDisplayText")
  .childNodes[0];
const smallOperatorDisplay = calculator.querySelector(
  ".calculator__smallOperatorDisplay"
);
const previousKeyType = calculator.dataset.previousKeyType;

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
  switch (type) {

    case "number":
      executeNumber(keyValue, displayValue, calculator.dataset.previousKeyType);
      updateDisplayFontSize();
      break;

    case "operator":
      if (display.textContent === "invalid input") return;
    
      executeOperation(displayValue, keyValue, calculator.dataset.previousKeyType);
      break;

    case "expression":
      displayValue = emptyDecimal(displayValue);
      executeExpression(keyValue, displayValue, previousKeyType);
      smallDisplaySuccessiveExpression(keyValue, displayValue, previousKeyType);
      updateDisplayFontSize();
      break;

    case "equal":
      if (calculator.dataset.firstNumber && calculator.dataset.operator) {
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
  console.log(previousKeyType);


});

document.addEventListener("click", (event) => {
  if (!event.target.closest("button"))
    if (event.target.id === "left_arrow") {
      translateSmallDisplay("left");
    } else if (event.target.id === "right_arrow") {
      translateSmallDisplay("right");
    }
});

//get the left position of small display field relative to its parent container 
// using getBoundingClientRec *before* the x-transition.
smallDisplay.parentNode.addEventListener('transitionend', e => {

  const long = smallDisplay.parentNode.getBoundingClientRect().left;
  const short = calculator.getBoundingClientRect().left;

  const diff = long - short;
  enableArrowsVisibility();
});

window.addEventListener("keydown", (event) => {
  let type = "";

  let numbersArray = (Array.from(Array(10).keys())).map(String);


  if (numbersArray.includes(event.key)) {
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
  } else if (event.key === "Escape") {
    executeClearAll();
  }

  calculator.dataset.previousKeyType = type;
});


function smallDisplayFormat() {
  // compute the total length of the firstNumber and operator then parse through the string and format the number of decimals such that they are at least >= 1.
}

/* document.querySelector(selector) returns the first Element that matches the specified selector. If none are found the 'null' is returned */

/* event.target returns the target of the click. In this case <button class = "number x">x</button> */
