## 原子类型与原子操作

所有原子对象不能拷贝

一个原子类型的所有操作都是原子的

### std::atomic_flag

最简单最基本的原子操作，表示一个bool标志

必须被ATOMIC_FLAG_INIT()初始化,唯一需要特殊初始化的原子类型，该初始化后为false

C++20起，std::atomic_flag的默认构造函数初始化它为false状态

```cpp
std::atomic_flag flg=ATOMIC_FLAG_INIT();
```

唯一保证无锁的类型

- .clear()

  设置为false

- .test_and_set()

  设置为true，并返回先前值

### std::atomic<>

当用自定义的类型时，这个类型必须有拷贝复制运算符，必须使用编译器创建的拷贝复制操作不能有任何虚函数虚基类

compare_exchange_strong float，double类型对当存储的值与当前值相等时可能会失败

当一个类型为T的atomic赋值给另外一个类型为T的atomic，相当于隐式类型转换，该操作是原子的

- .is_lock_free

  当为true时，访问不会导致线程阻塞

- .store

  修改被封装的值

  ```cpp
  void store (T val, memory_order sync = memory_order_seq_cst) volatile noexcept;
  void store (T val, memory_order sync = memory_order_seq_cst) noexcept;
  ```

  memory_order允许：

  - memory_order_relaxed
  - memory_order_release
  - memory_order_seq_cst

- .load

  读取被封装的值

  ```cpp
  T load (memory_order sync = memory_order_seq_cst) const volatile noexcept;
  T load (memory_order sync = memory_order_seq_cst) const noexcept;
  ```

  memory_order允许：

  - memory_order_relaxed
  - memory_order_consume
  - memory_order_acquire
  - memory_order_seq_cst

- operator T()

- .exchange()

  ```cpp
  T exchange (T val, memory_order sync = memory_order_seq_cst) volatile noexcept;
  T exchange (T val, memory_order sync = memory_order_seq_cst) noexcept;
  ```

  用val的值替换掉之前该原子对象的值，并返回原来的值

- .compare_exchange_weak()

  ```cpp
  bool compare_exchange_weak (T& expected, T val,
             memory_order sync = memory_order_seq_cst) volatile noexcept;
  bool compare_exchange_weak (T& expected, T val,
             memory_order sync = memory_order_seq_cst) noexcept;
  ```

  相等，则用val替换该对象的值

  若不相等则交换当前值与参数val，返回false

  否则返回true

- .fetch_add()

  ```cpp
  T fetch_add (T val, memory_order sync = memory_order_seq_cst) volatile noexcept;
  T fetch_add (T val, memory_order sync = memory_order_seq_cst) noexcept;
  T fetch_add (ptrdiff_t val, memory_order sync = memory_order_seq_cst) volatile noexcept;
  T fetch_add (ptrdiff_t val, memory_order sync = memory_order_seq_cst) noexcept;
  ```

  该对象的值加上val，返回旧值

- .fetch_sub()

- .fetch_and()

- .fetch_or()

- .fetch_xor()

- operator ++



## 原子类型

| 原子类型        | 相关特化类                      |
| :-------------- | :------------------------------ |
| atomic_bool     | std::atomic<bool>               |
| atomic_char     | std::atomic<char>               |
| atomic_schar    | std::atomic<signed char>        |
| atomic_uchar    | std::atomic<unsigned char>      |
| atomic_int      | std::atomic<int>                |
| atomic_uint     | std::atomic<unsigned>           |
| atomic_short    | std::atomic<short>              |
| atomic_ushort   | std::atomic<unsigned short>     |
| atomic_long     | std::atomic<long>               |
| atomic_ulong    | std::atomic<unsigned long>      |
| atomic_llong    | std::atomic<long long>          |
| atomic_ullong   | std::atomic<unsigned long long> |
| atomic_char16_t | std::atomic<char16_t>           |
| atomic_char32_t | std::atomic<char32_t>           |
| atomic_wchar_t  | std::atomic<wchar_t>            |