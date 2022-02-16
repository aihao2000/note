# API

## 线程管理

### thread

- native_handle()
  
  允许通过使用相关平台的API直接操作底层实现

- .join()
  
  加入到主线程中

- .detach()
  
  分离于主线程，在后台进行
  主线程将不能与之直接交互
  不可能有std::thread对象能引用它
  归属和控制，资源的正确回收由C++运行库处理

- .get_id()

### std::thread::hardware_concurrency()

返回能同时并发在一个程序中的线程数量

### std::this_thread::get_id()

获取当前线程id

### std::this_thread::yield()

放弃当前线程的时间片，使CPU重新调度以便其他线程执行

### this_thread::sleep_for()

### this_thread::sleep_until()

当前线程休眠

## 线程间共享数据

- 不要将需要保护的数据当作其他可能在其他地方调用的函数的参数
- 不要让被保护的数据暴露出指针或引用的访问方式

### 避免死锁

- std::lock()
  同时上多个锁
- 避免嵌套锁
- 避免在持有锁时调用用户提供的代码
- 使用固定的顺序获取锁
- 使用锁的层次结构

### std::mutex

- .lock()
- .unlock()

### std::lock_guard<>

构造时上锁，析构时解锁

```cpp
std::mutex a;
std::lock_guard<std::mutex> b(a);
```

### std::unique_lock<>

与std::lock_guard不同的是：std::unique_lock不会总与互斥量的类型相关,允许延迟锁定，锁定的有时限尝试，递归锁定，所有权转移和与条件变量一同使用

- std::adopt_lock
  可作为第二个参数，表明管理的互斥量已经上锁
- std::defer_lock
  可作为第二个参数，表明互斥量应保持解锁状态,不需要自动上锁，之后手动上锁
- std::try_to_lock
  如果无法lock，不会阻塞等待，可以先去执行其他没有被锁的代码
- .tyr_lock()
  作用和构造时加std::try_to_lock参数相同，调用该成员函数时，如果不可以加锁返回flase，否则加锁并返回true
- .release()
  接触unique_lock和mutex对象的联系，并将原mutex对象的指针返回出来

### hierarchical_mutex

层级锁

```cpp
class hierarchical_mutex
{
  std::mutex internal_mutex;

  unsigned long const hierarchy_value;
  unsigned long previous_hierarchy_value;

  static thread_local unsigned long this_thread_hierarchy_value;  // 1

  void check_for_hierarchy_violation()
  {
    if(this_thread_hierarchy_value <= hierarchy_value)  // 2
    {
      throw std::logic_error(“mutex hierarchy violated”);
    }
  }

  void update_hierarchy_value()
  {
    previous_hierarchy_value=this_thread_hierarchy_value;  // 3
    this_thread_hierarchy_value=hierarchy_value;
  }

public:
  explicit hierarchical_mutex(unsigned long value):
      hierarchy_value(value),
      previous_hierarchy_value(0)
  {}

  void lock()
  {
    check_for_hierarchy_violation();
    internal_mutex.lock();  // 4
    update_hierarchy_value();  // 5
  }

  void unlock()
  {
    this_thread_hierarchy_value=previous_hierarchy_value;  // 6
    internal_mutex.unlock();
  }

  bool try_lock()
  {
    check_for_hierarchy_violation();
    if(!internal_mutex.try_lock())  // 7
      return false;
    update_hierarchy_value();
    return true;
  }
};
thread_local unsigned long
     hierarchical_mutex::this_thread_hierarchy_value(ULONG_MAX);  // 7
```

### boost::shared_mutex

保护很少更新的数据结构

- 更新操作
  
  ```cpp
  std::lock_guard<boost::shared_mutex> x;
  std::unique_lock<boost::shared_mutex> x;
  ```

- 读取操作
  
  ```cpp
  boost::shared_lock<boost::shared_mutex> x;
  ```

### std::recursive_mutex

### std::once_flag与std::call_once

初始化数据结构

```cpp
std::once_flg init_flg;
void init();
std::call_once(init_flh,init);
```

### 双重检查初始化

```cpp
void undefined_behaviour_with_double_checked_locking()
{
  if(!resource_ptr)  // 1
  {
    std::lock_guard<std::mutex> lk(resource_mutex);
    if(!resource_ptr)  // 2
    {
      resource_ptr.reset(new some_resource);  // 3
    }
  }
  resource_ptr->do_something();  // 4
}
```



## 同步并发操作

### std::this_thread::sleep_for()

### std::condition_variable std::condition_variable_any

- std::condition_variable_any
  有灵活的硬件需求时选用
- std::condition_variable
  - .notify_one()
    对等待的进程进行通知
  - .notify_all()
  - .wait(std::mutex x,[]()->bool{}))
    当函数返回flase时，线程挂起，mutex x解锁，直到.notify_one()的通知重新判断
    当函数返回true时，继续持有锁

###  std::future<>

可以获取异步任务得结果，或在必要情况下阻塞调用者并等待共享标志变为ready，然后才能获取共享状态的值简单的线程间同步的手段

只可移动不可拷贝

- .get()

​		返回结果,一次性事件，之后.valid()为flase

- .wait()

  等待结果变得可用

- .wait_for()

  等待结果，如果再指定的事件间隔后仍然无法得到结果，则返回

- .wait_until()

  等待结果，如果在到达指定时间点时仍然无法得到结果，则返回

- .valid()

  检查future是否拥有共享状态

- .share()

std::future可以处理在线程间数据转移的必要同步，但是调用某一特殊的成员函数会使这个线程的数据和其他线程不同步。多线程在没有额外同步的情况下，访问一个std::future对象就会有数据竞争和未定义行为。std::future模型独享同步结果的所有权，并且通过调用get()函数，一次性获取数据，无法并发访问（因为调用get()后就没有值可以再获取了）

### std::shared_future

std::shared_future时刻拷贝的，多个对象可以引用同一关联future的结果

### std::async

启动一个异步任务，返回一个std::future对象，这个对象持有最终计算出来的结果

```cpp
struct T
{
  void f(int x){}
};
T t;
auto f1=std::sync(&T::f,&t,0);//执行p->f(0)，p为指向t得指针
auto f2=std::sync(&T::f,t,0);//执行tmp.f2(0)，tmp为t的一份拷贝
T TF(T&);
std::sync(TF,std::ref(t));//调用TF(t)
```

```cpp
struct T
{
  int operator()(int);
};
T t;
auto f1=std::sync(t(),0);//执行tmpt(0),tmpt通过t的移动构造函数得到
auto f2=std::sync(std::ref(t),0);//调用t(0)
```

```cpp
class move_only
{
public:
  move_only();
  move_only(move_only&&)
  move_only(move_only const&) = delete;
  move_only& operator=(move_only&&);
  move_only& operator=(move_only const&) = delete;

  void operator()();
};
auto f=std::async(move_only());  // 调用tmp()，tmp是通过std::move(move_only())构造得到
```

- std::launch::async

  启动一个线程来说执行认任务

  ```cpp
  auto f1=std::async(std::launch::async,move_only());
  ```

-  std::launch::defered

  延迟到wait()或get()执行

  ```cpp
  auto f2=std::async(std::launch::defered,move_only());//延迟到wait()或get()执行
  f2.wait();
  ```

  

### std::packaged_task<>

仿函数

包装一个可调用的对象，并且允许异步获取该调用对象产生得结果

包含两个最基本的元素：

- 被包装的得任务
- 共享状态

```cpp
string f()
{
    return "helloworld";
}
int main()
{
    std::packaged_task<string()> task(f);
    std::future<string> res = task.get_future();
    thread th(task);//用线程执行
    task();//直接执行函数
    cout<<res.get();//"helloworld"
    th.join();
}
```

std::packaged_task模板特化

```cpp
template<>
class packaged_task<std::string(std::vector<char>*,int)>
{
public:
  template<typename Callable>
  explicit packaged_task(Callable&& f);
  std::future<std::string> get_future();
  void operator()(std::vector<char>*,int);
};
```

set::packageda_task作为函数调用时，返回值作为异步结果存储在std::future,可通过.get_future()获取

异常信息会也会存储在future中，待使用get的时候抛出

### std::promise<>

std::promise<T>提供设定值得方式，类型为T，这个类型会和看到的std::future<T>对象相关联

可以将值传给新的线程而不需要手动的同步操作

- .get_future()

  获取一个给定的std::promise相关的std::future对象

  通过get_future()获取空想状态(std::future)后，两个而对象共享相同的共享状态

- .set_value()

  设置共享状态得值

- .set_exception()

  存入异常

- std::current_exception()

  检索抛出的异常

  ```cpp
  some_promise.set_exception(std::current_exception());
  ```

- std::copy_exception()

  直接存储一个新的异常而不抛出

  ```cpp
  some_promise.set_exception(std::copy_exception(std::logic_error("foo")));
  ```


### 时钟

- 现在的时间

  - std::chrono::system_clock::now()

    返回系统时钟的当前时间

- 时间类型

  特定的时间点类型可以通过timie_point的数据typedef成员来指定，即some_clock::now()的类型就是some_clock::time_point

- 时钟节拍

  时钟节拍被指定为1/x秒，x在不同硬件上有不同的值，由时间周期决定

  - std::ratio<x,y>

    时钟节拍每x秒执行y词

- 通过时钟节拍的分布，判断时钟是否稳定

  稳定：时钟节拍均匀分布（无论是否与周期匹配），并且不可调整

  - std::chrono::system_clock

    通常不稳定

  - std::chrono::steady_clock

    C++标准库提供的稳定时钟

  - std::chrono::high_resolution_clock

    可能使标准库提供的具有最小节拍周期

#### 预定义类型

- nanoseconds 纳秒
- microseconds 微秒
- milliseconds 毫秒
- seconds 秒
- minutes 分
- hours 时

#### std::chrono::duration<>

时延

第一个参数是一个类型表示：int,long long,double,......

第二个参数表示每一个单元所用的秒数

延迟支持计算

- .count()

  获得单位时间的数量

```cpp
std::future<int> f=std::async(some_task);
if(f.wait_for(std::chrono::milliseconds(35))==std::future_status::ready)
  do_something_with(f.get());
```

- std::future_status::timeout 超时
- std::future_status::ready future状态改变
- std::future_status::deferred 延迟

#### std::chrono::duration_cast<>

小单位转化为大单位，需要显式时延的转换

```cpp
std::chrono::milliseconds ms(54802);
std::chrono::seconds s=
       std::chrono::duration_cast<std::chrono::seconds>(ms);
//这里的结果是截断的，而不是进行舍入，s最后的值为54
```

#### std::chrono::time_point<>

时间点

第一个参数指定所要使用的时钟

第二个参数用来表示时间的计量单位（特化的std::chrono::duration<>)

可以加减时延获得一个新的时间点

### 具有超时功能的函数

#### std::this_thread::sleep_for(duration)  std::this_thread::skeeo_until(time_piont)

无返回值，休眠一段时间

#### std::condition_variable std::condition_variable_any

- .wait_for(lock,duration)     .wair_until(lock,time_point)

  返回std::cv_status::time_out 或 std::cv_status::no_timeout

- .wair_for(lock,duration,predicate)    .wair_until(lock,time_point,predicate)

  一定时间内，返回谓词结果

#### std::timed_mutex std::recursive_timed_mutex  

- .try_lock_for(duration)  .try_lock_until(time_point) 

  获取锁时返回true，否则返回false

####  std::unique_lock<Timed_Mutex>

- .unique_lock(lockable,duration)

  无返回值，对新构建的对象调用owns_lock()

- .unique_lock(lockable,time_point)

  获取锁时返回true，否则返回flase

- .try_lock_for(duration)    .try_lock_until(time_point)

  返回bool，当获取锁时返回true，否则返回false

#### std::future<Value_Type>      std::shared_future<ValueType>

- wait_until(time_point)

  当future准备就绪时返回std::future_status::ready

  当future持有一个启动的延迟函数，返回std::future_status::deferred

### messaging

## C++内存模型

### 同步模式

- std::memory_order_seq_cst

  顺序一致性模型,不存在重排

- std::memory_order_relaxed

- std::memory_order_acquire

- std::memory_order_consume

- std::memory_order_release

- std::memory_order_acq_rel

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

### counting_semaphore

C++20提供

计数信号量

- release
- acquire
- try_acquire
- try_acquire_for
- try_acquire_until
- max

### binary_semaphore

### C语言POSIX semaphore

```cpp
#include<semaphore.h>
sem_t sem;//信号量声明
```

- sem_init

  第一个参数为初始化的信号量名

  第二个参数为0时，该信号量被该进程内的所有线程所共享，如果非0则被所有进程共享

  第三个参数为初始化信号量值的大小

- sem_post

  信号量+1

- sem_wait(）

  信号量-1

  当信号量等于0时，线程阻塞

