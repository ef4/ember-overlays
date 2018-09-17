import Service from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default Service.extend({
  init() {
    this._super();
    this._markSources = Object.create(null);
    this.set('marks', []);
  },

  registerMark(sourceId, markInfo) {
    this._markSources[sourceId] = markInfo;
    this._scheduleUpdate();
  },

  unregisterMark(sourceId) {
    this._markSources[sourceId] = null;
    this._scheduleUpdate();
  },

  _scheduleUpdate() {
    scheduleOnce('afterRender', this, this._update);
  },

  _update() {
    if (this.isDestroyed) { return; }

    let sources = this._markSources;
    let marks = Object.create(null);
    for (let sourceId in sources) {
      let markInfo = sources[sourceId];
      if (markInfo) {
        marks[markInfo.type + '/' + markInfo.id] = markInfo;
      }
    }
    this.set('marks', Object.keys(marks).map(k => marks[k]));
  }

});
