(function () {

  /**
   * @ngdoc service
   * @name ds.datepicker.dsDateFormatService
   *
   * @description
   * Date format helper service to identify the ingredients of a date time format. The {@link ds.datepicker.dsDateFormatService#methods_generateDateFormatFix `generateDateFormatFix()`}
   * method helps to fix dates / date formats, which do not include all ingredients of the raw date. It will fix the new
   * date with the values of the old date.
   *
   * The services is based on {@link http://momentjs.com `moment.js`}. Have a look at the
   * {@link http://momentjs.com/docs/#/displaying/format/ `format options`}, if you need some more information about how
   * to set up the format / which elements can be used.
   */
  angular.module('ds.datepicker')
      .factory('dsDateFormatService', function ($log, $q) {

        var mPublicApi;

        mPublicApi = {
          identifyFormat: identifyFormat,
          generateDateFormatFix: generateDateFormatFix
        };

        return mPublicApi;

        /* ##################
         * ### PUBLIC API ###
         * ################## */

        /**
         * @ngdoc method
         * @name identifyFormat
         * @methodOf ds.datepicker.dsDateFormatService
         *
         * @description
         * Identify the ingredients of a specific format. The method will return an object containing the different date
         * time types in combination with an identifier, if this type will be fulfilled within the format.
         *
         * The following types will be set within the object:
         *
         *  - **`date`** `{boolean}`
         *  - **`hours`** `{boolean}`
         *  - **`milliseconds`** `{boolean}`
         *  - **`minutes`** `{boolean}`
         *  - **`months`** `{boolean}`
         *  - **`seconds`** `{boolean}`
         *  - **`years`** `{boolean}`
         *
         * @param {String} format The date time format string including
         *        {@link http://momentjs.com/docs/#/displaying/format/ `moment.js format options`}.
         * @return {Promise} A promise which will be resolved, if the given input format is a string. It will be
         *         resolved with an object, which describes the ingredients of the format (see description). It will be
         *         rejected, as soon as the format is not a valid string.
         */
        function identifyFormat(format) {
          var tDefer,
              tMoment,
              tParsed,
              tIngredients = {};

          tDefer = $q.defer();

          if (angular.isString(format)) {
            // define a comparable date format object
            tMoment = moment(658665031337);

            // format it according to the given format and then transform it back to an object
            tParsed = moment(tMoment.format(format), format).toObject();

            // finally check which values are set / not set
            angular.forEach(tMoment.toObject(), function (rawValue, type) {
              tIngredients[type] = tParsed[type] === rawValue || tParsed[type] !== 0;
            });

            tDefer.resolve(tIngredients);
          } else {
            tDefer.reject('Unable to identify format - the given format is not a string. [' + format + ']');
          }

          return tDefer.promise;
        }

        /**
         * @ngdoc method
         * @name generateDateFormatFix
         * @methodOf ds.datepicker.dsDateFormatService
         *
         * @description
         * Generate a function which will fix the new date, according to the old date and the information which are
         * contained in the new date. That means, if the format just contains date information and no time information,
         * the time will be used from the old date object and inserted into the new one.
         *
         * The function which will be returned in the `resolve` method accepts the following arguments:
         *
         * ```+js
         *  function(newDate, oldDate){};
         * ```
         *
         * According to the defined format, the missing values in the `newDate` will be updated using the `oldDate`.
         * Finally the `newDate` will also be returned;
         *
         * @param {String} format The date time format string including
         *        {@link http://momentjs.com/docs/#/displaying/format/ `moment.js format options`}.
         * @return {Promise} A promise, which will be resolved with a function, if the given format is a valid format.
         *         For more information about the returned function have a look at the description. The promise will be
         *         rejected, as soon as the given format is not a valid format.
         */
        function generateDateFormatFix(format) {
          var tDefer;

          tDefer = $q.defer();

          // identify the format
          identifyFormat(format)
              .then(function (ingredients) {
                var tFix = [];

                // add all not contained types to the fix array
                angular.forEach(ingredients, function (contains, type) {
                  if (!contains) {
                    tFix.push(type);
                  }
                });

                // finally generate the dateFormatFix and return it as function
                tDefer.resolve(_dateFormatFix(tFix));
              }).catch(tDefer.reject);

          return tDefer.promise;
        }

        /* ######################
         * ### HELPER METHODS ###
         * ###################### */

        /**
         * @name _dateFormatFix
         *
         * @description
         * Generate a function which will update the `newDate`, if not all date time information are contained within
         * the format. In this case, the `oldDate` will be used to update the `newDate`.
         *
         * @param {Array.<String>} fixes Array containing the types, which should be fixed.
         * @return {Function} A function accepting a `newDate` and `oldDate`. The `newDate` will be updated with the
         *         information of the `oldDate`, which are stored in the array of fixes.
         *
         * @private
         */
        function _dateFormatFix(fixes) {
          return function (date, oldDate) {
            // if the oldDate is set, and the array of fixes is bigger than 0, then update the `newDate` with the
            // information of the `oldDate`.
            if (oldDate && oldDate.isValid() && fixes.length > 0) {
              fixes.forEach(function (type) {
                date.set(type, oldDate.get(type));
              });
            }

            return date;
          };
        }

      });
}());
