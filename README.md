#In place "request in progress" indicator

Add an indicator to any element that starts an Ajax request when clicked. Will not work when long-polling is present!

## Demo

![angular-blocking-click Demo](http://monterail.github.io/angular-blocking-click/images/screencast.gif)

## Install

```
bower install angular-blocking-click
```

## Usage

```js
angular.module('myApp', ['blockingClick']);
```

```css
/* style up the indicator */
.blocking-click .spinner {
  width: 16px;
  height: 11px;
  background-image: url(http://monterail.github.io/angular-blocking-click/images/spinner-small.gif);
}
```

```html
<!-- add blocking-click directive to a button, link or anything else that starts an XML HTTP request on click -->
<form>
  ...
  <input type="submit" value="Save all changes" ng-click="save()" blocking-click>
</form>
```

## More
```html
<!-- blocking-click also supports text instead of an indicator -->
<form>
  ...
  <input type="submit" value="Save all changes" ng-click="save()" blocking-click="Saving your data">
</form>
```