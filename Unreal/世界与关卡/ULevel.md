# ULevel

## 继承方式

```cpp
UCLASS(MinimalAPI)
class ULevel : public UObject, public IInterface_AssetUserData, public ITextureStreamingContainer
```

## Actors管理

### 数据定义

```cpp
	/** Array of all actors in this level, used by FActorIteratorBase and derived classes */
	TArray<AActor*> Actors;

	/** Array of actors to be exposed to GC in this level. All other actors will be referenced through ULevelActorContainer */
	TArray<AActor*> ActorsForGC;

	UPROPERTY(Transient, DuplicateTransient, NonTransactional)
	TObjectPtr<ULevelActorContainer> ActorCluster;

```

### 方法

```cpp
```



## 联系世界

```cpp
	/** Set before calling LoadPackage for a streaming level to ensure that OwningWorld is correct on the Level */
	ENGINE_API static TMap<FName, TWeakObjectPtr<UWorld> > StreamedLevelsOwningWorld;
		
	/** 
	 * The World that has this level in its Levels array. 
	 * This is not the same as GetOuter(), because GetOuter() for a streaming level is a vestigial world that is not used. 
	 * It should not be accessed during BeginDestroy(), just like any other UObject references, since GC may occur in any order.
	 */
	UPROPERTY(Transient)
	TObjectPtr<UWorld> OwningWorld;
```

## 脚本管理Actor（关卡蓝图）

```cpp
	/** The level scripting actor, created by instantiating the class from LevelScriptBlueprint.  This handles all level scripting */
	UPROPERTY(NonTransactional)
	TObjectPtr<class ALevelScriptActor> LevelScriptActor;
```

## 光影效果

```cpp
	/** Level offset at time when lighting was built */
	UPROPERTY()
	FIntVector LightBuildLevelOffset;

	/** 
	 * Whether the level is a lighting scenario.  Lighting is built separately for each lighting scenario level with all other scenario levels hidden. 
	 * Only one lighting scenario level should be visible at a time for correct rendering, and lightmaps from that level will be used on the rest of the world.
	 * Note: When a lighting scenario level is present, lightmaps for all streaming levels are placed in the scenario's _BuildData package.  
	 *		This means that lightmaps for those streaming levels will not be streamed with them.
	 */
	UPROPERTY()
	uint8 bIsLightingScenario:1;
```

## 事件

```cpp
	DECLARE_MULTICAST_DELEGATE(FLevelCleanupEvent);
	FLevelCleanupEvent OnCleanupLevel;
```

## 关卡类型

```cpp
	/** Returns true if the current level is a partitioned level */
	ENGINE_API bool IsPartitionedLevel() const;

	/** Returns true if the current level is a sublevel (managed by a parent partitioned level) */
	ENGINE_API bool IsPartitionSubLevel() const;

	/** 
	* Is this the persistent level 
	*/
	ENGINE_API bool IsPersistentLevel() const;

	/** 
	* Is this the current level in the world it is owned by
	*/
	ENGINE_API bool IsCurrentLevel() const;
	
	/**
	 * Is this a level instance
	 */
	ENGINE_API bool IsInstancedLevel() const;
```

