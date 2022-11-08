# async

std::async是一个函数模板，会启动一个异步任务，最终返回一个std::future对象

启动一个异步任务，返回一个std::future对象，这个对象持有最终计算出来的结果

## async()

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

  启动一个线程来说执行任务

  ```cpp
  auto f1=std::async(std::launch::async,move_only());
  ```

- std::launch::defered

  延迟到wait()或get()执行

  ```cpp
  auto f2=std::async(std::launch::defered,move_only());//延迟到wait()或get()执行
  f2.wait();
  ```

  