'use strict';

// const bitmap = require('./lib/bitmap.js');
const server = require('../lib/server');



describe('server.js', () =>{
  describe('server.start', () => {
    test('server.start should start a server on the port', done => {
      let PORT = 3000;

      server.start(PORT, (error,data) => {
        expect(data).toBe(3000);
        expect(error).toBeNull();
        done();
      });
    });
    test('server.start should return an error if PORT NAN', done => {
      let PORT = 'three thousand';

      server.start(PORT, (error,data) => {
        expect(error).toBe();
        expect(data).toBe('three thousand');
        done();
      });
    });
    test('invert.invert should create 3 files with transformations and changed file name', done => {
      let inputPaths = [
        `${__dirname}/assets/bitmap.bmp`,
        `${__dirname}/assets/finger-print.bmp`,
        `${__dirname}/assets/house.bmp`,
      ];

      let transformName = 'invert';
      let outputPaths = [
        `${__dirname}/../__test__/dump/bitmap-${transformName}.bmp`,
        `${__dirname}/../__test__//dump/finger-print-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/house-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/non-palette-bitmap-${transformName}.bmp`,
      ];

      bitmapper.writer(inputPaths, outputPaths, transformName, (error,data) => {
        expect(data[0].buffer).not.toBeNull();
        expect(data[1].buffer).not.toBeNull();
        expect(data[2].buffer).not.toBeNull();
        // expect(data[1].buffer).not.toBeNull();
        // expect(data[2].buffer).not.toBeNull();
        done();
      });
    });
    test('should return error callback if a filepath is bad', done => {
      let inputPaths = [
        `${__dirname}/assets/bitmapp.bmp`,
        `${__dirname}/assets/finger-print.bmp`,
        `${__dirname}/assets/house.bmp`,
      ];

      let transformName = 'invert';
      let outputPaths = [
        `${__dirname}/../__test__/dump/bitmap-${transformName}.bmp`,
        `${__dirname}/../__test__//dump/finger-print-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/house-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/non-palette-bitmap-${transformName}.bmp`,
      ];

      bitmapper.writer(inputPaths, outputPaths, transformName, (error,data) => {
        expect(error).not.toBeNull();
        done();
      });
    });

    test('should throw error if inputPats is not array', done => {
      let inputPaths = 'incorrect inputPaths';

      let transformName = 'invert';
      let outputPaths = [
        `${__dirname}/../__test__/dump/bitmap-${transformName}.bmp`,
        `${__dirname}/../__test__//dump/finger-print-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/house-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/non-palette-bitmap-${transformName}.bmp`,
      ];

      expect(() => {bitmapper.writer(inputPaths, outputPaths, transformName, (error,data) => {
        expect(error).toBe('inputPaths must be an array of strings');
        expect(data).toBe('incorrect inputPaths');
        done();
      });}).toThrow();
    });

    test('should throw error if outputPats is not array', done => {
      let inputPaths = [
        `${__dirname}/assets/bitmapp.bmp`,
        `${__dirname}/assets/finger-print.bmp`,
        `${__dirname}/assets/house.bmp`,
      ];

      let transformName = 'invert';
      let outputPaths = 'incorrect outputPaths';

      expect(() => {bitmapper.writer(inputPaths, outputPaths, transformName, (error,data) => {
        expect(error).toBe('outputPaths must be an array of strings');
        expect(data).toBe('incorrect outputPaths');
        done();
      });}).toThrow();
    });

    test('should throw error if transformName is not a string', done => {
      let inputPaths = [
        `${__dirname}/assets/bitmapp.bmp`,
        `${__dirname}/assets/finger-print.bmp`,
        `${__dirname}/assets/house.bmp`,
      ];

      let transformName = () => {
        console.log('i am not a string');
      };
      let outputPaths = [
        `${__dirname}/../__test__/dump/bitmap-${transformName}.bmp`,
        `${__dirname}/../__test__//dump/finger-print-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/house-${transformName}.bmp`,
        `${__dirname}/../__test__/dump/non-palette-bitmap-${transformName}.bmp`,
      ];

      expect(() => {bitmapper.writer(inputPaths, outputPaths, transformName, (error,data) => {
        expect(error).toBe('transformName must be a string');
        done();
      });}).toThrow();
    });

  });
});
