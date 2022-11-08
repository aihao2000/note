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