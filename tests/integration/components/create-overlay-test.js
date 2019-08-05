import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';

moduleForComponent('create-overlay', 'Integration | Component | create overlay', {
  integration: true
});

test('it renders without block', function(assert) {
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target" style="width: 100px; height: 200px"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      {{create-overlay at=mark highlighted=true label="my overlay" class="my-overlay"}}
    {{/overlay-marks}}
  `);
  assert.equal(this.$('label:contains(my overlay)').length, 1);
  assert.equal(this.$('.my-overlay .target').width(), 110);
  assert.equal(this.$('.my-overlay .target').height(), 210);
});

test('it renders with a custom label component', function(assert) {
  this.register('component:fancy-label', Component.extend({
    didReceiveAttrs() {
      assert.equal(this.get('label'), 'A fancy label');
    },
    layout: hbs`<label class="fancy-class">{{label}}</label>`,
  }));
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target" style="width: 100px; height: 200px"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      {{create-overlay at=mark highlighted=true labelComponent=(component "fancy-label" label="A fancy label") class="my-overlay"}}
    {{/overlay-marks}}
  `);
  assert.equal(this.$('label:contains(A fancy label)').length, 1);
  assert.equal(this.$('label.fancy-class').length, 1);
});

test('it renders with user content', function(assert) {
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target" style="width: 100px; height: 200px"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      {{#create-overlay at=mark highlighted=true class="my-overlay"}}
        <div class="user-content"></div>
      {{/create-overlay}}
    {{/overlay-marks}}
  `);
  assert.equal(this.$('.user-content').length, 1);
  assert.equal(this.$('.my-overlay .target').width(), 110);
  assert.equal(this.$('.my-overlay .target').height(), 210);
});

test('it renders with user content taller than underlying mark', function(assert) {
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target" style="width: 100px; height: 200px"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      {{#create-overlay at=mark highlighted=true class="my-overlay"}}
        <div class="user-content" style="height: 300px"></div>
      {{/create-overlay}}
    {{/overlay-marks}}
  `);
  assert.equal(this.$('.user-content').length, 1);
  assert.equal(this.$('.my-overlay .target').width(), 110);
  assert.equal(this.$('.my-overlay .target').height(), 300);
});

test('it renders larger overlays', function(assert) {
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target" style="width: 100px; height: 200px"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      {{create-overlay at=mark highlighted=true expandSizeBy=40 label="my overlay" class="my-overlay"}}
    {{/overlay-marks}}
  `);
  assert.equal(this.$('label:contains(my overlay)').length, 1);
  assert.equal(this.$('.my-overlay .target').width(), 140);
  assert.equal(this.$('.my-overlay .target').height(), 240);
});
