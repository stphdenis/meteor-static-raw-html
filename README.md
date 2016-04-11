# static-raw-html

Essentially, an alternative to the `static-html` package that doesn't compile a `<template>` section alone. Mostly useful if you want to use Aurelia as your view layer and just want to get some static HTML content on your page as a render target for your view framework.

It is a fork of [`tsumina:meteor-aurelia`](https://atmospherejs.com/tsumina/meteor-aurelia) but without an `es6` compiler.
It does not even use SystemJS as there is now a native [Meteor loader for Aurelia](https://atmospherejs.com/sdenis/aurelia).

**You must remove `blaze-html-templates` and `spacebars` packages** because this will handle `*.html` files and replace it by [`sdenis:static-raw-html`](https://atmospherejs.com/sdenis/static-raw-html).

```bash
$ meteor remove blaze-html-templates spacebars
$ meteor add sdenis:static-raw-html
```
