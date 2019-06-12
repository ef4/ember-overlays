import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

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
    assert.equal(this.$('label:contains(my overlay)').length, 1);
    assert.equal(this.$('.my-overlay .target').width(), 100);
    assert.equal(this.$('.my-overlay .target').height(), 200);
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
    assert.equal(this.$('.my-overlay .target').width(), 100);
    assert.equal(this.$('.my-overlay .target').height(), 200);
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
    assert.equal(this.$('.my-overlay .target').width(), 100);
    assert.equal(this.$('.my-overlay .target').height(), 300);
  });
});
