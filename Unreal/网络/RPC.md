# Remote Procedure Calls

- 必须从Actor调用
- Acotr必须被复制
- RPC服务端调用，客户端执行，只有实际拥有这个actor的客户端才会执行
- RPC客户端调用，服务端执行，客户端必须拥有调用RPC的Actor

## 类型

在UFUNCTION中指定，实现函数名需要加_Implementation后缀

- Server

  只在服务器上调用

- Client

  在拥有该函数所属actor的客户端上调用。

- NetMulticast

  在与服务器连接的所有客户端及服务器本身上调用。

## 可靠性

在UFUNCTION中指定Reliable，Unreliable

## 验证

UFUNCTION中指定WithValidation

返回值为bool，在试图调用_Implementation时调用该函数判断是否可执行。