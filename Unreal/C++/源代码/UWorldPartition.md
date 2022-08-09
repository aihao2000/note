# UWorldPartition

## 数据

- StreamingPolicy

## 方法

- UpdateStreamingState

  ```cpp
  void UWorldPartition::UpdateStreamingState()
  {
  	if (GetWorld()->IsGameWorld())
  	{
  		StreamingPolicy->UpdateStreamingState();
  	}
  }
  
  ```
  
  - StreamingPolicy::UpdateStreamingState();
  
    ```cpp
    void UWorldPartitionStreamingPolicy::UpdateStreamingState()
    {
    	TRACE_CPUPROFILER_EVENT_SCOPE(UWorldPartitionStreamingPolicy::UpdateStreamingState);
    
    	UWorld* World = WorldPartition->GetWorld();
    
    	// Dermine if the World's BlockTillLevelStreamingCompleted was triggered by WorldPartitionStreamingPolicy
    	if (bCriticalPerformanceRequestedBlockTillOnWorld && IsInBlockTillLevelStreamingCompleted())
    	{
    		bCriticalPerformanceRequestedBlockTillOnWorld = false;
    		CriticalPerformanceBlockTillLevelStreamingCompletedEpoch = World->GetBlockTillLevelStreamingCompletedEpoch();
    	}
    	
    	// Update streaming sources
    	UpdateStreamingSources();
    		
    	TSet<const UWorldPartitionRuntimeCell*>& ActivateStreamingCells = FrameActivateCells.GetCells();
    	TSet<const UWorldPartitionRuntimeCell*>& LoadStreamingCells = FrameLoadCells.GetCells();
    
    	const ENetMode NetMode = World->GetNetMode();
    	if (NetMode == NM_Standalone || NetMode == NM_Client || AWorldPartitionReplay::IsEnabled(World))
    	{
    		// When uninitializing, UpdateStreamingState is called, but we don't want any cells to be loaded
    		if (WorldPartition->IsInitialized())
    		{
    			UWorldPartitionRuntimeCell::DirtyStreamingSourceCacheEpoch();
    			WorldPartition->RuntimeHash->GetStreamingCells(StreamingSources, FrameActivateCells, FrameLoadCells);
    
    			// Activation superseeds Loading
    			LoadStreamingCells = LoadStreamingCells.Difference(ActivateStreamingCells);
    		}
    	}
    	else 
    	{
    		// Server will activate all non data layer cells at first and then load/activate/unload data layer cells only when the data layer states change
    		if (DataLayersStatesServerEpoch == AWorldDataLayers::GetDataLayersStateEpoch())
    		{
    			// Server as nothing to do early out
    			return; 
    		}
    
    		const UDataLayerSubsystem* DataLayerSubsystem = WorldPartition->GetWorld()->GetSubsystem<UDataLayerSubsystem>();
    		DataLayersStatesServerEpoch = AWorldDataLayers::GetDataLayersStateEpoch();
    
    		// Non Data Layer Cells + Active Data Layers
    		WorldPartition->RuntimeHash->GetAllStreamingCells(ActivateStreamingCells, /*bAllDataLayers=*/ false, /*bDataLayersOnly=*/ false, DataLayerSubsystem->GetEffectiveActiveDataLayerNames());
    
    		// Loaded Data Layers Cells only
    		if (DataLayerSubsystem->GetEffectiveLoadedDataLayerNames().Num())
    		{
    			WorldPartition->RuntimeHash->GetAllStreamingCells(LoadStreamingCells, /*bAllDataLayers=*/ false, /*bDataLayersOnly=*/ true, DataLayerSubsystem->GetEffectiveLoadedDataLayerNames());
    		}
    	}
    
    	if (!UHLODSubsystem::IsHLODEnabled())
    	{
    		// Remove all HLOD cells from the Activate & Load cells
    		auto RemoveHLODCells = [](TSet<const UWorldPartitionRuntimeCell*>& Cells)
    		{
    			for (auto It = Cells.CreateIterator(); It; ++It)
    			{
    				if ((*It)->GetIsHLOD())
    				{
    					It.RemoveCurrent();
    				}
    			}
    		};
    		RemoveHLODCells(ActivateStreamingCells);
    		RemoveHLODCells(LoadStreamingCells);
    	}
    
    	// Determine cells to load/unload
    	TSet<const UWorldPartitionRuntimeCell*> ToActivateCells = ActivateStreamingCells.Difference(ActivatedCells);
    	TSet<const UWorldPartitionRuntimeCell*> ToLoadCells = LoadStreamingCells.Difference(LoadedCells);
    	TSet<const UWorldPartitionRuntimeCell*> ToUnloadCells = ActivatedCells.Union(LoadedCells).Difference(ActivateStreamingCells.Union(LoadStreamingCells));
    
    #if !UE_BUILD_SHIPPING
    	UpdateDebugCellsStreamingPriority(ActivateStreamingCells, LoadStreamingCells);
    #endif
    
    	if(World->bMatchStarted)
    	{
    		WORLDPARTITION_LOG_UPDATESTREAMINGSTATE(Verbose);
    	}
    	else
    	{
    		WORLDPARTITION_LOG_UPDATESTREAMINGSTATE(Log);
    	}
    	
    	if (ToUnloadCells.Num() > 0)
    	{
    		SetTargetStateForCells(EWorldPartitionRuntimeCellState::Unloaded, ToUnloadCells);
    	}
    
    	// Do Activation State first as it is higher prio than Load State (if we have a limited number of loading cells per frame)
    	if (ToActivateCells.Num() > 0)
    	{
    		SetTargetStateForCells(EWorldPartitionRuntimeCellState::Activated, ToActivateCells);
    	}
    
    	if (ToLoadCells.Num() > 0)
    	{
    		SetTargetStateForCells(EWorldPartitionRuntimeCellState::Loaded, ToLoadCells);
    	}
    
    	// Sort cells and update streaming priority 
    	{
    		TRACE_CPUPROFILER_EVENT_SCOPE(UWorldPartitionStreamingPolicy::SortCellsAndUpdateStreamingPriority);
    		TSet<const UWorldPartitionRuntimeCell*> AddToWorldCells;
    		for (const UWorldPartitionRuntimeCell* ActivatedCell : ActivatedCells)
    		{
    			if (!ActivatedCell->IsAddedToWorld() && !ActivatedCell->IsAlwaysLoaded())
    			{
    				AddToWorldCells.Add(ActivatedCell);
    			}
    		}
    		WorldPartition->RuntimeHash->SortStreamingCellsByImportance(AddToWorldCells, StreamingSources, SortedAddToWorldCells);
    
    		// Update level streaming priority so that UWorld::UpdateLevelStreaming will naturally process the levels in the correct order
    		const int32 MaxPrio = SortedAddToWorldCells.Num();
    		int32 Prio = MaxPrio;
    		const ULevel* CurrentPendingVisibility = GetWorld()->GetCurrentLevelPendingVisibility();
    		for (const UWorldPartitionRuntimeCell* Cell : SortedAddToWorldCells)
    		{
    			// Current pending visibility level is the most important
    			const bool bIsCellPendingVisibility = CurrentPendingVisibility && (Cell->GetLevel() == CurrentPendingVisibility);
    			const int32 SortedPriority = bIsCellPendingVisibility ? MaxPrio + 1 : Prio--;
    			Cell->SetStreamingPriority(SortedPriority);
    		}
    	}
    
    	// Evaluate streaming performance based on cells that should be activated
    	UpdateStreamingPerformance(ActivateStreamingCells);
    	
    	// Reset frame StreamingSourceCells (optimization to avoid reallocation at every call to UpdateStreamingState)
    	FrameActivateCells.Reset();
    	FrameLoadCells.Reset();
    }
    ```
  
    - ​	UpdateStreamingSources()
  
      ```cpp
      void UWorldPartitionStreamingPolicy::UpdateStreamingSources()
      {
      	if (!GUpdateStreamingSources)
      	{
      		return;
      	}
      
      	TRACE_CPUPROFILER_EVENT_SCOPE(UWorldPartitionStreamingPolicy::UpdateStreamingSources);
      
      	StreamingSources.Reset();
      
      	if (!WorldPartition->IsInitialized())
      	{
      		return;
      	}
      
      #if !UE_BUILD_SHIPPING
      	bool bUseReplaySources = false;
      	if (AWorldPartitionReplay* Replay = WorldPartition->Replay)
      	{
      		bUseReplaySources = Replay->GetReplayStreamingSources(StreamingSources);
      	}
      
      	if (!bUseReplaySources)
      #endif
      	{
      #if WITH_EDITOR
      		// We are in the SIE
      		if (GEnableSimulationStreamingSource && UWorldPartition::IsSimulating())
      		{
      			const FVector ViewLocation = GCurrentLevelEditingViewportClient->GetViewLocation();
      			const FRotator ViewRotation = GCurrentLevelEditingViewportClient->GetViewRotation();
      			static const FName NAME_SIE(TEXT("SIE"));
      			StreamingSources.Add(FWorldPartitionStreamingSource(NAME_SIE, ViewLocation, ViewRotation, EStreamingSourceTargetState::Activated, /*bBlockOnSlowLoading=*/false, EStreamingSourcePriority::Default));
      		}
      		else
      #endif
      		{
      			UWorld* World = WorldPartition->GetWorld();
      			const ENetMode NetMode = World->GetNetMode();
      			if (NetMode == NM_Standalone || NetMode == NM_Client || AWorldPartitionReplay::IsEnabled(World))
      			{
      				const int32 NumPlayers = GEngine->GetNumGamePlayers(World);
      				for (int32 PlayerIndex = 0; PlayerIndex < NumPlayers; ++PlayerIndex)
      				{
      					ULocalPlayer* Player = GEngine->GetGamePlayer(World, PlayerIndex);
      					if (Player && Player->PlayerController && Player->PlayerController->IsStreamingSourceEnabled())
      					{
      						FVector ViewLocation;
      						FRotator ViewRotation;
      						Player->PlayerController->GetPlayerViewPoint(ViewLocation, ViewRotation);
      
      				
      						const EStreamingSourceTargetState TargetState = Player->PlayerController->StreamingSourceShouldActivate() ? EStreamingSourceTargetState::Activated : EStreamingSourceTargetState::Loaded;
      						const bool bBlockOnSlowLoading = Player->PlayerController->StreamingSourceShouldBlockOnSlowStreaming();
      						StreamingSources.Add(FWorldPartitionStreamingSource(Player->PlayerController->GetFName(), ViewLocation, ViewRotation, TargetState, bBlockOnSlowLoading, EStreamingSourcePriority::Default));
      					}
      				}
      			}
      		}
      	
      		for (IWorldPartitionStreamingSourceProvider* StreamingSourceProvider : WorldPartition->StreamingSourceProviders)
      		{
      			FWorldPartitionStreamingSource StreamingSource;
      			// Default Streaming Source provider's priority to be less than those based on player controllers
      			StreamingSource.Priority = EStreamingSourcePriority::Low;
      			if (StreamingSourceProvider->GetStreamingSource(StreamingSource))
      			{
      				StreamingSources.Add(StreamingSource);
      			}
      		}
      	}
      		
      	// Update streaming sources velocity
      	const float CurrentTime = WorldPartition->GetWorld()->GetTimeSeconds();
      	TSet<FName, DefaultKeyFuncs<FName>, TInlineSetAllocator<8>> ValidStreamingSources;
      	for (FWorldPartitionStreamingSource& StreamingSource : StreamingSources)
      	{
      		if (!StreamingSource.Name.IsNone())
      		{
      			ValidStreamingSources.Add(StreamingSource.Name);
      			FStreamingSourceVelocity& SourceVelocity = StreamingSourcesVelocity.FindOrAdd(StreamingSource.Name, FStreamingSourceVelocity(StreamingSource.Name));
      			StreamingSource.Velocity = SourceVelocity.GetAverageVelocity(StreamingSource.Location, CurrentTime);
      		}
      	}
      
      	// Cleanup StreamingSourcesVelocity
      	for (auto It(StreamingSourcesVelocity.CreateIterator()); It; ++It)
      	{
      		if (!ValidStreamingSources.Contains(It.Key()))
      		{
      			It.RemoveCurrent();
      		}
      	}
      }
      ```
  
      
  
    
  
  

## 逻辑

- WorldPartition更新

  - UpdateStreamingState

    通过StreamingPolicy调用UpdateStreamingState

  - 