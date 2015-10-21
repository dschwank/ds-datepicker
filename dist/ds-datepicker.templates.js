(function(module) {
try {
  module = angular.module('ds.templates');
} catch (e) {
  module = angular.module('ds.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('src/templates/dsDatepicker.tpl.html',
    '<div class="dsDatepicker"><div class="l-input"><input class="datepicker-inputField boxBorder" type="text" ds-date-format="" format="{{config.dateFormat}}" ng-model="date" ng-change="setDate(date)" ng-disabled="disabled"><div class="datepicker-opener-group boxBorder"><button class="datepicker-opener-btn datepicker-icon" ng-click="flipPickerState($event)" ng-disabled="disabled"></button></div></div><div ng-if="pickerState" class="l-datepicker boxBorder" ng-click="$event.stopPropagation()"><div class="interactionArea"><div class="month-decrease"><div ng-click="subMonth()" class="arrow arrow-left"></div></div><div class="pickerDate"><span id="curDate">{{date | date:(config.pickerFormat || config.dateFormat)}}</span></div><div class="month-increase"><div ng-click="addMonth()" class="arrow arrow-right"></div></div></div><div class="datepicker-table"><div class="datepicker-table-header"><div class="datepicker-table-row"><div class="datepicker-table-head" ng-repeat="day in [0, 1, 2, 3, 4, 5, 6]">{{dates[day] | date:\'EEE\'}}</div></div></div><div class="datepicker-table-body"><div class="datepicker-table-row" ng-repeat="week in [0, 1, 2, 3, 4, 5]"><div class="datepicker-day" ng-repeat="day in [1, 2, 3, 4, 5, 6, 7]" ng-click="setDate(dates[(week * 7) + day - 1])" ng-class="{otherMonth: dates[(week * 7) + day - 1].getMonth() !== date.getMonth(), selected: (dates[(week * 7) + day - 1].getDate() === date.getDate()) && (dates[(week * 7) + day - 1].getMonth() === date.getMonth())}">{{dates[(week * 7) + day - 1] | date:\'dd\'}}</div></div></div></div></div></div>');
}]);
})();
