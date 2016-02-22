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
      .directive('dsDatepicker', function ($locale) {
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
      });
}());
