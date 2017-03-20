import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('overlay-marks', 'Integration | Component | overlay marks', {
  integration: true
});

test('it yields marks with default group', function(assert) {
  this.render(hbs`
    {{#mark-overlay id="my-mark-id"}}
      <div class="test-target"></div>
    {{/mark-overlay}}
    {{#overlay-marks as |mark|}}
      <div class="test-overlay">{{mark.id}}</div>
    {{/overlay-marks}}
  `);
  assert.equal(this.$('.test-overlay').text(), 'my-mark-id');
});


test('it yields marks with matching group', function(assert) {
  this.render(hbs`
    {{#mark-overlay group="test" id="my-mark-id"}}
      <div class="test-target"></div>
    {{/mark-overlay}}
    {{#overlay-marks group="test" as |mark|}}
      <div class="test-overlay">{{mark.id}}</div>
    {{/overlay-marks}}
  `);
  assert.equal(this.$('.test-overlay').text(), 'my-mark-id');
});

test('it ignores marks with other types', function(assert) {
  this.render(hbs`
    {{#mark-overlay group="other" id="my-mark-id"}}
      <div class="test-target"></div>
    {{/mark-overlay}}
    {{#overlay-marks group="test" as |mark|}}
      <div class="test-overlay">{{mark.id}}</div>
    {{/overlay-marks}}
  `);
  assert.equal(this.$('.test-overlay').length, 0, 'should find none');
});
