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
    this.tableName = mysql.escapeId(tableName);
    return this;
  }

  /**
   * find -- a promise to make the query (table should be set before the query)
   * @param query -- query object
   */
  find(query) {
    // no query condition
    this.action = 'SELECT';
    this.checkAndProcessQuery(query);
    return this;
  }

  /**
   * skip -- skip a given number of items
   * @param num: the number of items to be skipped
   */
  skip(num) {
    this.hasSkip = true;
    this.skipNum = mysql.escape(num);
    return this;
  }

  /**
   * limit -- limit the number of items to be returned
   * @param num: the number of items to be limited
   */
  limit(num) {
    this.hasLimit = true;
    this.limitNum = mysql.escape(num);
    return this;
  }

  /**
   * update -- function to set update command
   * @param query: the query to find the entry
   * @param update: the update to the entry
   */
  update(query, update) {
    this.action = 'UPDATE';
    if (!update || typeof update !== 'object' || Object.keys(update).length === 0) {
      throw new Error('Invalid update command format.');
    } else {
      this.checkAndProcessQuery(query);
      this.updateStr = MyORM.convertQuery(update, ',');
    }
    return this;
  }

  /**
   * delete entries satisfying the query
   * @param query: query condition
   */
  delete(query) {
    this.action = 'DELETE';
    this.checkAndProcessQuery(query);
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
    this.hasSkip = undefined;
    this.skipNum = undefined;
    this.hasLimit = undefined;
    this.limitNum = undefined;
    this.updateStr = undefined;
    this.query = undefined;
  }

  /**
   * execute -- function to generate full query string and perform the query
   */
  executeQuery() {
    let cmd = '';
    if (this.action === 'SELECT') {
      cmd = this.getSelectCmd();
    } else if (this.action === 'UPDATE') {
      cmd = this.getUpdateCmd();
    } else if (this.action === 'DELETE') {
      cmd = this.getDeleteCmd();
    }
    this.clear();
    return this.pool.queryAsync(cmd);
  }

  /**
   * function to generate the SELECT cmd
   */
  getSelectCmd() {
    let cmd = '';
    cmd += `SELECT * FROM ${this.tableName} `;
    if (this.hasQuery) {
      cmd += ` WHERE ${this.query} `;
    }
    if (this.hasLimit && this.hasSkip) {  // has limit and skip
      cmd += `LIMIT ${this.skipNum}, ${this.limitNum}`;
    } else if (this.hasLimit) {           // only has limit
      cmd += `LIMIT ${this.limitNum}`;
    } else if (this.hasSkip) {                              // only has skip
      cmd += `LIMIT ${this.skipNum}, 18446744073709551615`;
    }
    return cmd;
  }

  /**
   * function to generate the Update cmd
   */
  getUpdateCmd() {
    let cmd = '';
    cmd += `UPDATE ${this.tableName} SET ${this.updateStr}`;
    if (this.hasQuery) {
      cmd += ` WHERE ${this.query}`;
    }
    return cmd;
  }

  /**
   * function to generate the Delete cmd
   */
  getDeleteCmd() {
    let cmd = '';
    cmd += `DELETE FROM ${this.tableName}`;
    if (this.hasQuery) {
      cmd += ` WHERE ${this.query}`;
    }
    return cmd;
  }

  /**
   * validate the query object and store the parsed query
   * @param query: query object
   */
  checkAndProcessQuery(query) {
    if (!query) {  // empty query
      this.hasQuery = false;
    } else if (typeof query === 'object') {  // correct query format
      if (Object.keys(query).length > 0) {
        this.hasQuery = true;
        this.query = MyORM.convertQuery(query, 'AND');
      } else {
        this.hasQuery = false;  // empty query
      }
    } else {
      throw new Error('Invalid query format'); // incorrect query format
    }
  }

  /**
   * convertQuery -- convert a query object to query string
   * @param query: query object with conditions in key-value pairs
   * @param seperator: the separator used to concatenate the query
   *
   * the function will also escape key, value to defend potential SQL injection attacks
   */
  static convertQuery(query, separator) {
    let res = '';
    Object.keys(query).forEach((key, index) => {
      if (index !== 0) {
        res += ` ${separator} `;
      }
      res += `${mysql.escapeId(key)}=${mysql.escape(query[key])}`;
    });

    return res;
  }

}

module.exports = MyORM;
