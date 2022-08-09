# UComponent

## 成员函数

- AttachToComponent

  - KeepRelativeTransform

    这个的意思是被附着组件的本地坐标是什么，就会在附着后变成一样的本地坐标，也就是附着组件的位置会影响此组件，所以此组件的世界位置就不一定能保持不变，在附着后。

  - KeepWorldTransform

    

    这个的意思就和上一个相对应，是保持自己的世界坐标，也就是附着组件的位置不会影响此组件所以此组件，此的世界位置就一定能保持不变，在附着后。

  - SnapToTargetNotIncludingScale

    直接拉到附着组件上面，也就是直接相当于（0，0，0）的本地位置，[Scale](https://so.csdn.net/so/search?q=Scale&spm=1001.2101.3001.7020)归为（1，1，1）

  - SnapToTargetIncludingScale

  

### UStaticMeshComponent

静态网格体组件

### USkeletalMeshComponent

骨骼网格体组件

### UBoxComponent

- SetBoxExtent(FVector(double,double,double))
- SetSimulatePhysics(bool);
- BodyInstance.bLockXRoation
- BodyInstance.bLockYRoation

## UPhysicsThrusterComponent

#include "PhysicsEngine/PhysicsThrusterComponent.h"

- SetupAttachment(<_ComponentName>)

- SetAutoActivate(bool)

- SetWorldRotation(FVevtor)

  #include "Kismet/KismetMathLibrary.h"

  可利用

  UKismetMathLibrary::MakeRotFromX(FVector)

  构建FVector

## 方法

### CreateDefaultSubobject<_ClassName>(TEXT(""));
