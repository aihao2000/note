# IO复用

## select

### 设置文件描述符

使用fd_set位数组变量执行此项操作。该数组存有0和1的位数组。

- FD_ZETO

  ```cpp
  FD_ZERO(fd_set* fdset);
  //将fd_set变量的所有位初始化为0
  ```

- FD_SET

  ```cpp
  FD_SET(int fd,fd_set *fdset);
  //在参数fdset指向的变量中注册文件描述符fd信息
  ```

- FD_CLR

  ```cpp
  FD_CLR(int fd,fd_set *fdset);
  //在参数fdset指向的变量中清楚文件描述符fd信息
  ```

- FD_ISSET

  ```cpp
  FD_CLR(int fd,fd_set *fdset);
  //检查参数fdset指向的变量中是否拥有文件描述符fd信息
  ```

### 设置检查范围及超时

```cpp
#include <sys/select.h>
#include <sys/time.h>
int select(int maxfd,fd_set *readset,fd_set *writeset,fd_set *exceptset,const struct timeval *timeout)
```

- maxfd 监视文件描述符的数量

- readset

  关注是否存在待读的数据

- writeset

  关注是否可传输无阻塞数据

- exceptset

  关注是否发生异常

- timeout

  调用select，防止无限阻塞，传递超时信息

- 返回值

  发生错误返回-1，超时返回0，发生关注事件返回时，返回发生事件的文件描述符数

## epoll

### eploll_create

创建文件描述符，通常称为“epoll例程”

```cpp
#include <sys/epoll.h>
int epoll_create(int size);
```

### epoll_ctl

在例程内部注册监视对象文件描述符

```cpp
#include<sys/epoll.h>
int epoll_ctl(int epfd,int op,int fd,struct epoll_event *event);
```

- epfd

  用于注册监视对象的epoll例程的文件描述符

- op

  用于指定监视对象的添加，删除或更改操作

  - EPOLL_CTL_ADD

- fd

  需要注册的监视对象文件描述符

- event

  监视对象的事件类型

### epool_wait

```cpp
#include<sys/epoll.h>
int epoll_wait(int epfd,struct epoll_event *events,int maxevents,int timeout);
```

- epfd

  表示事件发生监视范围内的epoll例程的文件描述符

- events

  保存发生时间的文件描述符集合

- maxevents

  可以保存的最大事件数

- timeout

  已1/1000秒为单位的等待时间，传递-1时，一直等待直到发生事件