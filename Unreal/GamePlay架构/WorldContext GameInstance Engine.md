### FWorldContext



一般来说独立运行的游戏WorldContext只有一个。

#### 存储信息

- ThisCurrentWorld

- 保存World里Level切换的上下文

  ```cpp
  struct FWorldContext
  {
      [...]
  	TEnumAsByte<EWorldType::Type>	WorldType;
  
  	FSeamlessTravelHandler SeamlessTravelHandler;
  
  	FName ContextHandle;
  
  	/** URL to travel to for pending client connect */
  	FString TravelURL;
  
  	/** TravelType for pending client connects */
  	uint8 TravelType;
  
  	/** URL the last time we traveled */
  	UPROPERTY()
  	struct FURL LastURL;
  
  	/** last server we connected to (for "reconnect" command) */
  	UPROPERTY()
  	struct FURL LastRemoteURL;
  
  }
  ```

FWorldContext

负责World之间切换的上下文，也负责Level之间切换的操作信息。

存储于GameInstance

## UEngine

分化出两个类

- UGameEngine
- UEditorEngine

在基类中，通过WorldList保存所有World

最后实例化出来的UEngine实例用一个全局的GEngine变量来保存。