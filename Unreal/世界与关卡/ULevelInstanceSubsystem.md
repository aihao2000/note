# ULevelInstanceSubsystem

LevelInstance管理。



TMap<ALevelInstance*, bool> LevelInstancesToLoadOrUpdate;

## 加载卸载关卡实例

```cpp
void ULevelInstanceSubsystem::LoadLevelInstance(ALevelInstance* LevelInstanceActor)
{
	check(LevelInstanceActor);
	if (IsLoaded(LevelInstanceActor) || !IsValidChecked(LevelInstanceActor) || LevelInstanceActor->IsUnreachable() || !LevelInstanceActor->IsLevelInstancePathValid())
	{
		return;
	}

	const FLevelInstanceID& LevelInstanceID = LevelInstanceActor->GetLevelInstanceID();
	check(!LevelInstances.Contains(LevelInstanceID));

	if (ULevelStreamingLevelInstance* LevelStreaming = ULevelStreamingLevelInstance::LoadInstance(LevelInstanceActor))
	{
	}
}
```

```cpp
void ULevelInstanceSubsystem::UnloadLevelInstance(const FLevelInstanceID& LevelInstanceID)
{
				
	FLevelInstance LevelInstance;
	if (LevelInstances.RemoveAndCopyValue(LevelInstanceID, LevelInstance))
	{
		if (ULevel* LoadedLevel = LevelInstance.LevelStreaming->GetLoadedLevel())
		{
			ForEachActorInLevel(LoadedLevel, [this](AActor* LevelActor)
			{
				if (ALevelInstance* LevelInstanceActor = Cast<ALevelInstance>(LevelActor))
				{
					// Make sure to remove from pending loads if we are unloading child can't be loaded
					LevelInstancesToLoadOrUpdate.Remove(LevelInstanceActor);
					
					UnloadLevelInstance(LevelInstanceActor->GetLevelInstanceID());
				}
				return true;
			});
		}

		ULevelStreamingLevelInstance::UnloadInstance(LevelInstance.LevelStreaming);
	}
#endif
}
```

