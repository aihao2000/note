# AActor

## 数据

- TSet<UActorComponent*> OwnedComponents 

  保存这个Actor所拥有的所有Component，一般其中会有一个SceneComponent作为RootComponent。

- TArray<UActorComponent*> InstanceComponents

  保存着实例化的Component



## 方法

- Replication
- Spawn
- Tick
- GetWorldTimerManager()
  - ClearTimer(Handle)
  - SetTimer(Handle,this,&AActor::FunctionName,Interval,true)

