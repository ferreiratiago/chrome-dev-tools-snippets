// prints out the number of watchers that a DOM Element has
'use strict'

function getTotalWatchers(root) {
  root = angular.element(root);

  function getTotalWatchersFromScope(scope) {
    if(scope && scope.$$watchers) {
        return scope.$$watchers.length;
    }
    return 0;
  }

  function getTotalWatchersFromElem(element) {
    let totalIsolateWatchers = getTotalWatchersFromScope(element.data().$isolateScope);
    let totalScopeWatchers = getTotalWatchersFromScope(element.data().$scope);
    let totalWatchers = totalIsolateWatchers + totalScopeWatchers;

    // goes in for each children
    //  and counts the number of inner watchers
    angular.forEach(element.children(), function (childElement) {
      totalWatchers += getTotalWatchersFromElem(angular.element(childElement));
    });

    return totalWatchers;
  }

  return getTotalWatchersFromElem(root);
}

// 'var' because it runs in the context of the browser
var domElementsCssClass = ['my-css-element'];

var result = domElementsCssClass.map((cssClass) => {
    let allElements = document.getElementsByClassName(cssClass);
    let totalWatchers = getTotalWatchers(allElements[0]);

    return {
        'element': cssClass,
        'watchers': totalWatchers
    };
});

console.table(result);
