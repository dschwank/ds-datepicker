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
      .directive('dsDateFormat', function ($log, dsDateFormatService) {
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
      });
}());
