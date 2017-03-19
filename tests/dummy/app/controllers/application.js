import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  hoverable: true,
  cycle: false,
  titleOnly: false,

  doCycling: task(function * () {
    let ids = ['title', 'first-name', 'last-name'];
    let counter = 0;
    for (;;) {
      yield timeout(500);
      counter++;
      if (this.get('titleOnly')) {
        this.set('highlightedId', 'title');
      } else if (this.get('cycle')) {
        this.set('highlightedId', ids[counter % ids.length]);
      } else {
        this.set('highlightedId', null);
      }
    }
  }).on('init'),

  actions: {
    focusOn(markId) {
      this.set('focusedId', markId);
    }
  }

});
