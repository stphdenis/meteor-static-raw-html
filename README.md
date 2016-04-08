# static-raw-html

Essentially, an alternative to the `static-html` package that doesn't compile a `template` section alone. Mostly useful if you want to use Aurelia as your view layer and just want to get some static HTML content on your page as a render target for your view framework.

It has been primarly made to use with Aurelia.

It is a fork of `tsumina:meteor-aurelia` but without an `es6` compiler as meteor 3.0 does it for free.
It does not even use SystemJS as there is now a native Meteor loader for Aurelia.
If you want to use typscript, do not add `tsumina:meteor-typescript` as it uses SystemJS loader, take an other one that support Meteor loader natively.

# Aurelia Meteor

[Aurelia](http://aurelia.io) and [Meteor](http://www.meteor.com) power combined.Use Jade and html-minify to speed up your works.

**You must remove `blaze-html-templates` and `spacebars` packages** because this will handle `*.html` files.
Just use:
```bash
$ meteor remove blaze-html-templates spacebars
```

**You have to remove `ecmascript` packages** because this will handle `*.js` files and we need `decorators`.
Just use:
```bash
$ meteor remove ecmascript
```

## Quick start with Aurelia

1. Install [Meteor](http://docs.meteor.com/#quickstart) `$ curl https://install.meteor.com | /bin/sh`
2. Create a new meteor app using `$ meteor create myapp` or navigate to the root of your existing app
3. Install Aurelia and  meteor-typescript:
```bash
$ meteor remove blaze-html-templates spacebars ecmascript
$ meteor add pbastowski:angular-babel
$ meteor add sdenis:static-raw-html
$ meteor add meteortypescript:compiler  # or an other one if you need typescript support
$ npm install --save aurelia-bootstrapper-meteor
# npm install --save "some other third party aurelia libraries"
$ npm dedupe # if necessary
```

## Example
- [Example application](https://github.com/tsumina/aurelia-skeleton-jade) : A **meteor-aurelia** port of [skeleton-navigation](http://github.com/aurelia/skeleton-navigation)

- [Aurelia-TODO-App](https://github.com/TsumiNa/Aurelia-TODO-App) is an simple example to show how to play with typescript and aurelia.

- [aurelia-meteor-todos](https://github.com/Markusxmr/aurelia-meteor-todos) is another one port from advanced meteor todos app by [Markusxmr](https://github.com/Markusxmr). Here to see the [live demo](http://aurelia-todos.meteor.com/)

## Tutorial

Aurelia use conventions to keep code simple and clean, to bootstrap a aurelia app you need a `index.html` or `client/index.html`, include:

```html
<body aurelia-app='client/main'>
</body>
```

The `aurelia-app="client/main"` attribute points to the Aurelia configuration file named main, which is `main.js`.

Assume you use es6 js and html template. In the `client` folder create `main.js` and insert:

```javascript
import 'aurelia-bootstrapper';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration();

  aurelia.start().then(a => a.setRoot('client/app'));
}
```

The `main.js` is the file where the configuration is done to bootstrap Aurelia.

In this case the main file tells where the entry point of the app is located (`client/app`), which means go look for the `app.html`, `app.js` pair in the `client` folder.

By convention Aurelia uses view/view-model pairs of the same name.

In the `client` folder, create `app.html` and insert:

```html
<template>
  <input type="text" placeholder="Your name" value.bind="name">
  <h2>Hello ${name}!</h2>
</template>

```

Then create `app.js` in the `client` folder and insert:

```javascript
export class App {
  constructor(){
    this.name = "";
  }
}
```
