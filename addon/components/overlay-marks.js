import Ember from 'ember';
import layout from '../templates/components/overlay-marks';

export default Ember.Component.extend({
  layout,
  tagName: '',
  service: Ember.inject.service('ember-overlays'),
  marks: Ember.computed('service.marks', function() {
    let group = this.get('group') || 'default';
    return this.get('service.marks').filter(m => m.group === group);
  })
});
