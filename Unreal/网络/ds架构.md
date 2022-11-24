# ds架构

## 核心Actor分布

### GameMode

只存在于Server上，不能进行属性同步

### GameState，PlayerState

存在于服务器和客户端上

### PlayerController

服务器上存在所有玩家的PlayerController，。

客户端只存在自己的PlayerController。

服务端对每个连接都一个专门为其创建的PlayerController

### Pawn

存在于服务器和客户端上

## cs交互

- 复制
- RPC