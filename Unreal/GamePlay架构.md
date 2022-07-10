# Gameplay架构

## Actor与Component

万物皆UObject，并用UClass为此一一命名。

进而有Actor。

ScnenCompomnent中包含Transform，并可以自由装卸给Actor。

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
