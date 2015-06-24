(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name ds.datepicker.directives:dsDateFormat
   * @restrict EA
   * @require ngModel
   * @param {string} format Date format string, which should be used to display
   *     / parse the date.
   *
   * @description
   * This directive can be used to convert date bindings from / to a special
   *     format. This might be especially interesting for input fields, which
   *     should display a normal date text, but internally work with a date
   *     object.
   */
  angular.module('ds.datepicker')
      .directive('dsDateFormat', function($log, $filter, $dateParser) {
        return {
          restrict: 'EA',
          require: '^ngModel',
          link: function($scope, $element, $attrs, ngModel) {
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
      });
}());
