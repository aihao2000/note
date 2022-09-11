# AWorldDataLayer

## 数据

- DataLayerNames

  ```cpp
  	// TSet do not support replication so we replicate an array and update the set in the OnRep_ActiveDataLayerNames/OnRep_LoadedDataLayerNames
  	TSet<FName> ActiveDataLayerNames;
  	TSet<FName> LoadedDataLayerNames;
  ```

  

- EffectiveDataLayerNames

  ```cpp
  	// TSet do not support replication so we replicate an array and update the set in the OnRep_EffectiveActiveDataLayerNames/OnRep_EffectiveLoadedDataLayerNames
  	TSet<FName> EffectiveActiveDataLayerNames;
  	TSet<FName> EffectiveLoadedDataLayerNames;
  ```

  

- RepEffectiveDataLayerNames

  ```cpp
  	UPROPERTY(Transient, Replicated, ReplicatedUsing=OnRep_EffectiveActiveDataLayerNames)
  	TArray<FName> RepEffectiveActiveDataLayerNames;
  		
  	UPROPERTY(Transient, Replicated, ReplicatedUsing=OnRep_EffectiveLoadedDataLayerNames)
  	TArray<FName> RepEffectiveLoadedDataLayerNames;
  ```

  

## 方法

- SetDataLayerRuntimeState

  ```cpp
  void AWorldDataLayers::SetDataLayerRuntimeState(FActorDataLayer InDataLayer, EDataLayerRuntimeState InState, bool bInIsRecursive)
  {
  	if (ensure(GetLocalRole() == ROLE_Authority))
  	{
  		const UDataLayer* DataLayer = GetDataLayerFromName(InDataLayer.Name);
  		if (!DataLayer || !DataLayer->IsRuntime())
  		{
  			return;
  		}
  
  		EDataLayerRuntimeState CurrentState = GetDataLayerRuntimeStateByName(InDataLayer.Name);
  		if (CurrentState != InState)
  		{
  PRAGMA_DISABLE_DEPRECATION_WARNINGS
  			if (GetWorld()->IsGameWorld())
  			{
  				FName DataLayerLabelName = DataLayer->GetDataLayerLabel();
  				if (DataLayersFilterDelegate.IsBound())
  				{
  					if (!DataLayersFilterDelegate.Execute(DataLayerLabelName, CurrentState, InState))
  					{
  						UE_LOG(LogWorldPartition, Log, TEXT("Data Layer '%s' was filtered out: %s -> %s"),
  							*DataLayerLabelName.ToString(),
  							*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)CurrentState).ToString(),
  							*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)InState).ToString());
  						return;
  					}
  				}
  			}
  PRAGMA_ENABLE_DEPRECATION_WARNINGS
  
  			LoadedDataLayerNames.Remove(InDataLayer.Name);
  			ActiveDataLayerNames.Remove(InDataLayer.Name);
  
  			if (InState == EDataLayerRuntimeState::Loaded)
  			{
  				LoadedDataLayerNames.Add(InDataLayer.Name);
  			}
  			else if (InState == EDataLayerRuntimeState::Activated)
  			{
  				ActiveDataLayerNames.Add(InDataLayer.Name);
  			}
  			else if (InState == EDataLayerRuntimeState::Unloaded)
  			{
  				GLevelStreamingContinuouslyIncrementalGCWhileLevelsPendingPurgeOverride = 1;
  			}
  
  			// Update Replicated Properties
  			RepActiveDataLayerNames = ActiveDataLayerNames.Array();
  			RepLoadedDataLayerNames = LoadedDataLayerNames.Array();
  
  			++DataLayersStateEpoch;
  
  #if !NO_LOGGING || CSV_PROFILER
  			const FString DataLayerLabel = DataLayer->GetDataLayerLabel().ToString();
  			UE_LOG(LogWorldPartition, Log, TEXT("Data Layer '%s' state changed: %s -> %s"),
  				*DataLayerLabel, 
  				*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)CurrentState).ToString(),
  				*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)InState).ToString());
  
  			CSV_EVENT_GLOBAL(TEXT("DataLayer-%s-%s"), *DataLayerLabel, *StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)InState).ToString());
  #endif
  
  			ResolveEffectiveRuntimeState(DataLayer);
  		}
  
  		if (bInIsRecursive)
  		{
  			DataLayer->ForEachChild([this, InState, bInIsRecursive](const UDataLayer* Child)
  			{
  				SetDataLayerRuntimeState(Child->GetFName(), InState, bInIsRecursive);
  				return true;
  			});
  		}
  	}
  }
  ```

  简化版本：

   ```cpp
   void AWorldDataLayers::SetDataLayerRuntimeState(FActorDataLayer InDataLayer, EDataLayerRuntimeState InState, bool bInIsRecursive)
   {
   	if (ensure(GetLocalRole() == ROLE_Authority))
   	{
           const UDataLayer* DataLayer = GetDataLayerFromName(InDataLayer.Name);
   		EDataLayerRuntimeState CurrentState = GetDataLayerRuntimeStateByName(InDataLayer.Name);
   		if (CurrentState != InState)
   		{
   			LoadedDataLayerNames.Remove(InDataLayer.Name);
   			ActiveDataLayerNames.Remove(InDataLayer.Name);
   			if (InState == EDataLayerRuntimeState::Loaded)
   			{
   				LoadedDataLayerNames.Add(InDataLayer.Name);
   			}
   			else if (InState == EDataLayerRuntimeState::Activated)
   			{
   				ActiveDataLayerNames.Add(InDataLayer.Name);
   			}
   			else if (InState == EDataLayerRuntimeState::Unloaded)
   			{
   				GLevelStreamingContinuouslyIncrementalGCWhileLevelsPendingPurgeOverride = 1;
   			}
   
   			// Update Replicated Properties
   			RepActiveDataLayerNames = ActiveDataLayerNames.Array();
   			RepLoadedDataLayerNames = LoadedDataLayerNames.Array();
   
   			++DataLayersStateEpoch;
   			ResolveEffectiveRuntimeState(DataLayer);
   		}
   		if (bInIsRecursive)
   		{
   			DataLayer->ForEachChild([this, InState, bInIsRecursive](const UDataLayer* Child)
   			{
   				SetDataLayerRuntimeState(Child->GetFName(), InState, bInIsRecursive);
   				return true;
   			});
   		}
   	}
   }
   ```

  进而调用ResolveEffectiveRuntimeState

- ResolveEffectiveRuntimeState

  ```cpp
  void AWorldDataLayers::ResolveEffectiveRuntimeState(const UDataLayer* InDataLayer, bool bInNotifyChange)
  {
  	check(InDataLayer);
  	const FName DataLayerName = InDataLayer->GetFName();
  	EDataLayerRuntimeState CurrentEffectiveRuntimeState = GetDataLayerEffectiveRuntimeStateByName(DataLayerName);
  	EDataLayerRuntimeState NewEffectiveRuntimeState = GetDataLayerRuntimeStateByName(DataLayerName);
  	const UDataLayer* Parent = InDataLayer->GetParent();
  	while (Parent && (NewEffectiveRuntimeState != EDataLayerRuntimeState::Unloaded))
  	{
  		if (Parent->IsRuntime())
  		{
  			// Apply min logic with parent DataLayers
  			NewEffectiveRuntimeState = (EDataLayerRuntimeState)FMath::Min((int32)NewEffectiveRuntimeState, (int32)GetDataLayerRuntimeStateByName(Parent->GetFName()));
  		}
  		Parent = Parent->GetParent();
  	};
  
  	if (CurrentEffectiveRuntimeState != NewEffectiveRuntimeState)
  	{
  		EffectiveLoadedDataLayerNames.Remove(DataLayerName);
  		EffectiveActiveDataLayerNames.Remove(DataLayerName);
  
  		if (NewEffectiveRuntimeState == EDataLayerRuntimeState::Loaded)
  		{
  			EffectiveLoadedDataLayerNames.Add(DataLayerName);
  		}
  		else if (NewEffectiveRuntimeState == EDataLayerRuntimeState::Activated)
  		{
  			EffectiveActiveDataLayerNames.Add(DataLayerName);
  		}
  
  		// Update Replicated Properties
  		RepEffectiveActiveDataLayerNames = EffectiveActiveDataLayerNames.Array();
  		RepEffectiveLoadedDataLayerNames = EffectiveLoadedDataLayerNames.Array();
  
  		++DataLayersStateEpoch;
  
  		if (bInNotifyChange)
  		{
  			UE_LOG(LogWorldPartition, Log, TEXT("Data Layer '%s' effective state changed: %s -> %s"),
  				*InDataLayer->GetDataLayerLabel().ToString(),
  				*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)CurrentEffectiveRuntimeState).ToString(),
  				*StaticEnum<EDataLayerRuntimeState>()->GetDisplayNameTextByValue((int64)NewEffectiveRuntimeState).ToString());
  
  			OnDataLayerRuntimeStateChanged(InDataLayer, NewEffectiveRuntimeState);
  		}
  
  		for (const UDataLayer* Child : InDataLayer->GetChildren())
  		{
  			ResolveEffectiveRuntimeState(Child);
  		}
  	}
  }
  ```


## 逻辑

- **DataLayerNames**与**EffectiveDataLayerNames**

  **DataLayer**存在父子关系，可能存在父**DataLayer** unload，而代码去设置了子**DataLayer** load，因此设置了两种Set维护**DataLayer**的状态，**DataLayerNames**维护代码修改之后的状态，可能父子DataLayerState是不兼容（实际运行存在不生效的设置），在设置**DataLayerNamesState**后，由**ResolveEffectiveRuntimeState**去判断实际运行时的状态（根据父**DataLayer**的状态）**EffectiveDataLayerNames**维护运行过程中真实的**DataLayerState**。
