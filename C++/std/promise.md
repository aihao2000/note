# promise

std::promise<T>提供设定值得方式，类型为T，这个类型会和看到的std::future<T>对象相关联

可以将值传给新的线程而不需要手动的同步操作

## .get_future()

获取一个给定的std::promise相关的std::future对象

通过get_future()获取空想状态(std::future)后，两个而对象共享相同的共享状态

## .set_value()

设置共享状态得值

## .set_exception()

存入异常

## std::current_exception()

检索抛出的异常

```cpp
some_promise.set_exception(std::current_exception());
```

## std::copy_exception()

直接存储一个新的异常而不抛出

```cpp
some_promise.set_exception(std::copy_exception(std::logic_error("foo")));
```