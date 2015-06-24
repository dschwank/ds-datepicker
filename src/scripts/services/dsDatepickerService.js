(function() {
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
  angular.module('ds.datepicker')
      .factory('dsDatepickerService', function() {

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
          var tDateArray = [],
              tDayOfWeek;

          date.setDate(1);
          tDayOfWeek = date.getDay();
          date.setDate((tDayOfWeek * -1) + (tDayOfWeek === 0 ? -6 : 1));

          for (var i = 0; i < 42; i++) {
            tDateArray.push(new Date(date.setDate(date.getDate() + 1)));
          }

          return tDateArray;
        }
      });
}());
