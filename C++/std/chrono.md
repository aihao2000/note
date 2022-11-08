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