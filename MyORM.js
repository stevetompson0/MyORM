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
    this.table = mysql.escapeId(tableName);
    return this;
  }

  /**
   * find -- a promise to make the query (table should be set before the query)
   * @param query -- query object
   */
  find(query) {
    // no query condition
    this.action = 'SELECT';
    if (!query) {
      this.hasQuery = false;
    } else if (typeof query === 'object') {  // correct query format
      this.hasQuery = true;
      this.query = MyORM.convertQuery(query);
    } else {
      throw new Error('Invalid query format'); // incorrect query format
    }
    return this;
  }

  /**
   * then -- indicate the query is fully given so that we can perform the async query
   * @param callback: the callback to be performed after the query
   * @return: a promise with query results
   */
  then(callback) {
    return this.executeQuery().then(callback);
  }

  /**
   * clear - function to clear all properties (except the connection pool) for next query
   */
  clear() {
    this.action = undefined;
    this.hasQuery = undefined;
  }

  /**
   * execute -- function to generate full query string and perform the query
   */
  executeQuery() {
    let cmd = '';
    if (this.action === 'SELECT') {
      cmd += `SELECT * FROM ${this.table} `;
      if (this.hasQuery) {
        cmd += ` WHERE ${this.query}`;
      }
      return this.pool.queryAsync(cmd);
    }
  }

  /**
   * convertQuery -- convert a query object to query string
   * @param query: query object with conditions in key-value pairs
   *
   * the function will also escape key, value to defend potential SQL injection attacks
   */
  static convertQuery(query) {
    let res = '';
    Object.keys(query).forEach((key, index) => {
      if (index !== 0) {
        res += ' AND ';
      }
      res += `${mysql.escapeId(key)}=${mysql.escape(query[key])}`;
    });

    return res;
  }

}

module.exports = MyORM;
