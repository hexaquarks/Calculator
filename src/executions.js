
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
  
      if (calculator.dataset.previousKeyType === 'operator') {
        if (!calculator.dataset.firstNumber) {
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
  
  function executeExpression(keyValue, displayValue, previousKeyType) {
    if (keyValue === "𝑥²") {
      executeSquared(displayValue);
    } else if (keyValue === "√") {
      executeSquareRoot(displayValue);
    } else if (keyValue === '-') {
      executeNegation(keyValue, displayValue, previousKeyType);
    } else if (keyValue === '10x') {
      executePowerOfTen(keyValue, displayValue, previousKeyType);
    } else if (keyValue === 'sin') {
      executeSin(keyValue, displayValue, previousKeyType);
    }
  }
  
  function executeSquared(displayValue) {
    if (display.textContent !== "invalid input") {
      display.textContent = truncateValue(Math.pow(displayValue, 2));
    }
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
  }
  
  function executePowerOfTen(keyValue, displayValue, previousKeyType) {
    if (display.textContent !== "invalid input") {
      const displayNumber = BigInt(display.textContent);
      if (isFinite(Math.pow(10, Number(displayNumber)))) {
        display.textContent = Math.pow(10, Number(displayNumber));
      } else {
        display.textContent = "invalid input";
      }
    }
  }
  
  function executeSin(keyValue, displayValue, previousKeyType) {
    if (display.textContent !== "invalid input") {
      display.textContent = Math.sin(parseFloat(dispaly.textContent));
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

  function executeClearAll() {
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