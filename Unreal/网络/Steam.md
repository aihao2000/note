# Steam开发流程

- 

- {ProjectName}.Build.cs

  添加

  ```cpp
  publicDependencyModuleNames.AddRange(
      new string[]{
          ...,
          "OnlineSubsystemSteam",
          "OnlineSubsystem"}
  );
  ```

- 修改DefaultEngine.ini

  添加

  ```ini
  [/Script/Engine.GameEngine]
  +NetDriverDefinitions=(DefName="GameNetDriver",DriverClassName="OnlineSubsystemSteam.SteamNetDriver",DriverClassNameFallback="OnlineSubsystemUtils.IpNetDriver")
  
  [OnlineSubsystem]
  DefaultPlatformService=Steam
  
  [OnlineSubsystemSteam]
  bEnabled=true
  SteamDevAppId=480
  
  ; If using Sessions
  ; bInitServerOnClient=true
  
  [/Script/OnlineSubsystemSteam.SteamNetDriver]
  NetConnectionClassName="OnlineSubsystemSteam.SteamNetConnection"
  ```

- 代码中获取OnlineSubsystem

  ```cpp
  IOnlineSubsystem* OnlineSubsystem=IOnlineSubsystem::Get();
  ```

- 获取接口

  ```cpp
  IOnlineSessionPtr OnlineSessionInterface=OnlineSubsystem->GetSessionInterface();
  //在头文件时，不可使用前置声明，因为IOnlineSessionPtr是使用typedef定义的
  TSharedPtr<class IOnlineSession,ESPMode::ThreadSafe> OnlineSessionInterface;
  ```

  - IOnlineSessionPtr

    ```cpp
    typedef TSharedPtr<class IOnlineSession,ESPMode::ThreadSafe>  IOnlineSessionPtr
    ```

    

- 