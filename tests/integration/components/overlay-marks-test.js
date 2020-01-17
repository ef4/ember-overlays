import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | overlay marks', function(hooks) {
  setupRenderingTest(hooks);

  test('it yields marks with default group', async function(assert) {
    await render(hbs`
      {{#mark-overlay id="my-mark-id"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#overlay-marks as |mark|}}
        <div class="test-overlay">{{mark.id}}</div>
      {{/overlay-marks}}
    `);
    assert.dom('.test-overlay').hasText('my-mark-id');
  });

  test('it yields marks with matching group', async function(assert) {
    await render(hbs`
      {{#mark-overlay group="test" id="my-mark-id"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#overlay-marks group="test" as |mark|}}
        <div class="test-overlay">{{mark.id}}</div>
      {{/overlay-marks}}
    `);
    assert.dom('.test-overlay').hasText('my-mark-id');
  });

  test('it ignores marks with other types', async function(assert) {
    await render(hbs`
      {{#mark-overlay group="other" id="my-mark-id"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#overlay-marks group="test" as |mark|}}
        <div class="test-overlay">{{mark.id}}</div>
      {{/overlay-marks}}
    `);
    assert.dom('.test-overlay').doesNotExist('should find none');
  });

  test('it renders the marks in the order they are registered', async function(assert) {
    await render(hbs`
      {{#mark-overlay group="other" id="my-mark-id-1"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#mark-overlay group="other" id="my-mark-id-2"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#overlay-marks group="other" as |mark|}}
        <div class="test-overlay">{{mark.id}}</div>
      {{/overlay-marks}}
    `);
    assert.dom('.test-overlay').exists({ count: 2 });
    assert.dom('.test-overlay').hasText('my-mark-id-1');
    assert.dom('.test-overlay~.test-overlay').hasText('my-mark-id-2');
  });

  test('it reverses the order of the marks', async function(assert) {
    await render(hbs`
      {{#mark-overlay group="other" id="my-mark-id-1"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#mark-overlay group="other" id="my-mark-id-2"}}
        <div class="test-target"></div>
      {{/mark-overlay}}
      {{#overlay-marks group="other" reverseOrder=true as |mark|}}
        <div class="test-overlay">{{mark.id}}</div>
      {{/overlay-marks}}
    `);
    assert.dom('.test-overlay').exists({ count: 2 });
    assert.dom('.test-overlay').hasText('my-mark-id-2');
    assert.dom('.test-overlay~.test-overlay').hasText('my-mark-id-1');
  });
});
