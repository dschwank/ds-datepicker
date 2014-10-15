(function(module) {
try {
  module = angular.module('ds.templates');
} catch (e) {
  module = angular.module('ds.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('src/templates/dsDatepicker.tpl.html',
    '<div class="dsDatepicker"><div class="l-input"><input class="dateInputField" type="text" ds-date-format="" format="{{config.dateFormat}}" ng-model="date" ng-click="active = !active"></div><div class="l-datepicker" ng-class="{hidden: !active}"><div class="interactionArea"><span ng-click="subMonth()" class="btn"><<</span> <span ng-click="sub()" class="btn"><</span> <span id="curDate" class="btn">{{date | date:config.dateFormat }}</span> <span id="nextDayBtn" ng-click="add()" class="btn">></span> <span ng-click="addMonth()" class="btn">>></span> <span style="float: right;" class="btn" ng-click="active = !active">X</span></div><table><thead><tr class="dayHeader week"><th class="day" ng-repeat="week in [0, 1, 2, 3, 4, 5, 6]">{{dates[week] | date:\'EEE\'}}</th></tr></thead><tbody><tr class="week" ng-repeat="week in [0, 1, 2, 3, 4, 5]"><td class="day btn" ng-repeat="day in [1, 2, 3, 4, 5, 6, 7]" ng-click="setDate(dates[(week * 7) + day - 1])" ng-class="{otherMonth: dates[(week * 7) + day - 1].getMonth() !== date.getMonth(), today: (dates[(week * 7) + day - 1].getDate() === date.getDate()) && (dates[(week * 7) + day - 1].getMonth() === date.getMonth())}">{{dates[(week * 7) + day - 1] | date:\'dd\'}}</td></tr></tbody></table></div></div>');
}]);
})();
