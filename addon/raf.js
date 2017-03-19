// Cancelable promise-driven requestAnimationFrame with fallbacks.

import RSVP from 'rsvp';

// native promise gives us real request-animation-frame
// timing. Ember's RSVP uses setTimeout. :-(
let Promise = window.Promise || RSVP.Promise;

export default function() {
  let timer, frame;
  let promise = new Promise(resolve => {
    if (typeof requestAnimationFrame === 'undefined') {
      timer = setTimeout(resolve, 33);  // 33ms is 30hz
    } else {
      frame = requestAnimationFrame(resolve);
    }
  });
  promise.__ec_cancel__ = () => {
    if (timer != null) {
      clearTimeout(timer);
    } else {
      cancelAnimationFrame(frame);
    }
  };
  return promise;
}
