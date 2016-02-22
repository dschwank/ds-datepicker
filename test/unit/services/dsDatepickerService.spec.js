(function () {
  'use strict';

  describe('Service: dsDatepickerService', function () {

    var dsDatepickerService;

    beforeEach(module('ds.datepicker'));

    beforeEach(inject(function (_dsDatepickerService_) {
      dsDatepickerService = _dsDatepickerService_;
    }));

    describe('increaseDate()', function () {

      it('should be defined as function', function () {
        expect(dsDatepickerService.increaseDate).toEqual(jasmine.any(Function));
      });

      it('should increase the date by one, if no optional value is set', function () {
        // arrange
        var tDate,
            tComparableDate;

        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.increaseDate(tDate);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.add(1, 'day');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

      it('should return the resulting date', function () {
        // arrange
        var tDate,
            tResult;

        tDate = moment();

        // act
        tResult = dsDatepickerService.increaseDate(tDate);

        tDate.add(1, 'day');

        // assert
        expect(tResult).toBeDefined();
        expect(tDate).toBeDefined();
        expect(+tDate).toEqual(+tResult);
      });

      it('should increase the date by a custom value', function () {
        // arrange
        var tDate,
            tCustomCount,
            tComparableDate;

        tCustomCount = 42;
        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.increaseDate(tDate, tCustomCount);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.add(tCustomCount, 'day');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

    });

    describe('decreaseDate()', function () {

      it('should be defined as function', function () {
        expect(dsDatepickerService.decreaseDate).toEqual(jasmine.any(Function));
      });

      it('should decrease the date by one, if no optional value is set', function () {
        // arrange
        var tDate,
            tComparableDate;

        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.decreaseDate(tDate);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.subtract(1, 'day');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

      it('should return the resulting date', function () {
        // arrange
        var tDate,
            tResult;

        tDate = moment();

        // act
        tResult = dsDatepickerService.decreaseDate(tDate);

        tDate.subtract(1, 'day');

        // assert
        expect(tResult).toBeDefined();
        expect(tDate).toBeDefined();
        expect(+tDate).toEqual(+tResult);
      });

      it('should increase the date by a custom value', function () {
        // arrange
        var tDate,
            tCustomCount,
            tComparableDate;

        tCustomCount = 42;
        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.decreaseDate(tDate, tCustomCount);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.subtract(tCustomCount, 'day');

        expect(tDate).toEqual(tComparableDate.toDate());
      });
    });

    describe('increaseMonth()', function () {
      it('should be defined as function', function () {
        expect(dsDatepickerService.increaseMonth).toEqual(jasmine.any(Function));
      });

      it('should increase the month by one, if no optional value is set', function () {
        // arrange
        var tDate,
            tComparableDate;

        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.increaseMonth(tDate);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.add(1, 'month');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

      it('should return the resulting date', function () {
        // arrange
        var tDate,
            tResult;

        tDate = moment();

        // act
        tResult = dsDatepickerService.increaseMonth(tDate);

        tDate.add(1, 'month');

        // assert
        expect(tResult).toBeDefined();
        expect(tDate).toBeDefined();
        expect(+tDate).toEqual(+tResult);
      });

      it('should increase the month by a custom value', function () {
        // arrange
        var tDate,
            tCustomCount,
            tComparableDate;

        tCustomCount = 42;
        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.increaseMonth(tDate, tCustomCount);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.add(tCustomCount, 'month');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

    });

    describe('decreaseMonth()', function () {
      it('should be defined as function', function () {
        expect(dsDatepickerService.decreaseMonth).toEqual(jasmine.any(Function));
      });

      it('should decrease the month by one, if no optional value is set', function () {
        // arrange
        var tDate,
            tComparableDate;

        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.decreaseMonth(tDate);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.subtract(1, 'month');

        expect(tDate).toEqual(tComparableDate.toDate());
      });

      it('should return the resulting date as unix timestamp', function () {
        // arrange
        var tDate,
            tResult;

        tDate = moment();

        // act
        tResult = dsDatepickerService.decreaseMonth(tDate);

        tDate.subtract(1, 'month');

        // assert
        expect(tResult).toBeDefined();
        expect(tDate).toBeDefined();
        expect(+tDate).toEqual(+tResult);
      });

      it('should decrease the month by a custom value', function () {
        // arrange
        var tDate,
            tCustomCount,
            tComparableDate;

        tCustomCount = 42;
        tDate = new Date();
        tComparableDate = moment(tDate);

        // act
        tDate = dsDatepickerService.decreaseMonth(tDate, tCustomCount);

        // assert
        expect(tDate).toBeDefined();

        tComparableDate.subtract(tCustomCount, 'month');

        expect(tDate).toEqual(tComparableDate.toDate());
      });
    });

    describe('generateDateArray()', function () {

      it('should be defined as function', function () {
        expect(dsDatepickerService.generateDateArray).toEqual(jasmine.any(Function));
      });

      it('should return an array of 42 dates', function () {
        // arrange
        var tDateArray;

        // act
        tDateArray = dsDatepickerService.generateDateArray(undefined);

        // assert
        expect(tDateArray).toEqual(jasmine.any(Array));
        expect(tDateArray.length).toEqual(42);

        tDateArray.forEach(function (entry) {
          expect(entry).toEqual(jasmine.any(Date));
        });
      });

      it('should use the current date, if no custom date is set', function () {
        // arrange
        var tDateArray,
            tDate;

        tDate = moment();

        tDate.set('date', 1);

        // act
        tDateArray = dsDatepickerService.generateDateArray();

        // assert
        expect(moment(tDateArray[0]).day()).toEqual(1); // it should start with a monday
        expect(moment(tDateArray[41]).day()).toEqual(0); // it should end up with a sunday

        // if the first day in the month is not a monday, check that the first value is a date of the previous month
        if(tDate.day() !== 1) {
          expect(moment(tDateArray[0]).month()).toEqual(tDate.month() - 1);
        }

        // if the first day in the month is not a sunday, check that the first value is a date of the previous month
        if(tDate.day() !== 0) {
          expect(moment(tDateArray[41]).month()).toEqual(tDate.month() + 1);
        }
      });

    });


  });

}());
