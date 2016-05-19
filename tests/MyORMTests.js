/**
 * Test cases for MyORM
 * Created by steve on 2016-05-19.
 */
'use strict';

const expect = require('chai').expect;

const MyORM = require('../MyORM');
const orm = new MyORM({
  // mysql连接信息
  connection: {host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'test'}
});

describe('MyORMTests', function() {

  describe('find-query-tests', function() {

    it('should return results', function() {

    });


  })

});
