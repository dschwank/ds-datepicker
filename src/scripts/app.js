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
