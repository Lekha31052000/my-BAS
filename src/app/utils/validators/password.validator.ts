import { AbstractControl } from '@angular/forms';

// check whether to fields/controls are matching
export function mustMatch(control1: AbstractControl, control2: AbstractControl) {
    if (control1.value !== control2.value) {
        return { mustMatch: true };
    }
    return null;
}

// check whether to fields/controls are not matching
export function mustNotMatch(control1: AbstractControl, control2: AbstractControl) {
    if (control1.value === control2.value) {
        return { mustNotMatch: true };
    }
    return null;
} 