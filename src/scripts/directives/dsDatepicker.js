(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name ds.datepicker.directives:dsDatepicker
   * @restrict EA
   * @require ngModel
   * @scope
   * @param {object=} ngModel Date model value, which should be used for the
   *     datepicker.
   * @param {object=} config Configuration for the datepicker. The following
   *     configuration properties are possible:
   *
   *     | Property | Type           | Description |
   *     | -------- | -------------- | ----------- |
   *     | dateFormat   | {@type string} | Format string for the way we should display the date string |
   *     | pickerFormat  | {@type string} | Format string for the way we should display the date string in the picker header. If this property is not set, it will use the `dateFormat` property. For example, use `'MMMM yy'` to display the name of the month and a two digits year value. |
   * @param {boolean=} disabled Identifier if the datepicker should be disabled (`true`) or not (`false`).
   *
   * @description
   * This directive can be used for a simple datepicker.
   */
  angular.module('ds.datepicker')
      .directive('dsDatepicker', function($document, $log, dsDatepickerService, $locale) {
        return {
          restrict: 'EA',
          require: '^ngModel',
          controller: 'dsDatepickerCtrl',
          scope: {
            date: '=?ngModel',
            config: '=?'
          },
          link: function(scope, element, attrs, ngModel) {

            /**
             * @ngdoc property
             * @name disbaled
             * @propertyOf ds.datepicker.directives:dsDatepicker
             * @return {boolean} Identifier if the datepicker should be disabled.
             */
            scope.disabled = false;

            /**
             * @ngdoc property
             * @name dates
             * @propertyOf ds.datepicker.directives:dsDatepicker
             * @return {Array} An array containing all dates for the current
             *     month and the dates around, which can be displayed in the
             *     datepicker.
             */
            scope.dates = [];

            /**
             * @ngdoc property
             * @name currentDate
             * @propertyOf ds.datepicker.directives:dsDatepicker
             * @return {Date} The currently selected date.
             */
            scope.currentDate = undefined;

            /**
             * @ngdoc method
             * @name setDate
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @param {Date} date Date value which should be set as view value
             *     / model value.
             * @description
             * Set the date model value.
             */
            scope.setDate = function setDate(date) {
              ngModel.$setViewValue(date);
            };

            /**
             * @ngdoc method
             * @name addDate
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @description
             * Increase the current date by one.
             */
            scope.addDate = function addDate() {
              ngModel.$setViewValue(new Date(dsDatepickerService.increaseDate(scope.date)));
            };

            /**
             * @ngdoc method
             * @name subDate
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @description
             * Subtract the current date by one.
             */
            scope.subDate = function subDate() {
              ngModel.$setViewValue(new Date(dsDatepickerService.decreaseDate(scope.date)));
            };

            /**
             * @ngdoc method
             * @name addMonth
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @description
             * Increase the current month by one.
             */
            scope.addMonth = function() {
              ngModel.$setViewValue(new Date(dsDatepickerService.increaseMonth(scope.date)));
            };

            /**
             * @ngdoc method
             * @name subMonth
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @description
             * Subtract the current month by one.
             */
            scope.subMonth = function() {
              ngModel.$setViewValue(new Date(dsDatepickerService.decreaseMonth(scope.date)));
            };

            function updateDateArray(date) {
              var tDate;

              tDate = new Date(date);

              if(!scope.currentDate || tDate.getMonth() != scope.currentDate.getMonth()) {
                scope.dates = dsDatepickerService.generateDateArray(new Date(date));
              }

              scope.currentDate = tDate;
            }

            (function init() {
              // add ngModel formatter and parser
              ngModel.$formatters.push(function(value) {
                updateDateArray(value);
                return value;
              });

              ngModel.$parsers.push(function(value) {
                updateDateArray(value);
                return value;
              });

              // init the key listener
              angular.element(element[0].querySelector('.datepicker-inputField'))
                  .bind('keydown', function(event) {
                    if (event.keyCode === 38) {
                      scope.addDate();
                    } else if (event.keyCode === 40) {
                      scope.subDate();
                    }
                    scope.$apply();
                  });

              // add observer for the disabled attribute
              attrs.$observe('disabled', function(value) {
                scope.disabled = value;
              });
            }());

          },
          templateUrl: 'src/templates/dsDatepicker.tpl.html'
        };
      });
}());
