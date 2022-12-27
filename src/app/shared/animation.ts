import { trigger, style, animate, transition, state } from '@angular/animations';

export const slideIn = [
  trigger('slideIn', [
    state('in', style({ opacity: '1' })),
    state('out', style({ opacity: '0' })),
    transition('in => out' , animate('100ms')),
    transition('out => in' , animate('100ms')),
  ])
];
