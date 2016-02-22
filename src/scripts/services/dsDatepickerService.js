(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name ds.datepicker.dsDatepickerService
   * @description
   */
  angular.module('ds.datepicker')
      .factory('dsDatepickerService', function () {

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
         *
         * @description
         * Increase the given date by a specific value. If the `by`-value is not set, the date will be increased by one.
         *
         * @param {Date} date Date which should be increased by a special day count.
         * @param {Number=} opt_by Count of days which should be added to the given date.
         *
         * @return {Date} Returns a copy of the date, increased by the given value.
         */
        function increaseDate(date, opt_by) {
          return _modifyDate(date, 'day', opt_by || 1);
        }

        /**
         * @ngdoc method
         * @name decreaseDate
         * @methodOf ds.datepicker.dsDatepickerService
         *
         * @description
         * Decrease the given date by a specific value. If the `by`-value is not set, the date will be decreased by one.
         *
         * @param {Date} date Date which should be decreased by a special day count.
         * @param {Number=} opt_by Count of days which should be subtracted from the given date.
         *
         * @return {Date} Returns a copy of the date, decreased by the given value.
         */
        function decreaseDate(date, opt_by) {
          return _modifyDate(date, 'day', (opt_by || 1) * -1);;
        }

        /**
         * @ngdoc method
         * @name decreaseMonth
         * @methodOf ds.datepicker.dsDatepickerService
         *
         * @description
         * Decrease the given date by a specific value. If the `by`-value is not set, the date will be decreased by one.
         *
         * @param {Date} date Date which should be decreased by a special month count.
         * @param {Number=} opt_by Count of month which should be subtracted from the given date.
         *
         * @return {Date} Returns a copy of the date, decreased by the given value.
         */
        function decreaseMonth(date, opt_by) {
          return _modifyDate(date, 'month', (opt_by || 1) * -1);
        }

        /**
         * @ngdoc method
         * @name increaseMonth
         * @methodOf ds.datepicker.dsDatepickerService
         *
         * @description
         * Increase the given date by a specific value. If the `by`-value is not set, the date will be increased by one.
         *
         * @param {Date} date Date which should be increased by a special month count.
         * @param {number=} opt_by Count of month which should be added to the given date.
         *
         * @return {Date} Returns a copy of the date, increased by the given value.
         */
        function increaseMonth(date, opt_by) {
          return _modifyDate(date, 'month', opt_by || 1);
        }

        /**
         * @ngdoc method
         * @name generateDateArray
         * @methodOf ds.datepicker.dsDatepickerService
         *
         * @description
         * Generate an array for the month of the given date. The resulting array will contain 42 days, such that we can
         * display all possible day combinations for one month.
         *
         * @param {Date} opt_date Current date - the array will be generated for the month of this date. If the date is
         *        not set, the method will us the current date.
         *
         * @return {Array} Returns an array containing dates for 42 dates - this is equal to 6 weeks. 6 weeks are
         *         necessary to display all possible day combinations.
         */
        function generateDateArray(opt_date) {
          var tDateArray = [],
              tMoment,
              tDayOfWeek;

          if(angular.isDate(opt_date) || moment(opt_date.unix()).isValid()) {

            tMoment = moment(opt_date);

            // set to the first date of month
            tMoment.set('date', 1);

            // determine the day of week - subtract the current date by that value, to start on a monday
            tDayOfWeek = tMoment.day();
            tDayOfWeek += tDayOfWeek === 0 ? 7 : 0;

            tMoment.subtract(tDayOfWeek, 'day');

            for (var i = 0; i < 42; i++) {
              tMoment.add(1, 'day');
              tDateArray.push(tMoment.clone());
            }
          }

          return tDateArray;
        }

        /* ######################
         * ### HELPER METHODS ###
         * ###################### */

        function _modifyDate(date, type, by) {
          return date.add(by, type);
        }

      });
}());
