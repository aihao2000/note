# mysql dev x 

## Session

相当于一个连接

- Session::sql(str)

  接收一个字符串作为参数

- Session::sql(str)::execute()

  执行sql语句

- Session::getSchemas()

## Schema

相当于一个数据库别名

- Schema::getCollection(str)

  获得一个Collection

## Collection

相当于一个表的别名

- Collection::add()

  相当于insert

- Collection::find()

  相当于select