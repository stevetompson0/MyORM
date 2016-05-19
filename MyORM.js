/**
 * Created by steve on 2016-05-19.
 */
'use strict';

const mysql = require('mysql');

/**
 * MyORM -- a nodejs ORM for MySQL
 *
 */
class MyORM {

  /**
   * constructor for the class
   * @param connection -- object containing host, port, user, password, database
   */
  constructor(connection) {
    this.connection = mysql.createConnection({ connection});
  }



}

module.exports = MyORM;
