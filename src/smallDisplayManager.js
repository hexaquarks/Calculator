//TODO fix arrows visibility + smallOperator dynamica visibility
const operatorPlaceholder = '';

function smallDisplaySuccessiveExpression(expression, displayValue, previousKeyType) {
  if (expression === '𝑥²') expression = '²';
  //expression == '-' || '√' || '²' || 10x || sinx
  //TODO 10x sinx
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
        smallDisplay.textContent = calculator.dataset.firstNumber + " " + calculator.dataset.operator + " " +
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

function resetSmallDisplayPosition() {
  smallDisplay.parentNode.style = '';
}

function enableArrowsVisibility() {
  const left_arrow = document.getElementById('left_arrow');
  const right_arrow = document.getElementById('right_arrow');

  const long = smallDisplay.parentNode.getBoundingClientRect().left;
  const short = calculator.getBoundingClientRect().left;
  const diff = long - short;

  if(diff < 29) {
    left_arrow.style.opacity = "100%";
  }else {
    left_arrow.style.opacity = "20%";
    // operatorPlaceholder = smallOperatorDisplay.textContent;
    // smallOperatorDisplay.textContent = ' ';
  }

  if((diff + smallDisplay.parentNode.offsetWidth) > (calculator.offsetWidth - 29)){
    right_arrow.style.opacity = "100%";
  }else {
    right_arrow.style.opacity = "20%";
    // smallOperatorDisplay.textContent = operatorPlaceholder;

  }
  // (diff < 29) ? left_arrow.style.opacity = "100%" : left_arrow.style.opacity = "20%";
  // // 29 instead of 30 to account for float values

  // (diff + smallDisplay.parentNode.offsetWidth) > (calculator.offsetWidth - 29) 
  // ? right_arrow.style.opacity = "100%" : right_arrow.style.opacity = "20%";

}

function translateSmallDisplay(arrowDirection) {
  let translationValue = 150;
  const long = smallDisplay.parentNode.getBoundingClientRect().left;
  const short = calculator.getBoundingClientRect().left;
  const diff = long - short;


  if (diff <= 31) {
    if (arrowDirection === "left") {
      if (diff + translationValue < 30) {
        smallDisplay.parentNode.style.transform += "translateX(" + translationValue.toString() + "px" + ")";
      } else {
        const newDiff = 30 - diff;
        smallDisplay.parentNode.style.transform += "translateX(" + newDiff.toString() + "px" + ")";
      }

    } else {
      if ((diff + smallDisplay.parentNode.offsetWidth) - translationValue > (calculator.offsetWidth - 30)) {
        smallDisplay.parentNode.style.transform += "translateX(" + "-" + translationValue.toString() + "px" + ")";
      } else {
        var newDiff = (diff + smallDisplay.parentNode.offsetWidth) - (calculator.offsetWidth - 30);
        smallDisplay.parentNode.style.transform += "translateX(" + "-" + newDiff.toString() + "px" + ")";
      }
    }
  }
  enableArrowsVisibility();
}
