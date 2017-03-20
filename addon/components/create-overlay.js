import Ember from 'ember';
import layout from '../templates/components/create-overlay';
import raf from '../raf';
import { ownTransform } from '../transform';
import { task } from 'ember-concurrency';
import { boundsEqual } from '../bounds';
import scrimFader from '../scrim-fader';

export default Ember.Component.extend({
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
    let $elt = this.$();
    for (;;) {
      let targetRect = this._targetRect();
      if (targetRect) {
        return targetRect;
      }
      if (!hiding) {
        $elt.css({ display: 'none' });
        hiding = true;
      }
      yield raf();
    }
  },

  _translation(targetRect, ownRect, currentTransform) {
    return `translateX(${targetRect.left - ownRect.left + currentTransform.tx}px) translateY(${targetRect.top - ownRect.top + currentTransform.ty}px)`;
  },

  _matchWidth($elt, targetRect, ownRect) {
    return `${$elt.outerWidth() + targetRect.right - targetRect.left - ownRect.right + ownRect.left}px`;
  },

  _matchHeight($elt, targetRect, ownRect) {
    return `${$elt.outerHeight() + targetRect.bottom - targetRect.top - ownRect.bottom + ownRect.top}px`;
  },

  _track: task(function * () {
    let $elt = this.$();
    let $ownTarget = this.$('.target');
    let lastTargetRect;

    for (;;) {

      // stay hidden until we have a target
      let targetRect = yield* this._waitForTargetRect();
      if (!lastTargetRect || !boundsEqual(targetRect, lastTargetRect)) {

        // position ourselves over the target
        let ownRect = $ownTarget[0].getBoundingClientRect();
        let t = ownTransform($elt[0]);
        $elt.css({
          display: 'initial',
          transform: `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
        });
        $ownTarget.css({
          width: this._matchWidth($ownTarget, targetRect, ownRect),
          minHeight: this._matchHeight($ownTarget, targetRect, ownRect),
        });
        $elt.find('> label').css({
          transform: `translateY(-100%) scale(${1 / this.get('fieldScale')})`
        });
      }
      lastTargetRect = targetRect;
      yield raf();
      while (this.get('lockWhileFocused') && this.get('focused')) {
        yield raf();
      }
    }
  }).on('didInsertElement'),

  reveal: Ember.computed.or('hovered', 'highlighted', 'focused'),

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
