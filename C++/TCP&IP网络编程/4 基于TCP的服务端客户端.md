# 基本函数顺序

## 服务端

- socket()

- bind()

- listen()

- accept()

- read()/write()

- close()
  
  ## socket
  
  ```cpp
  int socket(int domain,int type,int protocol);
  ```
  
  ## bind
  
  ## listen
  
  调用listen进出等待连接请求状态
  
  ```cpp
  int listen(int sock,int backlog);
  ```
  
  成功时返回0，失败时返回-1

- sock
  
  希望进入等待连接请求状态的套接字文件描述符，传递的描述符套接字参数成为服务器端套接字

- backlog
  
  连接请求等待队列的长度
  
  ## accept
  
  ```cpp
  int accept(int sock,struct sockaddr * addr,socklen_t *addrlen);
  ```
  
  成功时返回创建的套接字文件描述符，失败时返回
  创建用于数据I/O的套接字

- sock
  
  服务器套接字的文件描述符

- addr
  
  保存发起连接请求的客户端地址信息的变量地址值，调用函数后向传递来的地址变量参数填充客户端地址信息

- addrlen
  
  第二个参数addr结构体的长度
  
  # 客户端

- socket()

- connect()

- read()/write()

- close()
  
  ## connect()
  
  ```cpp
  int connect(int sock,struct sockaddr * servaddr,socklen_t addrlen);
  ```

- sock 客户端套接字描述符

- servaddr 保存目标服务器地址信息的变量地址值

- addrlen servaddr的长度