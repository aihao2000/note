# mutex

## .lock()

## .unlock()

# timed_mutex

# recursive_mutex

# recursive_timerd_mutex

# shared_timed_mutex

# shared_mutex

# lock_guard

构造时上锁，析构时解锁

```cpp
std::mutex a;
std::lock_guard<std::mutex> b(a);
```

# std::unique_lock

与std::lock_guard不同的是：std::unique_lock不会总与互斥量的类型相关,允许延迟锁定，锁定的有时限尝试，递归锁定，所有权转移和与条件变量一同使用

## .tyr_lock()

作用和构造时加std::try_to_lock参数相同，调用该成员函数时，如果不可以加锁返回flase，否则加锁并返回true

## .release()

接触unique_lock和mutex对象的联系，并将原mutex对象的指针返回出来

## std::adopt_lock

可作为第二个参数，表明管理的互斥量已经上锁

## std::defer_lock

可作为第二个参数，表明互斥量应保持解锁状态,不需要自动上锁，之后手动上锁

## std::try_to_lock

如果无法lock，不会阻塞等待，可以先去执行其他没有被锁的代码

# std::once_flag与std::call_once

初始化数据结构

```cpp
std::once_flg init_flg;
void init();
std::call_once(init_flg,init);
```

