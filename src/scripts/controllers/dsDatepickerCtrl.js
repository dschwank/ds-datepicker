(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name ds.datepicker.controllers:dsDatepickerCtrl
   * @description
   * Controller for the {@link ds.datepicker.directives:dsDatepicker
   *     `dsDatepicker`}.
   */
  angular.module('ds.datepicker')
      .controller('dsDatepickerCtrl', function($scope, $document, $log) {

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

            mCloseListener = function() {
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

      });

}());
