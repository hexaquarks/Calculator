
function executeNumber(keyValue, displayValue, previousKeyType) {
  if(displayValue === "invalid input") {
    executeClearAll();
    displayValue = "0";
  }

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
      console.log("in")
      if (display.textContent.length < 24) {
        display.textContent = displayValue + keyValue;
      }
    }
  }
}

function executeOperation(displayValue, keyValue, previousKeyType) {
  displayValue = emptyDecimal(displayValue);

  console.log("first number " + calculator.dataset.firstNumber);
  console.log("previous " + previousKeyType);
  if (calculator.dataset.firstNumber !== String.fromCharCode(160)) {
    // += displayValue with prevKeyOperatorType ??
    console.log("a")
    if (!calculator.dataset.firstNumber) {
      calculator.dataset.firstNumber = " ";
    }
    if (!calculator.dataset.operator) {
      calculator.dataset.operator = " ";
    }

    if (previousKeyType === 'operator') {
      if (!calculator.dataset.firstNumber) {
        calculator.dataset.firstNumber = displayValue;
      }
    } else {
      calculator.dataset.firstNumber +=
        " " + calculator.dataset.operator + " " + displayValue;
    }
  } else  {
    calculator.dataset.firstNumber = displayValue;
  }
  calculator.dataset.operator = keyValue;

  //if smallDisplay already exists treat differently.
  updateSmallDisplay(calculator.dataset.firstNumber, keyValue);
}

function executeExpression(keyValue, displayValue, previousKeyType) {
  if (keyValue === "𝑥²") {
    executeSquared(displayValue);
  } else if (keyValue === "√") {
    executeSquareRoot(displayValue);
  } else if (keyValue === '±') {
    executeNegation(displayValue, previousKeyType);
  } else if (keyValue === '10x') {
    executePowerOfTen(keyValue, displayValue, previousKeyType);
  } else if (keyValue === 'sin') {
    executeSin(keyValue, displayValue, previousKeyType);
  }
}

function executeSquared(displayValue) {
  if (display.textContent === "invalid input") return; 

  display.textContent = truncateValue(Math.pow(displayValue, 2));
}

function executeSquareRoot(displayValue) {
  if (
    display.textContent.charAt(0) === "-" || display.textContent === "invalid input"
  ) {
    display.textContent = "invalid input";
  } else {
    display.textContent = truncateValue(Math.sqrt(displayValue));
  }
}

function executeNegation(displayValue, previousKeyType) {
  if (display.textContent === "0" || display.textContent === "invalid input") return;

  if (display.textContent.charAt(0) === "-") {
    display.textContent = display.textContent.substring(1);
  } else {
    // console.log("min : " + display.textContent + " " + );
    display.textContent = "-" + truncateValue(displayValue);
  }
  // smallDisplaySuccessiveExpression("-", displayValue, previousKeyType);
}

function executePowerOfTen(keyValue, displayValue, previousKeyType) {
  if (display.textContent === "invalid input") return;

  let displayNumber;

  if(parseFloat(display.textContent) >= Number.MAX_VALUE) {
    displayNumber = BigInt(display.textContent);
  } else {
    displayNumber = parseFloat(display.textContent);
  }

  if (isFinite(Math.pow(10, Number(displayNumber)))) {
    display.textContent = Math.pow(10, Number(displayNumber));
  } else {
    display.textContent = "invalid input";
  }
}

function executeSin(keyValue, displayValue, previousKeyType) {
  if (display.textContent === "invalid input") return;

  display.textContent = Math.sin(parseFloat(display.textContent));
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

function executeClearAll() {
  display.textContent = "0" , displayValue = "0";
  smallDisplay.textContent = "\xA0";
  smallOperatorDisplay.textContent = "\xA0";
  delete calculator.dataset.firstNumber;
  delete calculator.dataset.operator;
}

function clearOneChar(displayValue) {
  let val = displayValue;
  if (display.textContent === "invalid input") return;

  if (val.length > 1) {
    display.textContent = displayValue.substring(0, displayValue.length - 1);
  } else {
    display.textContent = "0";
  }
}