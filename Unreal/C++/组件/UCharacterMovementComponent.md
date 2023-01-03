# UCharacterMovementComponent

输入向量会累积到UPawn::ControlInputVector。

由UPawnMovementComponent::GetPendingInputVector() 取出。

## 网络同步

复制过程是逐帧的（TickComponent）。

当角色执行移动时，网络游戏中所有不同机器上的角色副本会相互生成RPC以同步移动信息。

一次移动的同步过程如下

- 客户端（Autonomouse_Proxy的actor）

  - Autonomouse_Proxy通过TickComponent本地处理移动

  - Autonomouse_Proxy的Actor调用PerformMovement将运行移动组件的物理逻辑
  - Autonomouse_Proxy构建FSavedMove_Character，其中包含角色刚刚的移动数据，然后将其排入SavedMoves队列
  - FSavedMove将被组合在一起。Autonomouse_Proxy使用**ServerMove** RPC将其精简版数据发送到服务器

- 服务端（Authority_Proxy 的actor）

  - 服务器接收到**ServerMove**的RPC并使用**PerformMovement**再现客户端的移动

  - 服务器将检查它在**ServerMove**之后的位置是否与客户端报告的结束位置一致。

    - 如果服务器和客户端的最终位置一致，服务器会向客户端发回信号，表明移动有效。

    - 否则，它会使用 **ClientAdjustPosition** RPC发送校正。

      如果客户端收到ClientAdjustPosition，它会复制服务器的移动并使用SavedMoves队列重新追踪其进程，获取新的最终位置。成功处理动作后，客户端会从队列中移除已存动作。

  - 服务器将复制 ReplicatedMovement结构，从而将其位置、旋转和当前状态发送到其他已连接的其他客户端（具有该actor Simulated_Proxy actor的客户端）。

- 客户端（Simulated_Proxy ）

  - Simulated_Proxy 将直接应用复制的移动信息。

    网络平滑负责提供视觉效果的清理。

## 代码

### PerformMovement

- 施加外部物理效果
- 调用，更具角色使用的移动模式选择函数

每种运动模式都有自己的函数，负责计算速度和加速度。

如果移动模式在函数更新期间发生变化，则会再次执行，受参数（递归最大允许次数）限制

### TickComponent

- ConsumeInputVector获取输入向量

- UCharacterMovementComponent::ControlledCharacterMove

  ```cpp
  if (CharacterOwner->GetLocalRole() == ROLE_Authority)
  	{
  		PerformMovement(DeltaSeconds);
  	}
  	else if (CharacterOwner->GetLocalRole() == ROLE_AutonomousProxy && IsNetMode(NM_Client))
  	{
  		ReplicateMoveToServer(DeltaSeconds, Acceleration);
  	}
  ```

- 
