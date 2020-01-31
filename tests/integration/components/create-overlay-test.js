import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setOwner } from '@ember/application';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';

module('Integration | Component | create overlay', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders without block', async function(assert) {
    await render(hbs`
      {{#mark-overlay id="my-mark-id"}}
        <div class="test-target" style="width: 100px; height: 200px"></div>
      {{/mark-overlay}}
      {{#overlay-marks as |mark|}}
        {{create-overlay at=mark highlighted=true label="my overlay" class="my-overlay"}}
      {{/overlay-marks}}
    `);
    assert.ok(
      [...document.querySelectorAll('label')].find(element =>
        /my overlay/.test(element.textContent)
      )
    );
    let bounds = document
      .querySelector('.my-overlay .target')
      .getBoundingClientRect();
    assert.equal(bounds.width, 100);
    assert.equal(bounds.height, 200);
  });

  test('it renders with user content', async function(assert) {
    await render(hbs`
      {{#mark-overlay id="my-mark-id"}}
        <div class="test-target" style="width: 100px; height: 200px"></div>
      {{/mark-overlay}}
      {{#overlay-marks as |mark|}}
        {{#create-overlay at=mark highlighted=true class="my-overlay"}}
          <div class="user-content"></div>
        {{/create-overlay}}
      {{/overlay-marks}}
    `);
    assert.dom('.user-content').exists({ count: 1 });
    let bounds = document
      .querySelector('.my-overlay .target')
      .getBoundingClientRect();
    assert.equal(bounds.width, 100);
    assert.equal(bounds.height, 200);
  });

  test('it renders with user content taller than underlying mark', async function(assert) {
    await render(hbs`
      {{#mark-overlay id="my-mark-id"}}
        <div class="test-target" style="width: 100px; height: 200px"></div>
      {{/mark-overlay}}
      {{#overlay-marks as |mark|}}
        {{#create-overlay at=mark highlighted=true class="my-overlay"}}
          <div class="user-content" style="height: 300px"></div>
        {{/create-overlay}}
      {{/overlay-marks}}
    `);
    assert.dom('.user-content').exists({ count: 1 });
    let bounds = document
      .querySelector('.my-overlay .target')
      .getBoundingClientRect();
    assert.equal(bounds.width, 100);
    assert.equal(bounds.height, 300);
  });

  test('it renders larger overlays', async function(assert) {
    await render(hbs`
        {{#mark-overlay id="my-mark-id"}}
          <div class="test-target" style="width: 100px; height: 200px"></div>
        {{/mark-overlay}}
        {{#overlay-marks as |mark|}}
          {{create-overlay at=mark highlighted=true expandSizeBy=40 label="my overlay" class="my-overlay"}}
        {{/overlay-marks}}
      `);
    assert.dom('.my-overlay').hasText('my overlay');
    let bounds = document
      .querySelector('.my-overlay .target')
      .getBoundingClientRect();
    assert.equal(bounds.width, 140);
    assert.equal(bounds.height, 240);
  });

  module('custom labels', function(hooks) {
    hooks.beforeEach(function() {
      setOwner(this, this.owner);
      this.owner.register(
        'component:fancy-label',
        Component.extend({
          layout: hbs`<label class="fancy-class">{{label}}</label>`
        })
      );
    });

    test('it renders with a custom label component', async function(assert) {
      await render(hbs`
        {{#mark-overlay id="my-mark-id"}}
          <div class="test-target" style="width: 100px; height: 200px"></div>
        {{/mark-overlay}}
        {{#overlay-marks as |mark|}}
          {{create-overlay at=mark highlighted=true labelComponent=(component "fancy-label" label="A fancy label") class="my-overlay"}}
        {{/overlay-marks}}
      `);
      assert.dom('label').hasText('A fancy label');
      assert.dom('label').hasClass('fancy-class');
    });
  });
});
