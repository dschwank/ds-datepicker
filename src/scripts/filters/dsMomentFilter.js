(function (){
  'use strict';

  angular.module('ds.datepicker')
      .filter('dsMomentFilter', function($locale){

        return function(date, format) {
          var tMoment;

          tMoment = moment(date);

          tMoment.locale($locale.id);

          return tMoment.format(format);
        };

      });
}());
