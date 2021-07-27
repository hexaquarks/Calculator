function updateDisplayFontSize() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  var text = display.textContent;

  context.font = window.getComputedStyle(display, null).font;
  context.fontSize = window.getComputedStyle(display, null).getPropertyValue('font-size');

  var font_size = parseFloat(context.fontSize);

  if (context.measureText(text).width >= (calculator.offsetWidth - 100)) {
    //container.offsetWidth-10 for the padding
    new_font_index = 1;
    do {
      display.style.fontSize = parseFloat(window.getComputedStyle(display, null).getPropertyValue('font-size')) - 0.1 + "px";
      context.font = window.getComputedStyle(display, null).font;
      context.fontSize = window.getComputedStyle(display, null).getPropertyValue('font-size');
      new_font_index++;

    } while (context.measureText(text).width >= calculator.offsetWidth - 100);
    
    display.style.fontSize = (font_size - new_font_index / 10) + "px";
  }
}

function resetDisplayFontSize() {
  display.style.setProperty('font-size', 'calc(1rem * 1.2 * 1.2)');
  //display.style.fontSize = "calc(1rem * 1.2 * 1.2)";
}