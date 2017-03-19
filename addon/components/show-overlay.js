import Ember from 'ember';
import layout from '../templates/components/show-overlay';
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

    for (;;) {

      // I'm deliberately introducing a scope per animation frame so
      // that local variables like targetRect can be scoped to a
      // single frame.
      {
        // stay hidden until we have a target
        let targetRect = yield* this._waitForTargetRect();

        // position ourselves over the target
        let ownRect = $ownTarget[0].getBoundingClientRect();
        let t = ownTransform($elt[0]);
        $elt.css({
          display: 'initial',
          width: this._matchWidth($elt, targetRect, ownRect),
          height: this._matchHeight($elt, targetRect, ownRect),
          transform: `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
        });
        $elt.find('> label').css({
          transform: `translateY(-100%) scale(${1 / this.get('fieldScale')})`
        });

        yield raf();
      }

      let targetRect = this._targetRect();
      let ownRect = $ownTarget[0].getBoundingClientRect();

      if (targetRect && this.get('isOpen') && this.get('hasEditor')) {
        // when editing, scale up to at least 80%.
        let scale = Math.max(0.8, this.get('fieldScale'));
        let t = ownTransform($elt[0]);

        // adjust scale and positioning one last time
        $elt.css({
          width: this._matchWidth($elt, targetRect, ownRect),
          height: this._matchHeight($elt, targetRect, ownRect),
          minHeight: this._matchHeight($elt, targetRect, ownRect),
          transform: `${this._translation(targetRect, ownRect, t)} scale(${scale})`
        });
        $elt.find('> label').css({
          transform: `translateY(-100%) scale(${1 / scale })`
        });

        yield raf();

        // switch to free floating height
        $elt.css({
          height: 'auto'
        });

        // And then sit around not messing with positioning while the user is working
        while (this._targetRect() && this.get('isOpen') && this.get('hasEditor')) {
          yield raf();
        }
      }

      // as long as we have a target and are not doing editing, track closely
      while ((targetRect = this._targetRect()) && !(this.get('isOpen') && this.get('hasEditor'))) {
        let ownRect = $ownTarget[0].getBoundingClientRect();
        if (!boundsEqual(targetRect, ownRect)) {
          let t = ownTransform($elt[0]);
          $elt.css({
            width: this._matchWidth($elt, targetRect, ownRect),
            height: this._matchHeight($elt, targetRect, ownRect),
            transform: `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
          });
          $elt.find('> label').css({
            transform: `translateY(-100%) scale(${1 / this.get('fieldScale') })`
          });
        }
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
