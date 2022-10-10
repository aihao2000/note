# Steam开发流程

## 项目配置

- 启用OnlineSubsystem Steam Plugin

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

- 修改{ProjectName}\Config\DefaultEngine.ini

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

  480可以直接用于测试

- 删除

  - **{ProjectName}\Saved**
  -  **{ProjectName}\Intermediate** 
  - **{ProjectName}\Binaries**

- 右键**{ProjectName}.uproject**       点击**Generate VisualStudio project files**

- 双击**{ProjectName}.uproject** 打开项目

 

  