# future

当一个线程需要等待一个特定的一次性事件时，在某种程度上来说它就需要知道这个事件在未来的表现形式.

可以获取异步任务得结果，或在必要情况下阻塞调用者并等待共享标志变为ready，然后才能获取共享状态的值简单的线程间同步的手段

只可移动不可拷贝

std::future可以处理在线程间数据转移的必要同步，但是调用某一特殊的成员函数会使这个线程的数据和其他线程不同步。多线程在没有额外同步的情况下，访问一个std::future对象就会有数据竞争和未定义行为。std::future模型独享同步结果的所有权，并且通过调用get()函数，一次性获取数据，无法并发访问（因为调用get()后就没有值可以再获取了）

future可以被联系于：

- 线程

  async将会返回一个future对象

- 一个函数

  packaged_task可以get一个future对象

- 

## .get()

阻塞线程直到“期望”状态为就绪为止。之后返回结果,一次性事件，之后.valid()为flase

## .wait()

等待结果变得可用

## .wait_for()

等待结果，如果再指定的事件间隔后仍然无法得到结果，则返回

## .wait_until()

等待结果，如果在到达指定时间点时仍然无法得到结果，则返回

## .valid()

检查future是否拥有共享状态

## .share()

# async

std::async是一个函数模板，会启动一个异步任务，最终返回一个std::future对象

启动一个异步任务，返回一个std::future对象，这个对象持有最终计算出来的结果

## 构造函数

基本同thread，但第一个参数可以传递std::launch下的值，

- std::launch::async

  启动一个线程来执行任务

- std::launch::defered

  延迟到wait()或get()时再执行函数

  ```cpp
  auto f2=std::async(std::launch::defered,move_only());//延迟到wait()或get()执行
  f2.wait();
  ```

- std::launch::deferred | std::launch::async

  

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

- 


# packaged_task

仿函数,当packaged_task对象被调用，它就会调用相关函数或可调用对象，讲期望状态设置为就绪，返回值也会被存储为相关数据。

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

