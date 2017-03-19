import Ember from 'ember';
import layout from '../templates/components/mark-overlay';
import MarkInfo from '../mark-info';
const { guidFor } = Ember;
import { componentNodes } from '../ember-private-api';

export default Ember.Component.extend({
  layout,
  tagName: '',
  service: Ember.inject.service('ember-overlays'),

  // Addon authors should group their overlays under a unique group
  // name so they don't interfere with other uses. An app can use the
  // default group.
  group: 'default',

  // this is an optional parameter that will be made available as
  // mark.model inside overlay-marks
  model: null,

  didRender() {
    this.get('service').registerMark(guidFor(this), this.info());
  },

  willDestroyElement() {
    this.get('service').unregisterMark(guidFor(this));
  },

  info() {
    let { firstNode, lastNode } = componentNodes(this);
    return new MarkInfo(
      this.get('id'),
      firstNode,
      lastNode,
      this.get('group') || 'default',
      this.get('model')
    );
  }


});
