# UWorld

## 方法

- GetFirstPlayerController()

  - GetFirstPlayerController()->GetPawn()

  - GetFirstPlayerController()->PlayerState

- GetGameInstance()

- GetGameState() 

- GetAuthGameMode()

- bool LineTraceSingleByChannel(FHitResult Hit,FVector Location,FVector End,ECollisionCHannel)

  ```cpp
  FVector Location;
  FRotator Rotation;
  GetplayerViewPoint(Location,Rotation);
  FVector End=Location+Rotation.Vector()*1000;
  FHitResult Hit;
  bool bSuccess=GetWorld()->LineTraceSingleByChannel(Hit,Location,End,EcollisionChannel::ECC_GameTraceChannel1);
  if(bSuccess)
  {
      //从Location到End的线上存在一个物体，并且该物体的相关信息存储于Hit中。
      DrawDebugPoint(GetWorld(),Hit.Location,20,Fcolor::Red,true);
      //绘制击中点
  }
  ```

- ServerTravel()