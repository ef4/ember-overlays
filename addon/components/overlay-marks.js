import Ember from 'ember';
import layout from '../templates/components/overlay-marks';

export default Ember.Component.extend({
  layout,
  tagName: '',
  service: Ember.inject.service('ember-overlays'),
  marks: Ember.computed('service.marks', function() {
    let type = this.get('type');
    return this.get('service.marks').filter(m => m.type === type);
  })
});
