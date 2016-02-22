(function () {
  'use strict';

  describe('Service: dsDateFormatService', function () {

    var dsDateFormatService,
        $rootScope;

    beforeEach(module('ds.datepicker'));

    beforeEach(inject(function (_dsDateFormatService_, _$rootScope_) {
      dsDateFormatService = _dsDateFormatService_;
      $rootScope = _$rootScope_;
    }));

    var resolve,
        reject;

    beforeEach(function () {
      resolve = jasmine.createSpy('resolve');
      reject = jasmine.createSpy('reject');
    });

    describe('identifyFormat()', function () {

      it('should be defined as function', function () {
        expect(dsDateFormatService.identifyFormat).toEqual(jasmine.any(Function));
      });

      describe('reject', function () {

        it('should reject the call, if the format is not defined', function () {
          // arrange
          var tPromise;

          // act
          tPromise = dsDateFormatService.identifyFormat();

          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();

          // assert
          expect(resolve).not.toHaveBeenCalled();
          expect(reject).toHaveBeenCalled();
        });

        it('should reject the call, if the format is not a string', function () {
          // arrange
          var tFormat,
              tPromise;

          tFormat = [1337, 1.337, undefined, true, false, null, jasmine.createSpy('dummy')];

          // act
          tFormat.forEach(function (format) {
            tPromise = dsDateFormatService.identifyFormat(format);
            tPromise.then(resolve).catch(reject);

            $rootScope.$apply();
          });

          // assert
          expect(resolve).not.toHaveBeenCalled();
          expect(reject).toHaveBeenCalled();
          expect(reject.calls.count()).toEqual(tFormat.length);
        });
      });

      describe('resolve', function () {

        it('should detect formats with only date information', function () {
          // arrange
          var tFormat,
              tPromise,
              tIdentified;

          tFormat = 'DD.MM.YYYY';

          // act
          tPromise = dsDateFormatService.identifyFormat(tFormat);
          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();

          // assert
          expect(resolve).toHaveBeenCalled();
          expect(resolve.calls.count()).toEqual(1);
          expect(reject).not.toHaveBeenCalled();

          tIdentified = resolve.calls.argsFor(0)[0];

          expect(tIdentified).toEqual(jasmine.any(Object));
          expect(tIdentified.date).toBeTruthy();
          expect(tIdentified.months).toBeTruthy();
          expect(tIdentified.years).toBeTruthy();

          expect(tIdentified.hours).toBeFalsy();
          expect(tIdentified.minutes).toBeFalsy();
          expect(tIdentified.seconds).toBeFalsy();
          expect(tIdentified.milliseconds).toBeFalsy();
        });

        it('should detect formats with date time information', function () {
          // arrange
          var tFormat,
              tPromise,
              tIdentified;

          tFormat = 'DD.MM.YYYY H:mm:ss.S';

          // act
          tPromise = dsDateFormatService.identifyFormat(tFormat);
          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();

          // assert
          expect(resolve).toHaveBeenCalled();
          expect(resolve.calls.count()).toEqual(1);
          expect(reject).not.toHaveBeenCalled();

          tIdentified = resolve.calls.argsFor(0)[0];

          expect(tIdentified).toEqual(jasmine.any(Object));
          expect(tIdentified.date).toBeTruthy();
          expect(tIdentified.months).toBeTruthy();
          expect(tIdentified.years).toBeTruthy();

          expect(tIdentified.hours).toBeTruthy();
          expect(tIdentified.minutes).toBeTruthy();
          expect(tIdentified.seconds).toBeTruthy();
          expect(tIdentified.milliseconds).toBeTruthy();
        });

        it('should detect formats with date time information and escaped parts', function () {
          // arrange
          var tFormat,
              tPromise,
              tIdentified;

          tFormat = 'DD.MM.YYYY H [this format H:mm:ss.S]';

          // act
          tPromise = dsDateFormatService.identifyFormat(tFormat);
          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();

          // assert
          expect(resolve).toHaveBeenCalled();
          expect(resolve.calls.count()).toEqual(1);
          expect(reject).not.toHaveBeenCalled();

          tIdentified = resolve.calls.argsFor(0)[0];

          expect(tIdentified).toEqual(jasmine.any(Object));
          expect(tIdentified.date).toBeTruthy();
          expect(tIdentified.months).toBeTruthy();
          expect(tIdentified.years).toBeTruthy();

          expect(tIdentified.hours).toBeTruthy();
          expect(tIdentified.minutes).toBeFalsy();
          expect(tIdentified.seconds).toBeFalsy();
          expect(tIdentified.milliseconds).toBeFalsy();
        });

      });


    });

    describe('generateDateFormatFix()', function () {

      it('should be defined as function', function () {
        expect(dsDateFormatService.generateDateFormatFix).toEqual(jasmine.any(Function));
      });

      it('should reject, if the format is not valid', function () {
        // arrange
        var tFormat,
            tPromise;

        tFormat = [1337, 1.337, undefined, true, false, null, jasmine.createSpy('dummy')];

        // act
        tFormat.forEach(function (format) {
          tPromise = dsDateFormatService.generateDateFormatFix(format);
          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();
        });

        // assert
        expect(resolve).not.toHaveBeenCalled();
        expect(reject).toHaveBeenCalled();
        expect(reject.calls.count()).toEqual(tFormat.length);
      });

      it('should resolve with a function, as soon as the format is valid', function () {
        // arrange
        var tFormat,
            tPromise,
            tFixFn;

        tFormat = 'DD.MM.YYYY';

        // act
        tPromise = dsDateFormatService.generateDateFormatFix(tFormat);
        tPromise.then(resolve).catch(reject);

        $rootScope.$apply();

        // assert
        expect(resolve).toHaveBeenCalled();
        expect(resolve.calls.count()).toEqual(1);
        expect(reject).not.toHaveBeenCalled();

        tFixFn = resolve.calls.argsFor(0)[0];

        expect(tFixFn).toEqual(jasmine.any(Function));
      });

      describe('fix formats', function () {

        function _fixFormat(format) {
          var tPromise;

          tPromise = dsDateFormatService.generateDateFormatFix(format);
          tPromise.then(resolve).catch(reject);

          $rootScope.$apply();

          expect(resolve).toHaveBeenCalled();
          expect(resolve.calls.count()).toEqual(1);
          expect(reject).not.toHaveBeenCalled();

          return resolve.calls.argsFor(0)[0];
        }

        it('should fix missing time information', function (){
          // arrange
          var tFormat,
              tOldDate = moment(1380607200000),// 01.10.2013 08:00:00.000
              tNewDate = moment(1459461599999),// 31.03.2016 23:59:59.999
              tFixFn;

          // format with only date and year information
          tFormat = 'DD MM YYYY';

          // act
          tFixFn = _fixFormat(tFormat);
          tFixFn(tNewDate, tOldDate);

          // assert
          expect(tNewDate.get('date')).toEqual(31);
          expect(tNewDate.get('month')).toEqual(2);
          expect(tNewDate.get('year')).toEqual(2016);

          expect(tNewDate.get('hours')).toEqual(8);
          expect(tNewDate.get('minutes')).toEqual(0);
          expect(tNewDate.get('seconds')).toEqual(0);
          expect(tNewDate.get('milliseconds')).toEqual(0);
        });

      });

    });


  });

}());
