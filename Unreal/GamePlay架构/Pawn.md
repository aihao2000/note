## APawn

- 可被Controller控制
- PhysicsCollision表示
- MovementInput的基本相应接口

![image-20220703163824766](Pawn.assets/image-20220703163824766.png)

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

