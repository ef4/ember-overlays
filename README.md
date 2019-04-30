# ember-overlays

This addon provides three components that work together to provide positioned overlays on top of your existing content.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

First, you mark up a location that you may want to overlay:

```hbs
I can {{#mark-overlay id="example"}}mark up{{/mark-overlay}} anything, even plain text nodes.
```

You must provide an `id` so that you can refer to this mark in order to actually draw an overlay over it.

You may also optionally provide a `group`, which is an arbitrary string that can also be used filter which marks you will show. Addon authors are encouraged to use `group` so they don't collide with others.

You may also optionally set a `model` on the mark, which will be available when you're showing an overlay over it (see below).

## overlay-marks

The `overlay-marks` component provides access to the all the marks that are currently rendered. It yields them to you, and then you decide how and if to show them. You can optionally filter by `group` and/or `id`.

```hbs
{{#overlay-marks group="my-fancy-marks" as |mark|}}
  {{#create-overlay at=mark label=mark.model.name highlighted=showOverlay}}
    Overlay content
  {{/create-overlay}}
{{/overlay-marks}}
```

The values you are given here have the `id`, `group`, and `model` you provided via `mark-overlay`.

## create-overlay

To actually render an overlay, you pass one of the marks to `create-overlay`. It takes the following options:

 - at: the mark on which to render.
 - label: an optional text label to render above the overlay.
 - class: optional DOM classes that will be set on the overlay (this works like any other Ember component)
 - hoverable: if true, this overlay will become visible when hovered.
 - highlighted: when true, this overlay will be visible.
 - focused: when true, a dark scrim will appear around this overlay, blocking out the rest of your app.
 - lockWhileFocused: if true, the overlay will stop tracking its mark while focused. This can prevent annoying behaviors if the user is interacting with the overlay and the underlying mark moves. If false, the overlay will constantly move to track its mark.
 - onclick: an action that will fire if the overlay is clicked.
 - dismiss: an action that will fire if the overlay is focused and the user clicks outside the overlay, on the scrim.

# Demo app

This repo's dummy app has a working demo page.

# Contributing / Testing / Building

See the [Contributing](CONTRIBUTING.md) guide for details.

