import { or } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/create-overlay';
import raf from '../raf';
import { ownTransform } from '../transform';
import { task } from 'ember-concurrency';
import { boundsEqual } from '../bounds';
import scrimFader from '../scrim-fader';
import jQuery from 'jquery';

export default Component.extend({
  layout,
  scrimFader,
  classNames: ['show-overlay'],
  classNameBindings: ['reveal', 'hoverable', 'focused'],
  hovered: false,

  // TODO
  fieldScale: 1,

  _targetRect() {
    let mark = this.get('at');
    return mark.bounds();
  },

  _waitForTargetRect: function * () {
    let hiding = false;
    let elt = this.element;
    for (;;) {
      let targetRect = this._targetRect();
      if (targetRect) {
        return targetRect;
      }
      if (!hiding) {
        elt.style.display = 'none';
        hiding = true;
      }
      yield raf();
    }
  },

  _translation(targetRect, ownRect, currentTransform) {
    return `translateX(${targetRect.left - ownRect.left + currentTransform.tx}px) translateY(${targetRect.top - ownRect.top + currentTransform.ty}px)`;
  },

  _matchWidth(elt, targetRect, ownRect) {
    let $elt = jQuery(elt);
    return `${$elt.outerWidth() + targetRect.right - targetRect.left - ownRect.right + ownRect.left}px`;
  },

  _matchHeight(elt, targetRect, ownRect) {
    let $elt = jQuery(elt);
    return `${$elt.outerHeight() + targetRect.bottom - targetRect.top - ownRect.bottom + ownRect.top}px`;
  },

  _track: task(function * () {
    let elt = this.element;
    let ownTarget = elt.querySelector('.target');
    let lastTargetRect;

    for (;;) {

      // stay hidden until we have a target
      let targetRect = yield* this._waitForTargetRect();
      if (!lastTargetRect || !boundsEqual(targetRect, lastTargetRect)) {

        // position ourselves over the target
        let ownRect = ownTarget.getBoundingClientRect();
        let t = ownTransform(elt);
        elt.style.display = 'initial';
        elt.style.transform = `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
        ownTarget.style.width = this._matchWidth(ownTarget, targetRect, ownRect);
        ownTarget.style.minHeight = this._matchHeight(ownTarget, targetRect, ownRect);
        let label = Array.from(elt.children).find(elt => elt.tagName === 'LABEL');
        if (label) {
          label.style.transform = `translateY(-100%) scale(${1 / this.get('fieldScale')})`;
        }
      }
      lastTargetRect = targetRect;
      yield raf();
      while (this.get('lockWhileFocused') && this.get('focused')) {
        yield raf();
      }
    }
  }).on('didInsertElement'),

  reveal: or('hovered', 'highlighted', 'focused'),

  actions: {
    beginHover() {
      this.set('hovered', true);
    },
    endHover() {
      this.set('hovered', false);
    },
    targetClicked() {
      let handler = this.get('onclick');
      if (handler) {
        handler();
      }
    },
    dismiss() {
      let handler = this.get('dismiss');
      if (handler) {
        handler();
      }
    }
  }
});
