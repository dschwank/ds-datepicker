'use strict';
angular.module('ds.datepicker', ['dateParser']);
'use strict';
angular.module('ds.datepicker').directive('dsDateFormat', [
  '$log',
  '$filter',
  '$dateParser',
  function ($log, $filter, $dateParser) {
    return {
      restrict: 'EA',
      require: '^ngModel',
      link: function ($scope, $element, $attrs, ngModel) {
        var tFormatFilter = $filter('date');
        function dateToString(date) {
          return tFormatFilter(date, $attrs.format);
        }
        function stringToDate(string) {
          return $dateParser(string, $attrs.format);
        }
        ngModel.$formatters.push(dateToString);
        ngModel.$parsers.push(stringToDate);
      }
    };
  }
]);
'use strict';
angular.module('ds.datepicker').directive('dsDatepicker', [
  '$document',
  '$log',
  'DatepickerService',
  '$locale',
  function ($document, $log, DatepickerService, $locale) {
    return {
      restrict: 'EA',
      replace: true,
      require: '^ngModel',
      scope: {
        date: '=?ngModel',
        config: '=?'
      },
      link: function (scope, element, attrs, ngModel) {
        scope.dates = [];
        scope.active = false;
        function generateDateValues(date) {
          scope.dates = [];
          date.setDate(1);
          date.setDate(date.getDay() * -1 + 1);
          for (var i = 0; i < 42; i++) {
            scope.dates.push(new Date(date.setDate(date.getDate() + 1)));
          }
        }
        scope.setDate = function (date) {
          scope.date = date;
        };
        scope.add = function () {
          ngModel.$setViewValue(new Date(DatepickerService.increaseDate(scope.date)));
        };
        scope.sub = function () {
          ngModel.$setViewValue(new Date(DatepickerService.decreaseDate(scope.date)));
        };
        scope.addMonth = function () {
          ngModel.$setViewValue(new Date(DatepickerService.increaseMonth(scope.date)));
        };
        scope.subMonth = function () {
          ngModel.$setViewValue(new Date(DatepickerService.decreaseMonth(scope.date)));
        };
        angular.element(element[0].querySelector('.dateInputField')).bind('keydown', function (event) {
          if (event.keyCode === 38) {
            scope.add();
          } else if (event.keyCode === 40) {
            scope.sub();
          }
          scope.$apply();
        });
        scope.$watch(function () {
          return scope.date.getMonth();
        }, function (curMonth) {
          if (curMonth || curMonth === 0) {
            generateDateValues(new Date(scope.date));
          }
        });
      },
      templateUrl: 'src/templates/dsDatepicker.tpl.html'
    };
  }
]);
(function () {
  'use strict';
  angular.module('ds.datepicker').factory('DatepickerService', function () {
    function increaseDate(date, by) {
      return date.setDate(date.getDate() + (by || 1));
    }
    function decreaseDate(date, by) {
      return date.setDate(date.getDate() - (by || 1));
    }
    function decreaseMonth(date, by) {
      return date.setMonth(date.getMonth() - (by || 1));
    }
    function increaseMonth(date, by) {
      return date.setMonth(date.getMonth() + (by || 1));
    }
    return {
      increaseDate: function (date, by) {
        return increaseDate(date, by);
      },
      decreaseDate: function (date, by) {
        return decreaseDate(date, by);
      },
      increaseMonth: function (date, by) {
        return increaseMonth(date, by);
      },
      decreaseMonth: function (date, by) {
        return decreaseMonth(date, by);
      }
    };
  });
}());