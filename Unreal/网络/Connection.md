# Connection

- actor可以关联于一个连接/actor可以被连接拥有/actor的拥有者是一个连接。

- 每个连接都有一个专门为其创建的PlayerController。
- 一个actor的拥有者是PlayerController，那这个actor同样被这个连接所拥有。
- bOnlyRelevantToOwner 为true的actor，只有拥有这个actor的连接才可以接收到这个actor属性的更新。

## 所有权作用

- 可以在服务端通RPC精确的客户端
- 