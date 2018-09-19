import { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  hoverable: true,
  cycle: false,
  titleOnly: false,
  moving: false,

  doCycling: task(function * () {
    let ids = ['title', 'first-name', 'last-name', 'advanced'];
    let counter = 0;
    for (;;) {
      if (this.get('titleOnly')) {
        this.set('highlightedId', 'title');
      } else if (this.get('cycle')) {
        this.set('highlightedId', ids[counter % ids.length]);
      } else {
        this.set('highlightedId', null);
      }
      yield timeout(500);
      counter++;
    }
  }).on('init').restartable(),

  actions: {
    focusOn(markId) {
      this.set('focusedId', markId);
    },
    addThing() {
      let t = this.get('things') || A();
      t.pushObject(1);
      this.set('things', t);
    }
  }

});
