# SubSystem

## 种类

- UEngineSubsystem
- UEditorSubsystem
- UGameInstanceSubsystem
- UWorldSubsystem
- ULocalPlayerSubsystem

分别对应五种outer：

- UEngine* GEngine;
- UEditorEngine* GEditor;
- UGameInstance* GameInstance;
- UWorld* World;
- ULocalPlayer* LocalPlayer;

## 功能

- 自动实例化

- 托管生命周期

  Subsystem对象的生命周期取决于其依存的Outer对象的生命周期，随Outer对象的创建而创建，随Outer对象的销毁而销毁

注：

对象A去访问Subsystem，Subsystem的访问接口会判断A的ContextObject是否能够获得相应的Subsystem对象。

比如UWorldSubsystem，根据ContextObject，A得到该World的时候才能访问UWorldSubsystem。从UObject或者UserWidget里去访问时则会返回null。

## 实现机制

### 创建

五类Outer对象创建Subsystem时，都会调用

FSubsystemCollectionBase::Initialize(UObject* newOuter),

并把this作为Outer传进去

```cpp
void FSubsystemCollectionBase::Initialize(UObject* NewOuter)
{
    if (BaseType->IsChildOf(UDynamicSubsystem::StaticClass()))//如果是UDynamicSubsystem的子类
    {
        for (const TPair<FName, TArray<TSubclassOf<UDynamicSubsystem>>>& SubsystemClasses : DynamicSystemModuleMap)
        {
            for (const TSubclassOf<UDynamicSubsystem>& SubsystemClass : SubsystemClasses.Value)
            {
                if (SubsystemClass->IsChildOf(BaseType))
                {
                    AddAndInitializeSubsystem(SubsystemClass);
                }
            }
        }
    }
    else
    {   //普通Subsystem对象的创建
        TArray<UClass*> SubsystemClasses;
        GetDerivedClasses(BaseType, SubsystemClasses, true);//反射获得所有子类

        for (UClass* SubsystemClass : SubsystemClasses)
        {
            AddAndInitializeSubsystem(SubsystemClass);//添加初始化Subsystem对象创建
        }
    }
}
```

- AddAndInitializeSubsystem(SubsystemClass);

  ```cpp
  bool FSubsystemCollectionBase::AddAndInitializeSubsystem(UClass* SubsystemClass)
  {
      //...省略一些判断语句，咱们只看核心代码
      const USubsystem* CDO = SubsystemClass->GetDefaultObject<USubsystem>();
      if (CDO->ShouldCreateSubsystem(Outer))  //从CDO调用ShouldCreateSubsystem来判断是否要创建
      {
          USubsystem*& Subsystem = SubsystemMap.Add(SubsystemClass);//创建且添加到Map里
          Subsystem = NewObject<USubsystem>(Outer, SubsystemClass);//创建对象
  
          Subsystem->InternalOwningSubsystem = this;//保存父指针
          Subsystem->Initialize(*this);   //调用Initialize
  
          return true;
      }
  }
  ```

### 销毁

Outer对象要被销毁时，内部都会调用SubsystemCollection.Deinitialize();

```cpp
void FSubsystemCollectionBase::Deinitialize()
{
    //...省略一些清除代码
    for (auto Iter = SubsystemMap.CreateIterator(); Iter; ++Iter)   //遍历Map
    {
        UClass* KeyClass = Iter.Key();
        USubsystem* Subsystem = Iter.Value();
        if (Subsystem->GetClass() == KeyClass)
        {
            Subsystem->Deinitialize();  //反初始化
            Subsystem->InternalOwningSubsystem = nullptr;
        }
    }
    SubsystemMap.Empty();
    Outer = nullptr;
}
```

