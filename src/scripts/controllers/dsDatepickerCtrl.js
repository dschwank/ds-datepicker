(function () {
  'use strict';

  /**
   * @ngdoc controller
   * @name ds.datepicker.controllers:dsDatepickerCtrl
   * @description
   * Controller for the {@link ds.datepicker.directives:dsDatepicker `dsDatepicker`}.
   */
  angular.module('ds.datepicker')
      .controller('dsDatepickerCtrl', function ($scope, $document, dsDatepickerService, dsDateFormatService) {
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

      });

}());
