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
        expect(error).toBe('port must be a number');
        expect(data).toBe('three thousand');
        done();
      });
    });
  });
});
