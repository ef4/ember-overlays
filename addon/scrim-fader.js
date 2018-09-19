import RSVP from 'rsvp';
import $ from 'jquery';
import { animate } from 'liquid-fire';


export default function scrimFader() {
  let maxOpacity = 0.5;
  let promises = [];
  if (this.oldElement) {
    promises = promises.concat(Array.from(this.oldElement.find('> .overlay-scrim')).map(
      elt => animate($(elt), { opacity: 0} , { queue: false, duration: 250 } )
    ));
  }
  if (this.newElement) {
    promises = promises.concat(Array.from(this.newElement.find('> .overlay-scrim')).map(
      elt => animate($(elt), { opacity: [maxOpacity, 0]}, { queue: false, duration: 250 } )
    ));
  }
  this.newElement.style.visibility = '';
  return RSVP.all(promises);
}
