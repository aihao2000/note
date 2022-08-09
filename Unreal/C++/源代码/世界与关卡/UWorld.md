# UWorld

## 继承方式

```cpp
class ENGINE_API UWorld final : public UObject, public FNetworkNotify
```

## 关卡管理

### 数据

- PersistentLevel
  ```cpp
  UPROPERTY(Transient)
  TObjectPtr<class ULevel>	PersistentLevel;
  ```
  
  持久关卡包括WorldInfo，在游戏过程中生成默认的brush和Actors
  
- StreamingLevels

  ```cpp
  UPROPERTY(Transient)
  TArray<TObjectPtr<ULevelStreaming>> StreamingLevels;
  ```

  Level集合。

  ULevels通过FName被引用（来避免serialized references）。

  并且包含一个世界偏移量

- StreamingLevelsToConsider

  ```cpp
  UPROPERTY(Transient, DuplicateTransient)
  FStreamingLevelsToConsider StreamingLevelsToConsider;
  ```

  ~~标记流关卡的状态~~

- CurrentLevelPendingVisibility CurrentLevelPendingInvisibility

  关卡可见性控制

  ```cpp
  UPROPERTY(Transient)
  TObjectPtr<class ULevel>								CurrentLevelPendingVisibility;
  
  /** Pointer to the current level in the queue to be made invisible, NULL if none are pending. */
  UPROPERTY(Transient)
  TObjectPtr<class ULevel>								CurrentLevelPendingInvisibility;
  ```

  

### 方法

- IsStreamingLevelBeingConsidered

  ```cpp
  bool IsStreamingLevelBeingConsidered(ULevelStreaming* StreamingLevel) const { return StreamingLevelsToConsider.Contains(StreamingLevel); }
  ```

- GetStreamingLevels

  ```cpp
  const TArray<ULevelStreaming*>& GetStreamingLevels() const { return StreamingLevels; }
  ```

- void AddStreamingLevel(s)

  ```cpp
  /** Add a streaming level to the list of streamed levels to consider. */
  void AddStreamingLevel(ULevelStreaming* StreamingLevelToAdd);
  
  /** Add multiple streaming levels to the list of streamed levels to consider.  */
  void AddStreamingLevels(TArrayView<ULevelStreaming* const> StreamingLevelsToAdd);	
  ```

- RemoveStreamingLevel(At/s)

  ```cpp
  bool RemoveStreamingLevel(ULevelStreaming* StreamingLevelToRemove);
  
  /** Remove a streaming level to the list of streamed levels to consider.
  *  Returns true if the specified index was a valid index for removal.
  */
  bool RemoveStreamingLevelAt(int32 IndexToRemove);
  
  /** Remove multiple streaming levels to the list of streamed levels to consider. 
   * Returns a count of how many of the specified levels were in the streaming levels list
   */
  int32 RemoveStreamingLevels(TArrayView<ULevelStreaming* const> StreamingLevelsToRemove);
  ```

- ClearStreamingLevels

  ```cpp
  /** Reset the streaming levels array */
  void ClearStreamingLevels();
  ```

- GetFirstPlayerController()

  - GetFirstPlayerController()->GetPawn()

  - GetFirstPlayerController()->PlayerState

- GetGameInstance()

- GetGameState() 

- GetAuthGameMode()

- bool LineTraceSingleByChannel(FHitResult Hit,FVector Location,FVector End,ECollisionCHannel)

  ```cpp
  FVector Location;
  FRotator Rotation;
  GetplayerViewPoint(Location,Rotation);
  FVector End=Location+Rotation.Vector()*1000;
  FHitResult Hit;
  bool bSuccess=GetWorld()->LineTraceSingleByChannel(Hit,Location,End,EcollisionChannel::ECC_GameTraceChannel1);
  if(bSuccess)
  {
      //从Location到End的线上存在一个物体，并且该物体的相关信息存储于Hit中。
      DrawDebugPoint(GetWorld(),Hit.Location,20,Fcolor::Red,true);
      //绘制击中点
  }
  ```

- ServerTravel()

## 世界表现

- 物理

  ```cpp
  private:
  UPROPERTY(Transient)
  TObjectPtr<APhysicsVolume>								DefaultPhysicsVolume;
  public:
  uint8 bShouldSimulatePhysics:1;
  ```

- Tick

  ```cpp
  /** The current ticking group																								*/
  TEnumAsByte<ETickingGroup> TickGroup;
  /**
  * Sets whether or not this world is ticked by the engine, but use it at your own risk! This could
  * have unintended consequences if used carelessly. That said, for worlds that are not interactive
  * and not rendering, it can save the cost of ticking them. This should probably never be used
  * for a primary game world.
   */
  void SetShouldTick(const bool bInShouldTick) { bShouldTick = bInShouldTick; }
  /** Returns whether or not this world is currently ticking. See SetShouldTick. */
  bool ShouldTick() const { return bShouldTick; }
  ```

## 子系统

获取子系统

```cpp
/**
* Get a Subsystem of specified type
*/
template <typename TSubsystemClass>
TSubsystemClass* GetSubsystem() const
{
	return SubsystemCollection.GetSubsystem<TSubsystemClass>(TSubsystemClass::StaticClass());
}
```

```cpp
/**
* Get a Subsystem of specified type from the provided GameInstance
* returns nullptr if the Subsystem cannot be found or the GameInstance is null
*/
template <typename TSubsystemClass>
static FORCEINLINE TSubsystemClass* GetSubsystem(const UWorld* World)
{
	if (World)
	{
		return World->GetSubsystem<TSubsystemClass>();
	}
	return nullptr;
}
```

