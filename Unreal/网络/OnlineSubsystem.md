# IOnlineSubsystem

- 代码中获取OnlineSubsystem

  ```cpp
  IOnlineSubsystem* onlineSubsystem=IOnlineSubsystem::Get();
  ```

- 获取接口

  ```cpp
  //在头文件时，不可使用前置声明，因为IOnlineSessionPtr是使用typedef定义的
  TSharedPtr<class IOnlineSession,ESPMode::ThreadSafe> onlineSessionInterface;
  IOnlineSessionPtr onlineSessionInterface=OnlineSubsystem->GetSessionInterface();
  ```

  - IOnlineSessionPtr

    ```cpp
    typedef TSharedPtr<class IOnlineSession,ESPMode::ThreadSafe>  IOnlineSessionPtr
    ```

# 委托

利用委托来编写网络事件相关逻辑

```cpp
FOnCreateSessionCompleteDelegate  CreateSessionCompleteDelegate(this,Function_Address);
```

# OnlineSessionInterface

## 关于Session

- NAME_GameSession

  默认的GameSession FName

- GetNamedSession

  ```cpp
  virtual class FNamedOnlineSession* GetNamedSession(FName SessionName);
  ```

  ```cpp
  auto ExistingSession=OnlineSessionInterface->GameNamedSession(NAME_GameSession);
  ```

- DestroySession

  ```cpp
  virtual bool DestroySession(const FGuid& SessionId, FText& OutFailureReason) = 0;
  ```


- CreateSession

  ```cpp
  const ULocalPlayer* localPlayer=GetWorld()->GetFirstLocalPlayerFromController();
  onlineSessionInterface->CreateSession(localPlayer->GetPerferredUniqueNetId(),NAME_GameSession,*SessionSettings);
  ```


## 关于Delegate

- AddOnCreateSessionCompleteDelegate_Handle

   ```cpp
   FOnCreateSessionCompleteDelegate  createSessionCompleteDelegate(this,Function_Address);
   onlineSessionInterface->AddOnCreateSessionCompleteDelegate(createSessionCompleteDelegate);
   
   ```

  33 

# FOnlineSessionSettings

```cpp
TSharedPtr<FOnlineSessionSettings> SessionSettings=MakeShareable(new FOnlineSessionSettings());
```



