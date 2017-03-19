import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mark-overlay', 'Integration | Component | mark overlay', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mark-overlay}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mark-overlay}}
      template block text
    {{/mark-overlay}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
