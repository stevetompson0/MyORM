/**
 * Test cases for MyORM
 * Created by steve on 2016-05-19.
 */
'use strict';

const expect = require('chai').expect;

const MyORM = require('../MyORM');
const orm = new MyORM({
  // mysql连接信息
  connection: { host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'test' }
});

describe('MyORMTests', () => {
  describe('convertQuery-function-test', () => {
    it('should return the correct converted query', () => {
      const convertedQuery = MyORM.convertQuery({id: 5, name: 'Helen'});
      expect(convertedQuery).to.equal('`id`=5 AND `name`=\'Helen\'');
    });
  });
  describe('find-query-tests', () => {
    it('should return results', () => {

    });
  });
});
