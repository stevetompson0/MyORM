/**
 * Created by steve on 2016-05-19.
 */
'use strict';


const Promise = require('bluebird');
const mysql = require('mysql');

// Note that the library's classes are not properties of the main export
// so we require and promisifyAll them manually
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

/**
 * MyORM -- a nodejs ORM for MySQL
 * TODO: dealing with errors
 */
class MyORM {

  /**
   * constructor for the class
   * @param data -- object containing a connection object
   *     with parameters: host, port, user, password, database
   */
  constructor(data) {
    if (typeof data === 'object' && typeof data.connection === 'object') {
      this.pool = mysql.createPool(data.connection);
    } else {
      throw new Error('Invalid initial data');
    }
  }

  /**
   * table -- set the table to be queried
   * @param tableName
   */
  table(tableName) {
    this.table = tableName;
    return this;
  }

  /**
   * find -- a promise to make the query (table should be set before the query)
   * @param query -- query object
   */
  find(query) {
    if (typeof query === 'object') {
      return this;
    }

    throw new Error('Invalid query format');
  }

}

module.exports = MyORM;
