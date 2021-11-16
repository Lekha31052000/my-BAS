import { trigger, state, style, transition, animate } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'min-width': '100px'
    })
  ),
  state('open',
    style({
      'min-width': '200px'
    })
  ),
  transition('close => open', animate('200ms ease-in')),
  transition('open => close', animate('380ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '100px'
    })
  ),
  state('open',
    style({
      'margin-left': '252px'
    })
  ),
  transition('close => open', animate('200ms ease-in')),
  transition('open => close', animate('380ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      // visibility: 'hidden',
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      // visibility: 'visible',
      'display': 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('200ms ease-in')),
  transition('open => close', animate('380ms ease-out')),
  // transition('hide => show', animate('180ms ease-in')),
  // transition('show => hide', animate('200ms ease-out')),
]);