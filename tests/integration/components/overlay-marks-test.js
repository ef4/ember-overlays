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

test('it renders the marks in the order they are registered', function(assert) {
  this.render(hbs`
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
  assert.equal(this.$('.test-overlay').length, 2, 'finds 2 marks');
  assert.equal(this.$('.test-overlay').first().text(), 'my-mark-id-1', 'finds 1 mark first');
  assert.equal(this.$('.test-overlay').last().text(), 'my-mark-id-2', 'finds 2 mark second');
});

test('it reverses the order of the marks', function(assert) {
  this.render(hbs`
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
  assert.equal(this.$('.test-overlay').length, 2, 'finds 2 marks');
  assert.equal(this.$('.test-overlay').first().text(), 'my-mark-id-2', 'finds 2nd mark first');
  assert.equal(this.$('.test-overlay').last().text(), 'my-mark-id-1', 'finds 1st mark second');
});
