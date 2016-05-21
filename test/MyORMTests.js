/**
 * Test cases for MyORM
 * Created by steve on 2016-05-19.
 */
'use strict';

const expect = require('chai').expect;
const mysql = require('mysql');

const connectionData = {
  // mysql连接信息
  connection: { host: '127.0.0.1', port: 3306, user: 'mysql_admin',
    password: 'development', database: 'test' }
};

const MyORM = require('../MyORM');
const orm = new MyORM(connectionData);
const pools = mysql.createPool(connectionData.connection);
const testTableName = 'Person';

describe('MyORMTests', () => {
  beforeEach(done => {
    pools.queryAsync(`TRUNCATE TABLE ${testTableName}`).
    then(() => pools.queryAsync(`INSERT INTO ${testTableName} (name) VALUES('Name1')`)).
    then(() => pools.queryAsync(`INSERT INTO ${testTableName} (name) VALUES('Name2')`)).
    then(() => pools.queryAsync(`INSERT INTO ${testTableName} (name) VALUES('Name3')`)).
    then(() => { done(); }).
    catch(err => { console.log(err); });
  });

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
      orm.table('Person').find({ name: 'Name2' }).
      then(list => {
        expect(list[0].name).to.equal('Name2');
        done();
      });
    });

    it('should return skipped results', done => {
      orm.table('Person').find().skip(1).
      then(list => {
        expect(list.length).to.equal(2);
        expect(list[0].name).to.equal('Name2');
        expect(list[1].name).to.equal('Name3');
        done();
      });
    });

    it('should return limited results', done => {
      orm.table('Person').find().limit(1).
      then(list => {
        expect(list[0].name).to.equal('Name1');
        done();
      });
    });

    it('should return skipped and limited results', done => {
      orm.table('Person').find().skip(1).limit(1).
      then(list => {
        expect(list[0].name).to.equal('Name2');
        done();
      });
    });
  });

  /**
   * test cases for findOne function
   */
  describe('findOne-query-tests', () => {
    it('should find the first entry', done => {
      orm.table('Person').findOne({}).
      then(result => {
        expect(result.name).to.equal('Name1');
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
        expect(result.affectedRows).to.equal(1);
        expect(result.changedRows).to.equal(1);
        // check whether the update is successful
        orm.table('Person').findOne({id: 1}).
        then(updatedResult => {
          expect(updatedResult.name).to.equal('hello');
          done();
        });
      });
    });

    it('should update all entries', done => {
      orm.table('Person').update({}, { name: 'hello1' }).
      then(result => {
        expect(result.affectedRows).to.equal(3);
        expect(result.changedRows).to.equal(3);
        orm.table('Person').find().
        then(results => {
          results.forEach(result => {
            expect(result.name).to.equal('hello1');
          });
          done();
        });
      });
    });
  });

  /**
   * test cases for delete function
   */
  describe('delete-query-tests', () => {
    it('should delete a single entry', done => {
      orm.table('Person').delete({ id: 1 }).
      then(result => {
        expect(result.affectedRows).to.equal(1);
        expect(result.changedRows).to.equal(0);
        orm.table('Person').findOne({ id: 1 }).
        then(deletedResult => {
          expect(deletedResult).to.be.null;
          done();
        });
      });
    });

    it('should delete all entries', done => {
      orm.table('Person').delete().
      then(result => {
        expect(result.affectedRows).to.equal(3);
        expect(result.changedRows).to.equal(0);
        orm.table('Person').find().
        then(deletedResults => {
          expect(deletedResults.length).to.equal(0);
          done();
        });
      });
    });
  });
});
