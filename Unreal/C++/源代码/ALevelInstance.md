# LevelInstance

以关卡为单位批量加载Actor。

实际还是一个Actor（官方的参数名，变量名经常使用LevelInstanceActor）。

以LevelInstanceID为唯一标识符。

## 继承方式

```cpp
UCLASS()
class ENGINE_API ALevelInstance : public AActor
```

## 运行时行为

```cpp
UENUM()
enum class ELevelInstanceRuntimeBehavior : uint8
{
	None UMETA(Hidden),
	// Deprecated exists only to avoid breaking Actor Desc serialization
	Embedded_Deprecated UMETA(Hidden),
	// Default behavior is to move Level Instance level actors to the main world partition using World Partition clustering rules
	Partitioned,
	// Behavior only supported through Conversion Commandlet or on non OFPA Level Instances
	LevelStreaming UMETA(Hidden)
};
```

## LevelInstance的加载卸载

利用LevelInstanceSubsystem去加载卸载。

LevelInstanceSubsystem所属于UWorld

```cpp
public:
void ALevelInstance::LoadLevelInstance()
{
	if(SupportsLoading())
	{
		if (ULevelInstanceSubsystem* LevelInstanceSubsystem = GetLevelInstanceSubsystem())
		{
			bool bForce = false;
			LevelInstanceSubsystem->RequestLoadLevelInstance(this, bForce);
		}
	}
}
```

```cpp
public:
void ALevelInstance::UnloadLevelInstance()
{
	if(SupportsLoading())
	{
		if (ULevelInstanceSubsystem* LevelInstanceSubsystem = GetLevelInstanceSubsystem())
		{
#if WITH_EDITOR
			check(!HasDirtyChildren());
#endif
			LevelInstanceSubsystem->RequestUnloadLevelInstance(this);
		}
	}
}
```

实际调用LevelInstanceSubsystem->RequestLoadLevelInstance

```cpp
void ULevelInstanceSubsystem::RequestLoadLevelInstance(ALevelInstance* LevelInstanceActor, bool bForce /* = false */)
{
	check(LevelInstanceActor && IsValidChecked(LevelInstanceActor) && !LevelInstanceActor->IsUnreachable());
	if (LevelInstanceActor->IsLevelInstancePathValid())
	{
#if WITH_EDITOR
		if (!IsEditingLevelInstance(LevelInstanceActor))
#endif
		{
			LevelInstancesToUnload.Remove(LevelInstanceActor->GetLevelInstanceID());

			bool* bForcePtr = LevelInstancesToLoadOrUpdate.Find(LevelInstanceActor);

			// Avoid loading if already loaded. Can happen if actor requests unload/load in same frame. Without the force it means its not necessary.
			if (IsLoaded(LevelInstanceActor) && !bForce && (bForcePtr == nullptr || !(*bForcePtr)))
			{
				return;
			}

			if (bForcePtr != nullptr)
			{
				*bForcePtr |= bForce;
			}
			else
			{
				LevelInstancesToLoadOrUpdate.Add(LevelInstanceActor, bForce);
			}
		}
	}
}
```

传入LevelInstancesToLoadOrUpdate，可能在某个时刻实际加载。

应该调用的是ULevelInstanceSubsystem::LoadLevelInstance(ALevelInstance* LevelInstanceActor)。

通过override SupprotsLoading来规定LevelInstance可否被加载

```cpp
virtual bool SupportsLoading() const;
```

LevelInstanceSubsystem的获取：

```cpp
ULevelInstanceSubsystem* ALevelInstance::GetLevelInstanceSubsystem() const
{
	if (UWorld* CurrentWorld = GetWorld())
	{
		return CurrentWorld->GetSubsystem<ULevelInstanceSubsystem>();
	}

	return nullptr;
}
```

UWorld下的GetSubsystem

```cpp
template <typename TSubsystemClass>
TSubsystemClass* GetSubsystem() const
{
	return SubsystemCollection.GetSubsystem<TSubsystemClass>(TSubsystemClass::StaticClass());
}

```



