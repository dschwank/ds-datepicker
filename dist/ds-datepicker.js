'use strict';
/**
 * @ngdoc overview
 * @name ds.datepicker
 * @description
 * Datepicker.
 */
angular.module('ds.datepicker', ['dateParser']);
(function () {
  'use strict';
  /**
   * @ngdoc controller
   * @name ds.datepicker.controllers:dsDatepickerCtrl
   * @description
   * Controller for the {@link ds.datepicker.directives:dsDatepicker
   *     `dsDatepicker`}.
   */
  angular.module('ds.datepicker').controller('dsDatepickerCtrl', [
    '$scope',
    '$document',
    '$log',
    function ($scope, $document, $log) {
      var mCloseListener;
      /**
         * @ngdoc property
         * @name pickerState
         * @propertyOf ds.datepicker.controllers:dsDatepickerCtrl
         * @return {boolean} Current state of the datepicker - either it is
         *     open (`true`) or not (`false`).
         */
      $scope.pickerState = false;
      /**
         * @ngdoc method
         * @name flipPickerState
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         * @param {Event} event Click event to flip the picker state.
         * @description
         * Flip the state of the datepicker - if the {@link
         *     ds.datepicker.controllers:dsDatepickerCtrl#properties_pickerState
         *     `pickerState`} is true, the picker will be closed - otherwise
         *     opened.
         */
      $scope.flipPickerState = function flipPickerState(event) {
        if ($scope.pickerState) {
          $scope.disablePicker(event);
        } else {
          $scope.enablePicker(event);
        }
      };
      /**
         * @ngdoc method
         * @name enablePicker
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         * @param {Event} event Click event for the enabling.
         * @description
         * Enable / Open the datepicker.
         */
      $scope.enablePicker = function enablePicker(event) {
        $scope.pickerState = true;
        if (!mCloseListener) {
          var tInitialized = false;
          mCloseListener = function () {
            if (tInitialized) {
              $scope.disablePicker();
              $scope.$digest();
            } else {
              tInitialized = true;
            }
          };
          $document.on('click', mCloseListener);
        }
      };
      /**
         * @ngdoc method
         * @name disablePicker
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         * @description
         * Disable / Close the datepicker.
         */
      $scope.disablePicker = function disablePicker() {
        $scope.pickerState = false;
        if (mCloseListener) {
          $document.off('click', mCloseListener);
          mCloseListener = undefined;
        }
      };
    }
  ]);
}());
(function () {
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
}());
(function () {
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
   *     | format   | {@type string} | Format string for the way we should display the date string |
   *
   * @description
   * This directive can be used for a simple datepicker.
   */
  angular.module('ds.datepicker').directive('dsDatepicker', [
    '$document',
    '$log',
    'dsDatepickerService',
    '$locale',
    function ($document, $log, dsDatepickerService, $locale) {
      return {
        restrict: 'EA',
        require: '^ngModel',
        controller: 'dsDatepickerCtrl',
        scope: {
          date: '=?ngModel',
          config: '=?'
        },
        link: function (scope, element, attrs, ngModel) {
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
          scope.addMonth = function () {
            ngModel.$setViewValue(new Date(dsDatepickerService.increaseMonth(scope.date)));
          };
          /**
             * @ngdoc method
             * @name subMonth
             * @methodOf ds.datepicker.directives:dsDatepicker
             * @description
             * Subtract the current month by one.
             */
          scope.subMonth = function () {
            ngModel.$setViewValue(new Date(dsDatepickerService.decreaseMonth(scope.date)));
          };
          function updateDateArray(date) {
            var tDate;
            tDate = new Date(date);
            if (!scope.currentDate || tDate.getMonth() != scope.currentDate.getMonth()) {
              scope.dates = dsDatepickerService.generateDateArray(new Date(date));
            }
            scope.currentDate = tDate;
          }
          (function init() {
            // add ngModel formatter and parser
            ngModel.$formatters.push(function (value) {
              updateDateArray(value);
              return value;
            });
            ngModel.$parsers.push(function (value) {
              updateDateArray(value);
              return value;
            });
            // init the key listener
            angular.element(element[0].querySelector('.datepicker-inputField')).bind('keydown', function (event) {
              if (event.keyCode === 38) {
                scope.addDate();
              } else if (event.keyCode === 40) {
                scope.subDate();
              }
              scope.$apply();
            });
          }());
        },
        templateUrl: 'src/templates/dsDatepicker.tpl.html'
      };
    }
  ]);
}());
(function () {
  'use strict';
  /**
   * @ngdoc service
   * @name ds.datepicker.dsDatepickerService
   * @description
   * This service provides several helper methods for the {@link
      *     ds.datepicker.directives:dsDatepicker `dsDatepicker`}.
   *     ```
   *      var tTest;
   *      tTest = 42;
   *      tTest = 'Yeah';
   *     ```
   *
   *     ```js
   *      var tTest;
   *      tTest = 42;
   *      tTest = 'Yeah';
   *     ```
   *
   *     ```+js
   *      var tTest;
   *      tTest = 42;
   *      tTest = 'Yeah';
   *     ```
   *
   *     ```-js
   *      var tTest;
   *      tTest = 42;
   *      tTest = 'Yeah';
   *     ```
   */
  angular.module('ds.datepicker').factory('dsDatepickerService', function () {
    var mPublicApi;
    mPublicApi = {
      increaseDate: increaseDate,
      decreaseDate: decreaseDate,
      increaseMonth: increaseMonth,
      decreaseMonth: decreaseMonth,
      generateDateArray: generateDateArray
    };
    return mPublicApi;
    /* ##################
         * ### PUBLIC API ###
         * ################## */
    /**
         * @ngdoc method
         * @name increaseDate
         * @methodOf ds.datepicker.dsDatepickerService
         * @param {Date} date Date which should be increased by a special day
         *     count.
         * @param {number=} opt_by Count of day which should be added to the
         *     given date.
         * @return {Date} Returns the date, increased by the given value.
         * @description
         * Increase the given date by a specific value. If the `by`-value is
         *     not set, the date will be increased by one.
         *
         */
    function increaseDate(date, opt_by) {
      return date.setDate(date.getDate() + (opt_by || 1));
    }
    /**
         * @ngdoc method
         * @name decreaseDate
         * @methodOf ds.datepicker.dsDatepickerService
         * @param {Date} date Date which should be decreased by a special day
         *     count.
         * @param {number=} opt_by Count of day which should be subtracted from
         *     the given date.
         * @return {Date} Returns the date, decreased by the given value.
         * @description
         * Decrease the given date by a specific value. If the `by`-value is
         *     not set, the date will be decreased by one.
         */
    function decreaseDate(date, opt_by) {
      return date.setDate(date.getDate() - (opt_by || 1));
    }
    /**
         * @ngdoc method
         * @name decreaseMonth
         * @methodOf ds.datepicker.dsDatepickerService
         * @param {Date} date Date which should be decreased by a special month
         *     count.
         * @param {number=} opt_by Count of month which should be subtracted
         *     from the given date.
         * @return {Date} Returns the date, decreased by the given value.
         * @description
         * Decrease the given date by a specific value. If the `by`-value is
         *     not set, the date will be decreased by one.
         */
    function decreaseMonth(date, opt_by) {
      return date.setMonth(date.getMonth() - (opt_by || 1));
    }
    /**
         * @ngdoc method
         * @name increaseMonth
         * @methodOf ds.datepicker.dsDatepickerService
         * @param {Date} date Date which should be increased by a special month
         *     count.
         * @param {number=} opt_by Count of month which should be added to the
         *     given date.
         * @return {Date} Returns the date, increased by the given value.
         * @description
         * Increase the given date by a specific value. If the `by`-value is
         *     not set, the date will be increased by one.
         *
         */
    function increaseMonth(date, opt_by) {
      return date.setMonth(date.getMonth() + (opt_by || 1));
    }
    /**
         * @ngdoc method
         * @name generateDateArray
         * @methodOf ds.datepicker.dsDatepickerService
         * @param {Date} date Current date - the array will be generated for
         *     the month of this date.
         * @return {Array} Returns an array containing dates for 42 dates -
         *     this is equal to 6 weeks. 6 weeks are necessary to display all
         *     possible day combinations.
         * @description
         * Generate an array for the month of the given date. The resulting
         *     array will contain 42 days, such that we can display all
         *     possible day combinations for one month.
         */
    function generateDateArray(date) {
      var tDateArray = [], tDayOfWeek;
      date.setDate(1);
      tDayOfWeek = date.getDay();
      date.setDate(tDayOfWeek * -1 + (tDayOfWeek === 0 ? -6 : 1));
      for (var i = 0; i < 42; i++) {
        tDateArray.push(new Date(date.setDate(date.getDate() + 1)));
      }
      return tDateArray;
    }
  });
}());