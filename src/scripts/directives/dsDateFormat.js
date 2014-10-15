"use strict";

angular.module('ds.datepicker')
    .directive('dsDateFormat', function($log, $filter, $dateParser){
        return {
            restrict: 'EA',
            require: '^ngModel',
            link: function($scope, $element, $attrs, ngModel) {
                var tFormatFilter = $filter('date');

                function dateToString (date) {
                    return tFormatFilter(date, $attrs.format);
                }

                function stringToDate (string) {
                    return $dateParser(string, $attrs.format);
                }

                ngModel.$formatters.push(dateToString);
                ngModel.$parsers.push(stringToDate);
            }
        }
    });