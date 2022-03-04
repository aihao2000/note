# mysql C++连接器

## 连接到mysql

```cpp
sql::mysql::MySQL_Driver *driver;
sql::Connection *con;

driver = sql::mysql::get_mysql_driver_instance();
con = driver->connect("tcp://127.0.0.1:3306", "user", "password");

delete con;
```

- sql::Connection::isValid()

  连接是否有效

- sql::Connection::reconnect()

  如果连接已经关闭，重新连接

## 执行语句

```cpp
sql::mysql::MySQL_Driver *driver = sql::mysql::get_mysql_driver_instance();
sql::Connection *con = driver->connect("tcp://127.0.0.1:3306", "user", "password");
sql::Statement *stmt = con->createStatement();
stmt->execute("USE " EXAMPLE_DB);
stmt->execute("DROP TABLE IF EXISTS test");
stmt->execute("CREATE TABLE test(id INT, label CHAR(1))");
stmt->execute("INSERT INTO test(id, label) VALUES (1, 'a')");
delete stmt;
delete con;
```

- sql::Statement::execute()
- sql::Statement::executeQuery()
- sql::Statement::executeUpdate()
- sql::Statement::execute()

## 查询结果

```cpp
sql::Connection *con;
sql::Statement *stmt= con->createStatement();
sql::ResultSet  *res = stmt->executeQuery("SELECT id, label FROM test ORDER BY id ASC");
```

- ResultSet::next()
- ResultSet::getInt()
- ResultSet::getString()

## 预准备

填充？执行

```cpp
sql::Connection *con;
sql::PreparedStatement  *prep_stmt
// ...

prep_stmt = con->prepareStatement("INSERT INTO test(id, label) VALUES (?, ?)");

prep_stmt->setInt(1, 1);
prep_stmt->setString(2, "a");
prep_stmt->execute();

prep_stmt->setInt(1, 2);
prep_stmt->setString(2, "b");
prep_stmt->execute();

delete prep_stmt;
delete con;
```

