import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/overlay-marks';

export default Component.extend({
  layout,
  tagName: '',
  service: service('ember-overlays'),
  marks: computed('service.marks', function() {
    let group = this.get('group') || 'default';
    let id = this.get('id');
    return this.get('service.marks').filter(m => m.group === group && (id == null || m.id === id));
  })
});
