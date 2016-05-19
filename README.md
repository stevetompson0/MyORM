# MyORM

An nodejs implementation for a MySQL ORM.

Basic Usage

```javascript
const orm = new MyORM({
  // mysql连接信息
  connection: {host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'test'},
});

orm.table('xxxx').find(query).skip(0).limit(20)
.then(list => console.log('results', list))
.catch(err => console.log(err))

orm.table('xxxxx').update(query, update)
.then(ret => console.log(ret))
.catch(err => console.log(err))

// 另外需要支持基本的 delete, findOne 等方法
```
