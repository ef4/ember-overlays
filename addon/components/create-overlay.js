import { or, and } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/create-overlay';
import raf from '../raf';
import { ownTransform } from '../transform';
import { task } from 'ember-concurrency';
import { boundsEqual } from '../bounds';
import scrimFader from '../scrim-fader';

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

  _translation(targetRect, ownRect, currentTransform, expandSizeBy) {
    return `translateX(${targetRect.left - ownRect.left + currentTransform.tx - (expandSizeBy ? expandSizeBy / 2 : 5)}px) translateY(${targetRect.top - ownRect.top + currentTransform.ty - (expandSizeBy ? expandSizeBy / 2 : 5)}px)`;
  },

  _matchWidth($elt, targetRect, ownRect, expandSizeBy) {
    return `${$elt.outerWidth() + targetRect.right - targetRect.left - ownRect.right + ownRect.left + (expandSizeBy ? expandSizeBy : 10)}px`;
  },

  _matchHeight($elt, targetRect, ownRect, expandSizeBy) {
    return `${$elt.outerHeight() + targetRect.bottom - targetRect.top - ownRect.bottom + ownRect.top + (expandSizeBy ? expandSizeBy : 10)}px`;
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
        const expandSizeBy = this.get('expandSizeBy');

        $elt.css({
          display: 'initial',
          transform: `${this._translation(targetRect, ownRect, t, expandSizeBy)} scale(${this.get('fieldScale')})`
        });

        $ownTarget.css({
          width: this._matchWidth($ownTarget, targetRect, ownRect, expandSizeBy),
          minHeight: this._matchHeight($ownTarget, targetRect, ownRect, expandSizeBy),
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

  reveal: or('hoveredAndHoverable', 'highlighted', 'focused'),
  hoveredAndHoverable: and('hovered', 'hoverable'),

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
