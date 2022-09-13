# api

- ServerTravel

  ```cpp
  bool UWorld::ServerTravel(const FString& FURL, bool bAbsolute, bool bShouldSkipGameNotify)
  ```

  - FURL

    PackagePath/PackageName?listen

    打开此level并作为监听服务器

- OpenLevel

  ```cpp
  void UGameplayStatics::OpenLevel(const UObject* WorldContextObject, FName LevelName, bool bAbsolute, FString Options)
  ```

  - WorldContextObject

    this

  - LevelName

    IPAddress

- PlayerController::ClientTravel

  ```cpp
  void APlayerController::ClientTravel(const FString& URL, ETravelType TravelType, bool bSeamless, FGuid MapPackageGuid)
  GetGameInstance()->GetFirstLocalPlayerController()->ClientTravel();
  
  ```

  

