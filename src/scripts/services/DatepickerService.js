(function () {
    'use strict';

    angular.module('ds.datepicker')
        .factory('DatepickerService', function () {

            function increaseDate(date, by) {
                return date.setDate(date.getDate() + (by || 1));
            }

            function decreaseDate(date, by) {
                return date.setDate(date.getDate() - (by || 1));
            }

            function decreaseMonth(date, by) {
                return date.setMonth(date.getMonth() - (by || 1));
            }

            function increaseMonth(date, by) {
                return date.setMonth(date.getMonth() + (by || 1));
            }

            return {
                increaseDate: function (date, by) {
                    return increaseDate(date, by);
                },

                decreaseDate: function (date, by) {
                    return decreaseDate(date, by);
                },

                increaseMonth: function(date, by) {
                    return increaseMonth(date, by);
                },

                decreaseMonth: function(date, by) {
                    return decreaseMonth(date, by);
                }
            };
        });
}());