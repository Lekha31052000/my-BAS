import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[validateInput]'
})
export class ValidateInputDirective {
  @Input() validateInput: any;

  constructor() { }
  @HostListener('keydown', ['$event']) onKeydown(event: any) {
    // allow only numbers
    if (this.validateInput.hasOwnProperty('only-numbers')) {
      if (!((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) ||
        (event.keyCode >= 96 && event.keyCode <= 105 && !event.metaKey) ||
        event.keyCode === 37 && event.keyCode === 39 ||
        event.keyCode === 8 || (event.keyCode === 9 && event.value !== '') || event.keyCode === 46 || event.keyCode === 110)) {
        return false;
      }
    } else if (this.validateInput.hasOwnProperty('alpha-numeric')) {
      if (!(((event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey == false) || (event.keyCode >= 33 && event.keyCode <= 40) || (event.keyCode >= 65 && event.keyCode <= 90) ||
					(event.keyCode >= 96 && event.keyCode <= 105 ) || (event.keyCode == 46) || (event.keyCode == 8) ||  (event.keyCode == 9)))) {
					return false;
				}
    } else if (this.validateInput.hasOwnProperty('mobile-number')) {
      // restrict first digit to 9/8/7/6
      const inputValue = event.target;
      if ((inputValue['value'] + event.key).length === 1) {
        if ((event.keyCode >= 48 && event.keyCode <= 53)) {
          return false;
        }
      }
      // keycode
      // ZERO - 48, 96, NINE - 57, 105, DELETE - 46, 110, BACKSPACE - 8, TAB - 9, LEFT ARROWS - 37, RIGHT ARROW -39
      if (!((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) ||
        (event.keyCode >= 96 && event.keyCode <= 105 && !event.metaKey) ||
        event.keyCode === 37 && event.keyCode === 39 ||
        event.keyCode === 8 || (event.keyCode === 9 && event.value !== '') || event.keyCode === 46 || event.keyCode === 110)) {
        return false;
      }
    }
  }

}
