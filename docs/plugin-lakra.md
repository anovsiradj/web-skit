# Lakra.js Documentation

## Overview
Lakra is a simple, declarative, browser-native reactive library. It binds state to the DOM without build tools, using modern JavaScript features and lightweight directives.

## Core Features
- Proxy-based reactivity with lazy wrapping and WeakMap proxy caching.
- Array mutation interception to trigger UI updates.
- DOM compiler that processes directives recursively, including inside Shadow DOM.
- Automatic directive bootstrapping for dynamically added elements via MutationObserver.
- Scope inheritance for loops using `Object.create`.

## Directives
- `data-$each` + `data-$iden`: Loop rendering with local item identifier and `$index`.
- `data-$text`: Bind text content.
- `data-$html`: Bind HTML content.
- `data-$bind`: Two-way bind for inputs (supports checkbox/radio).
- `data-$attach` + `data-$handle`: Attach event listeners and call handlers.

## v0 Summary
- Proxy-based reactivity for property access/set.
- Array methods intercepted: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.
- WeakMap proxy caching for identity stability.
- Lazy reactivity prevents deep/circular recursion issues.
- Full directive implementation (`data-$each`, `data-$iden`, `data-$text`, `data-$html`, `data-$bind`, `data-$attach`, `data-$handle`).
- Test harness improvements in `tests/plugin-lakra.php`: create/update logic, directive syntax, accessibility.
- Verification on `http://localhost:5080/anoop/web-skit/tests/plugin-lakra.php` covering initial render, add/edit/delete.
- Key decisions: native JS focus, recursive compilation, scope inheritance.

## v1 Summary
- Shadow DOM support: compile directives inside `shadowRoot` when present.
  - Option `compileShadowRoot: true` (default).
  - Code references: `plugins/lakra.js:223`.
- Automatic DOM observation: `MutationObserver` compiles nodes on add/attribute change.
  - Option `observeDom: true` (default).
  - Attribute filter: `data-$each`, `data-$iden`, `data-$text`, `data-$html`, `data-$bind`, `data-$attach`, `data-$handle`.
  - Code references: `plugins/lakra.js:268`.
- Duplicate compilation guard via `_lakra_compiled`.
  - Code references: `plugins/lakra.js:106`.
- Configurable constructor options:
  - `new Lakra(selector, initialState = {}, options = {})`
  - Defaults: `{ observeDom: true, compileShadowRoot: true }`
  - Code references: `plugins/lakra.js:24`.
- Reactivity retained:
  - Proxy core: `plugins/lakra.js:49`
  - Effects: `plugins/lakra.js:80`
- Verification:
  - Dynamic binding check with appended `<p data-$text="form.username">` updates immediately.
  - List operations continue to work.

## Usage
```js
new Lakra('#widget', initialState)
```
```js
new Lakra('#widget', initialState, { observeDom: false })
```
```js
new Lakra('#widget', initialState, { compileShadowRoot: false })
```

## Notes
- Proxy drives state -> UI updates; observers handle dynamic DOM -> directive bootstrapping.
- Shadow DOM compilation enables Lakra in web components while preserving scope resolution.

