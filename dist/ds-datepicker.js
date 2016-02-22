(function () {
  'use strict';

  try {
    angular.module('ds.templates');
  } catch (e) {
    angular.module('ds.templates', []);
  }

  /**
   * @ngdoc overview
   * @name ds.datepicker
   *
   * @description
   * Simple AngularJS based datepicker.
   */
  angular.module('ds.datepicker', ['ds.templates']);

}());

(function () {
  'use strict';

  /**
   * @ngdoc controller
   * @name ds.datepicker.controllers:dsDatepickerCtrl
   * @description
   * Controller for the {@link ds.datepicker.directives:dsDatepicker `dsDatepicker`}.
   */
  angular.module('ds.datepicker')
      .controller('dsDatepickerCtrl', ["$scope", "$document", "dsDatepickerService", "dsDateFormatService", function ($scope, $document, dsDatepickerService, dsDateFormatService) {
        var mCloseListener,
            mDateFixFn,
            self = this;

        self.date = undefined;

        /**
         * @ngdoc property
         * @name dates
         * @propertyOf ds.datepicker.directives:dsDatepicker
         *
         * @return {Array.<Date>} An array containing all dates for the current month and the dates around, which can be
         *         displayed in the datepicker.
         */
        self.dates = [];

        /**
         * @ngdoc property
         * @name disabled
         * @propertyOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @return {boolean} Identifier, if the datepicker is disabled (`true`) or enabled (`false`).
         */
        self.disabled = false;

        /**
         * @ngdoc method
         * @name disable
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @description
         * Disable the complete datepicker.
         */
        self.disable = function disable() {
          self.disabled = true;
        };

        /**
         * @ngdoc method
         * @name enable
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @description
         * Enable the complete datepicker.
         */
        self.enable = function enable() {
          self.disabled = false;
        };

        /**
         * @ngdoc property
         * @name open
         * @propertyOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @return {boolean} Current state of the datepicker - either it is open (`true`) or not (`false`).
         */
        self.open = false;

        /**
         * @ngdoc method
         * @name flipPickerState
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @param {Event} event Click event to flip the picker state.
         *
         * @description
         * Flip the state of the datepicker - if the {@link ds.datepicker.controllers:dsDatepickerCtrl#properties_open `open`}
         * is `true`, the picker will be closed - otherwise opened.
         */
        self.flipPickerState = function flipPickerState(event) {
          if (self.open) {
            self.closePicker(event);
          } else {
            self.openPicker(event);
          }
        };

        /**
         * @ngdoc method
         * @name openPicker
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @description
         * Open the datepicker and attach a click listener to the document, which will close the datepicker
         * automatically, as soon as the user clicks into the document.
         */
        self.openPicker = function enablePicker() {
          self.open = true;

          if (!mCloseListener) {
            var tInitialized = false;

            mCloseListener = function () {
              if (tInitialized) {
                self.closePicker();
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
         * @name closePicker
         * @methodOf ds.datepicker.controllers:dsDatepickerCtrl
         *
         * @description
         * Close the datepicker and remove the click listener from the document.
         */
        self.closePicker = function disablePicker() {
          self.open = false;
          if (mCloseListener) {
            $document.off('click', mCloseListener);
            mCloseListener = undefined;
          }
        };

        /**
         * @ngdoc method
         * @name setDateAndViewValue
         * @methodOf ds.datepicker.directives:dsDatepicker
         * @param {Date} date Date value which should be set as view value
         *     / model value.
         * @description
         * Set the date model value.
         */
        self.setDateAndViewValue = function setDateAndViewValue(date) {
          var tDate;

          tDate = mDateFixFn(date.clone(), self.date);
          self.dateChanged(tDate);
          self.curDate = tDate.clone();

          self.date = tDate;
          $scope.setViewValue(self.date);
        };

        self.setDate = function (date) {
          var tDate;

          tDate = mDateFixFn(date.clone(), self.date);
          self.dateChanged(tDate);

          self.date = tDate;

          $scope.setViewValue(self.date);
        };

        /**
         * @ngdoc method
         * @name addDate
         * @methodOf ds.datepicker.directives:dsDatepicker
         * @description
         * Increase the current date by one.
         */
        self.addDate = function addDate() {
          self.setDateAndViewValue(dsDatepickerService.increaseDate(self.date));
        };

        /**
         * @ngdoc method
         * @name subDate
         * @methodOf ds.datepicker.directives:dsDatepicker
         * @description
         * Subtract the current date by one.
         */
        self.subDate = function subDate() {
          self.setDateAndViewValue(dsDatepickerService.decreaseDate(self.date));
        };

        /**
         * @ngdoc method
         * @name addMonth
         * @methodOf ds.datepicker.directives:dsDatepicker
         * @description
         * Increase the current month by one.
         */
        self.addMonth = function addMonth() {
          self.setDateAndViewValue(dsDatepickerService.increaseMonth(self.date));
        };

        /**
         * @ngdoc method
         * @name subMonth
         * @methodOf ds.datepicker.directives:dsDatepicker
         * @description
         * Subtract the current month by one.
         */
        self.subMonth = function subMonth() {
          self.setDateAndViewValue(dsDatepickerService.decreaseMonth(self.date));
        };

        self.dateChanged = function dateChanged(date) {
          self.dates = dsDatepickerService.generateDateArray(date);
        };

        self.formatChanged = function formatChanged(format) {
          dsDateFormatService.generateDateFormatFix(format).then(function (fixFn) {
            mDateFixFn = fixFn;
          });
        };

        self.determineClasses = function determineClasses(week, day) {
          var tClasses = [],
              tDate;

          tDate = self.dates[(week * 7) + day - 1];

          if(tDate) {
            if (tDate.month() !== self.date.month()) {
              tClasses.push('otherMonth');
            }

            if (tDate.unix() === self.date.unix()) {
              tClasses.push('is-selected');
            }
          }

          return tClasses;
        };

      }]);

}());

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ds.datepicker.directives:dsDateFormat
   *
   * @restrict EA
   * @require ngModel
   *
   * @param {string} format Date format string, which will be used to format the string in the input field.
   *
   * @description
   * This directive can be used to convert date bindings from / to a special format. This might be especially
   * interesting for input fields, which should display a normal date text, but internally work with a date object.
   */
  angular.module('ds.datepicker')
      .directive('dsDateFormat', ["$log", "dsDateFormatService", function ($log, dsDateFormatService) {
        return {
          restrict: 'EA',
          require: '^ngModel',
          link: function (scope, element, attrs, ngModel) {
            var mDateFixFn,
                mMoment,
                mFormat;

            function _setFormat(format) {
              mFormat = format;
              dsDateFormatService.generateDateFormatFix(mFormat)
                  .then(function (fixFn) {
                    mDateFixFn = fixFn;
                  });
            }

            function _dateToString(date) {
              var tString;

              mMoment = moment(date);

              tString = mMoment.format(mFormat);

              return tString;
            }

            function _stringToDate(string) {
              var tParsedMoment;

              tParsedMoment = moment(string, mFormat);

              mDateFixFn(tParsedMoment, mMoment);

              return tParsedMoment;
            }

            ngModel.$formatters.push(_dateToString);
            ngModel.$parsers.push(_stringToDate);

            attrs.$observe('format', _setFormat);

            (function () {
              _setFormat(attrs.format || 'DD.MM.YYYY');
            }());
          }
        };
      }]);
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
   *     | dateFormat   | {@type string} | Format string for the way we should display the date string |
   *     | pickerFormat  | {@type string} | Format string for the way we should display the date string in the picker header. If this property is not set, it will use the `dateFormat` property. For example, use `'MMMM yy'` to display the name of the month and a two digits year value. |
   * @param {boolean=} disabled Identifier if the datepicker should be disabled (`true`) or not (`false`).
   *
   * @description
   * This directive can be used for a simple datepicker.
   */
  angular.module('ds.datepicker')
      .directive('dsDatepicker', ["$locale", function ($locale) {
        return {
          restrict: 'EA',
          require: '^ngModel',
          controller: 'dsDatepickerCtrl',
          controllerAs: 'pickerCtrl',
          bindToController: true,
          scope: {
            config: '=?'
          },
          link: function (scope, element, attrs, ngModel) {

            moment.locale($locale.id);

            scope.$on('$localeChangeSuccess', function () {
              moment.locale($locale.id);
            });


            scope.setViewValue = function setViewValue(value) {
              ngModel.$setViewValue(moment(value));
            };

            // add ngModel formatter and parser
            ngModel.$formatters.push(function (value) {
              var tDate;

              tDate = moment(value);

              scope.pickerCtrl.dateChanged(tDate);
              scope.pickerCtrl.date = tDate;
              scope.pickerCtrl.curDate = tDate;

              return value;
            });

            ngModel.$parsers.push(function (value) {
              return value.toDate();
            });

            scope.$watch(function () {
              return scope.pickerCtrl.config;
            }, function (config) {
              if (config.dateFormat) {
                scope.pickerCtrl.formatChanged(config.dateFormat);
              }
            }, true);

            // init the key listener
            angular.element(element[0].querySelector('.datepicker-inputField'))
                .bind('keydown', function (event) {
                  if (event.keyCode === 38) {
                    scope.pickerCtrl.addDate();
                  } else if (event.keyCode === 40) {
                    scope.pickerCtrl.subDate();
                  }
                  scope.$apply();
                });

            // add observer for the disabled attribute
            attrs.$observe('disabled', function (value) {
              if (value === true) {
                scope.pickerCtrl.disable();
              } else {
                scope.pickerCtrl.enable();
              }
            });

          },
          templateUrl: 'src/templates/dsDatepicker.tpl.html'
        };
      }]);
}());

(function (){
  'use strict';

  angular.module('ds.datepicker')
      .filter('dsMomentFilter', function(){

        return function(date, format) {
          return moment(date).format(format);
        };

      });
}());

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
      .factory('dsDateFormatService', ["$log", "$q", function ($log, $q) {

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

      }]);
}());

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
