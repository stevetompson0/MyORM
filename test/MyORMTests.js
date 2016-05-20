/**
 * Test cases for MyORM
 * Created by steve on 2016-05-19.
 */
'use strict';

const expect = require('chai').expect;

const MyORM = require('../MyORM');
const orm = new MyORM({
  // mysql连接信息
  connection: { host: '127.0.0.1', port: 3306, user: 'mysql_admin',
    password: 'development', database: 'test' }
});

describe('MyORMTests', () => {
  describe('convertQuery-function-test', () => {
    it('should return the correct converted query', () => {
      const convertedQuery = MyORM.convertQuery({id: 5, name: 'Helen'}, 'AND');
      expect(convertedQuery).to.equal('`id`=5 AND `name`=\'Helen\'');
    });
  });

  /**
   * test cases for find function
   */
  describe('find-query-tests', () => {
    it('should return results', (done) => {
      orm.table('Person').find({ id: 2 }).
      then(list => {
        console.log('result', list);
        done();
      });
    });

    it('should return skipped results', done => {
      orm.table('Person').find().skip(1).
      then(list => {
        console.log('result', list);
        done();
      });
    });

    it('should return limited results', done => {
      orm.table('Person').find().limit(1).
      then(list => {
        console.log('result', list);
        done();
      });
    });

    it('should return skipped and limited results', done => {
      orm.table('Person').find().skip(1).limit(1).
      then(list => {
        console.log('result', list);
        done();
      });
    });
  });

  /**
   * test cases for update function
   */
  describe('update-query-tests', () => {
    it('should update the single entry', done => {
      orm.table('Person').update({ id: 1 }, { name: 'hello' }).
      then(result => {
        console.log(result);
        done();
      });
    });

    it('should update all entries', done => {
      orm.table('Person').update({}, { name: 'hello1' }).
      then(result => {
        console.log(result);
        done();
      });
    });


  });

});
