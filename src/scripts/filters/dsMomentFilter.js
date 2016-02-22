(function (){
  'use strict';

  angular.module('ds.datepicker')
      .filter('dsMomentFilter', function(){

        return function(date, format) {
          return moment(date).format(format);
        };

      });
}());
