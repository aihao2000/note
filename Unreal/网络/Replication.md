# Replication

actor是Replication的基本单位。

设置**bReplicates=true**

Replication指服务器向客户端发送数据的单向行为。数据不会从客户端传向服务器。

服务器会按照**AActor::NetUpdateFrequency**属性指定的频率复制actor。

- Creation and Destruction

  当一个authoritative Actor被创建在服务端上，服务端会自动在连接的客户端上生成他的代理。

  如果一个authoritative Actor被销毁，它也会自动销毁连接客户端上的远程代理。

- Movement Replication

  bReplicateMovement为ture时，将会自动复制他的位置旋转和速度。

- Property Replication

  成员变量复制

## Network Role

当前端对Actor的控制权。也可以说是actor的一个属性，Actor在网络模型中扮演的角色。

Local Role和Remote Role变量，可取以下值：

- None

  不在网络游戏中扮演任何角色，并且无复制

- Authority_Proxy 主控

  这一个权威版本的Actor，它讲同步他的信息给其他机器上的代理版本

- Autonomouse_Proxy自治代理

  可在本地执行一些功能，通常用于PlayerController所拥有的actor。这说明此actor会直接接受来自控制者的输入

- Simulated_Proxy 模拟代理

  根据上次获得的速度对移动推算。当服务器为该actor发送更新时，客户端将向新的方位调整位置，利用更新的的间隙，根据由服务器发送的最近的速率值移动actor。

用GetLocalRole()==ROLE_xxx判断一个actor的Role类型

虚幻的默认模型网络模型：

- 服务器拥有Authority Actor，复制总是服务端向客户端的
- 客户端拥有模拟代理或自治代理的actor

由上文提到的，服务器会根据**AActor::NetUpdateFrequency**属性指定的频率来复制actor，数据的变动并不连续，客户端更新的间隙会有两种模拟方式即Autonomouse_Proxy和Simulated_Proxy 。

## NetRelevance

相关性。决定执行复制的时机。不在玩家附近且OwningActor不是该玩家，不会进行复制。

可通过override以下函数控制相关性：

- IsNetRelevantFor
- NetCullDistanceSquared

## NetPriority

单帧无法全部复制时，根据actor的优先级进行复制。

- Actor 1.0
- Matinee 2.7
- Pawn 3.0
- PlayerCOntroller

和优先级为 1.0 的 Actor 相比，优先级是 2.0 的 Actor 可以得到两倍的更新频度。

通过Actor::GetNetPriority()计算。GetNetPriority会考虑Actor和观察者的相对位置以及距离，还有距上次复制经过的时间。

## Variable Replication

一个Actor被标记为Replicated，可以设置其需要同步的属性为replicated。在指定为复制变量的值变更时，其将自动从授权Actor复制到其远程代理。

实现GetLifetimerReplicatedProps，使用DOREPLIFETIME（类名，属性名）添加replicated的属性。

## 网络更新优化

### 数据驱动型网络更新频率

NetUpdateFrequency的值

### 自适应型网络更新频率

需要设置控制台变量启用net.UseAdaptiveNetUpdateFrequency为1

- NetUpdateFrequency

  每秒尝试更新最大次数

- MinNetUpdateFrequency

  每秒尝试更新最小次数

有意义的更新为任意复制字段值的更新。

#### 更新频率降低算法

如果两秒后没有发送有意义的更新，降低更新频率，七秒后达到最小。

#### 更新频率增加算法

发送有意义的更新时间，新的更新发送将比上两次发送有意义更新的时间短30%，但仍在最大最小更新频率之间。

## 条件属性复制

默认值发生变化则被复制，也可利用**DOREPLIFETIME_CONDITION**宏添加附加条件

```cpp
void AActor::GetLifetimeReplicatedProps( TArray< FLifetimeProperty > & OutLifetimeProps ) const
{
    DOREPLIFETIME_CONDITION( AActor, ReplicatedProperty, COND_SimulatedOnly );
}
```

- COND_InitialOnly

  该属性仅在初始数据组尝试发送

- COND_OwnerOnly

  该属性仅发送至 actor 的所有者

- COND_SkipOwner

  该属性将发送至除所有者之外的每个连接

- COND_SimulatedOnly

  该属性仅发送至模拟 actor

- COND_AutonomousOnly

  该属性仅发送给自治 actor

- COND_SimulatedOrPhysics

  该属性将发送至模拟或 bRepPhysics actor

- COND_InitialOrOwner

  该属性将发送初始数据包，或者发送至 actor 所有者

- COND_Custom

  该属性没有特定条件，但需要通过 SetCustomIsActiveOverride 得到开启/关闭能力

也可使用**DOREPLIFETIME_ACTIVE_OVERRIDE**完全自定条件,在bReplicateMovement为true时复制

```cpp
void AActor::PreReplication( IRepChangedPropertyTracker & ChangedPropertyTracker )
{
    DOREPLIFETIME_ACTIVE_OVERRIDE( AActor, ReplicatedProperty, bReplicateMovement );
}
```

- <u>如果定制条件的值变化太大，这种做法会降低执行速度。</u>

- <u>不能使用根据连接而变化的条件（此时不检查 RemoteRole）</u>

## 复制对象

```cpp
class ENGINE_API AActor : public UObject
{
    UPROPERTY( replicated )
    AActor * Owner;
};
```

可以通过以下原则确定给是否可以通过网络引用一个对象：

- 任何复制的actor都可以被复制为一个引用

  如上例，Owner的bReplicates应为true

- <u>任何非复制的actro都必须有可靠命名</u>

- 任何复制的组件都可以复制为一个引用

- 任何非复制的组件都必须有可靠命名

- 其他所有UObject必须由加载的数据包直接提供

### 可靠命名

拥有可靠命名的对象指的是存在于服务器和客户端上的同<u>名</u>对象

如果actor是从数据包直接加载（而非本地在游戏期间生成），它们就被认为拥有可靠命名。

可靠命名的组件需满足以下条件：

- 从数据包直接加载

- 通过简单构建脚本添加

- <u>采用手动标记（通过 进行） UActorComponent::SetNetAddressable</u>

  <u>只有当您知道要手动命名组件以便其在服务器和客户端上具有相同名称时，才应当使用这种方法（最好的例子就是 C++ 构造函数中添加的组件） AActor</u>

## 复制子对象

Actor现在具有将子对象注册到所属Actor或Actor**组件**上的列表的方法。

这些已注册子对象的复制由**Actor**通道自动处理。Actor::ReplicateSubobjects

//TO LEARN

## RepNotify 

RepNotify函数将在标记为ReplicatedUsing的变量被远程复制信息变更时调用。
