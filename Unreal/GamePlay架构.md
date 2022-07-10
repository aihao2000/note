# Gameplay架构

## Actor与Component

万物皆UObject，并用UClass为此一一命名。

进而有Actor。

ScnenCompomnent中包含Transform，并可以自由装卸给Actor。

<<<<<<< HEAD
## Level（ULevel）

World由一个或多个Level组成。

- ALevelScriptActor

  管理关卡

- AInfo

  关卡的各种规则属性
  
  - AWorldSettings
  
    仅仅和Level相关，当Level被添加进World后，这个Level的Settings如果是主PersistentLevel（持久关卡），那么它就会被当作整个World的WorldSettings。

Actors里也保存着AWorldSettings和ALevelScriptActor的指针

## World（UWorld）

用SubLevel拼装称为Level

- FWorldContext

  负责World之间切换的上下文，也负责Level之间切换的操作信息。

  存储于GameInstance

## UEngine

分化出两个类

- UGameEngine
- UEditorEngine

在基类中，通过WorldList保存所有World

最后实例化出来的UEngine实例用一个全局的GEngine变量来保存。

## GamePlayStatics

```c++
UCLASS ()
class UGameplayStatics : public UBlueprintFunctionLibrary 
```

常用的C++版蓝图函数库

## APawn

- 可被Controller控制
- PhysicsCollision表示
- MovementInput的基本相应接口

![image-20220703163824766](GamePlay%E6%9E%B6%E6%9E%84.assets/image-20220703163824766.png)

### DefaultPawn

默认的Pawn类型

- DefaultPawnMovementComponent
- SphericalCollisionComponent
- StaticMeshComponent

### SpectatorPawn

基于DefaultPawn派生而来。

自带一个USpectatorPawnMovement（不带重力漫游），关闭了StaticMesh的显示，碰撞设置到了Spectator通道

### Character

- CharacterMovementComponent
- CapsuleComponent

## Controller
=======
## AController

- 能够和Pawn对应起来
- 多个控制实例
- 可挂载释放
- 能够脱离Pawn存在
- 操纵Pawn生死的能力
- 根据配置自动生成
- 事件响应
- 持续的运行
- 自身有状态
- 拥有一定的扩展组合继承能力
- 保存数据状态
- 可在世界里移动
- 可探查世界对象
- 可同步

![image-20220705142308829](E:\note\Unreal\GamePlay架构.assets\image-20220705142308829.png)

### 功能

- 决策类，而非决策行为的实现
- 可用于多个Pawn的通用逻辑
- 维护Pawn，因为生命周期长于Pawn

### PlayerController

![image-20220705145357101](E:\note\Unreal\GamePlay架构.assets\image-20220705145357101.png)

### 功能

- Camera的管理，通过PlayerCameraManager这一个关联的很紧密的摄像机管理类

- Input系统，包括构建InputStack用来路由输入事件。

  也包括了自己对输入事件的处理，包含了UPlauerInput来委托处理

- UPlayer关联，可以是本例的（LocalPlayer），也可以是网络控制的（UNetConnection）。PlayerController只有在SetPlayer后，才可以正常工作

- HUD显示

- Level的切换

  PlayerController作为网络中的通道，在一起进行LevelTravelling的时候，也都是通过PlayerController来进行RPC调用，然后由PlayerController来转发到自己的World中来实际进行

- Voice，也是为了方便网络中语音聊天的一些控制函数



## APlayerState

继承自AInfo，有多少个玩家就会有多少个APlayerState。

切换关卡时，APlayerState也会被释放掉。

![image-20220705144441749](E:\note\Unreal\GamePlay架构.assets\image-20220705144441749.png)

>>>>>>> c0e423a5bc4e8626f4283feb5a76e142399b73c3
