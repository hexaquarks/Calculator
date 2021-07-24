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
  var decimal = valueNum - Math.floor(valueNum), length = decimal.toString().length;

  return (length > 2) ? value.toFixed(2) : value;
}

function truncateValue(value) {
  result = String(value);
  return (result.length < 16) ? result : result.substring(0, 15);
  //truncate the result to fit the display

}

function emptyDecimal(value) {
  if (value.charAt(value.length - 1) === ".") return value + "0";

  return value;
}