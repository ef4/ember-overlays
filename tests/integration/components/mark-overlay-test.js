import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mark-overlay', 'Integration | Component | mark overlay', {
  integration: true
});

test('it renders and leaks no whitespace', function(assert) {
  this.render(hbs`{{#mark-overlay}}template block text{{/mark-overlay}}`);
  assert.equal(this.$().text(), 'template block text');
});
