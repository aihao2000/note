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

### epoll_create

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

### epoll_wait

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

# IO复用原理

## socket概念补充

socket会创建一个由文件系统管理的socket对象。

socket对象包含了：

- 发送缓冲区

- 接收缓冲区

- 等待队列

  指向所有需要等待该socket事件的进程

socket接收到数据后，操作系统将该socket等待队列上的进程重新放回到工作队列。

socket对应着一个端口号，网络数据包包含了ip和端口的信息。

## select流程

- 调用select后，操作系统把进程A分别加入socket的等待队列
- 任何一个socket收到数据，中断将换起进程

## epoll流程

- epoll_create，内核会创建一个eventpoll对象（文件系统的一员），也会拥有等待队列
- epoll_ctl，内核会将eventpoll添加到这三个的等待队列中
- socket收到数据，中断程序会给eventpoll的就绪列表rdlist添加socket引用
- epoll_wait，如果rdlist已经引用了socket，直接返回，如果为空，阻塞进程，把该进程加入eventpoll的等待队列中
- socket接收到数据，中断程序一方面修改rdlist，另一方面唤醒eventpoll等待队列中的进程