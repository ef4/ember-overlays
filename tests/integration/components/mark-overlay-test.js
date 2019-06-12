import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mark overlay', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders and leaks no whitespace', async function(assert) {
    await render(hbs`{{#mark-overlay}}template block text{{/mark-overlay}}`);
    assert.dom('*').hasText('template block text');
  });
});
