# thread

## 构造函数（启动线程）

### 通过全局函数构造

```cpp
void do_some_work();
std::thread my_thread(do_some_work);
```

### 通过类成员函数构造

第二个参数需要传启动函数所属对象的地址

```cpp
class A
{
public:
	void Af(int a,int b)
	{
		cout << a << ' ' << b;
	}
	void run()
	{
		int a = 1, b = 2;
		thread t(&A::Af, this,a, b);
		t.join();
	}
};
```

### 通过可调用类型构造

```cpp
class background_task
{
public:
  void operator()() const
  {
    do_something();
    do_something_else();
  }
};
background_task f;
std::thread my_thread(f);

std::thread my_thread((background_task()));  // 正确
std::thread my_thread{background_task()};    // 正确
std::thread my_thread(background_task()); //错误，会被解析定义了个返回值为std::thread的函数
```

提供的函数对象会复制到新线程的存储空间中

## 传递参数

传递引用参数使用std::ref

```cpp
class A
{
public:
	void f(int& a,int b)
	{
		cout << a << ' ' << b;
	}
	void run()
	{
		int a = 1, b = 2;
		thread t(&A::f, this,std::ref(a), b);
		t.join();
	}
};
```



## .native_handle()

允许通过使用相关平台的API直接操作底层实现

## .join()

加入到主线程中

## .detach()

分离于主线程，在后台进行
主线程将不能与之直接交互
不可能有std::thread对象能引用它
归属和控制，资源的正确回收由C++运行库处理

## .get_id()

## std::thread::hardware_concurrency()

返回能同时并发在一个程序中的线程数量

# this_thread

## this_thread::sleep_for()

## this_thread::sleep_until()

当前线程休眠

## this_thread::yield()

放弃当前线程的时间片，使CPU重新调度以便其他线程执行