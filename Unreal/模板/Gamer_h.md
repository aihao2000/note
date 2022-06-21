```cpp
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Gamer.generated.h"


UCLASS()
class DREAMLANDS_API AGamer : public ACharacter
{


	GENERATED_BODY()
public:
	virtual void BeginPlay() override;
public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;
protected:
	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

public:
	FORCEINLINE class USpringArmComponent* GetSprintArm()const { return SpringArm; }
	FORCEINLINE class UCameraComponent* GetCamera()const { return Camera; }
public:
	AGamer();
	UPROPERTY(VisibleAnywhere, Category = Camera, meta = (AllowPrivateAccess = "true"))
		class USpringArmComponent* SpringArm=nullptr;
	UPROPERTY(VisibleAnywhere, Category = Camera, meta = (AllowPrivateAccess = "true"))
		class UCameraComponent* Camera = nullptr;

	UPROPERTY(VisibleAnyWhere)
		UStaticMeshComponent* MagicStaff = nullptr;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Input)
		float TurnRateGamepad=50.0f;//视角灵敏度

	float RunningTime=0.0f;//运行时间

	
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float RestTime=0.0f;
	//速度 
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float WalkForwardSpeed=100.0f;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float RunSpeed=300.0f;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float CrouchSpeed=85.0f;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float ProneSpeed=50.0f;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		float JumpSpeed=365.0f;

	//运动状态
	UPROPERTY(VisibleAnywhere,BlueprintReadWrite)
		bool RunPressed=false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool CrouchPressed = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool InProne = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool JumpPressed = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool AttackPressed = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool SpecialAttackPressed = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool DefendPressed = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite)
		bool DisableMovement = false;
	UPROPERTY(VisibleAnywhere,BlueprintReadOnly)
		bool InBattle = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		bool IsFirstPerson = false;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		bool UsePropsPressed = false;//DisarmPressed的值可通过UsePropsPressed的值来判断
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		bool InteractPressed = false;
	bool FreeViewPressed = false;


	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		TArray<class AWeapon*> Weapons;
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
		class AWeapon* Weapon=nullptr;
	UPROPERTY(EditDefaultsOnly)
	TSubclassOf<class AWeapon> WeaponClass;
		

public:
	void RunBegin();
	void RunEnd();

	void CrouchBegin();
	void CrouchEnd();

	void ProneSwirch();

	void JumpBegin();
	void JumpEnd();

	void MoveForward(float Value);
	void MoveRight(float Value);

	void TurnAtRate(float Rate);
	void LookUpAtRate(float Rate);

	virtual void AttackBegin();
	virtual void AttackEnd();

	virtual void DefendBegin();
	virtual void DefendEnd();

	void UsePropsOrDisarmBegin();
	void UsePropsOrDisarmEnd();

	virtual void UsePropsBegin();
	void UsePropsEnd();

	void DisarmBegin();
	virtual void DisarmEnd();

	void ViewSwitch();

	void MoveForwardBegin();
	void MoveForwardEnd();

	void InteractOrSpecialAttackBegin();
	void InteractOrSpecialAttackEnd();

	virtual void SpecialAttackBegin();
	void SpecialAttackEnd();

	void InteractBegin();
	void InteractEnd();

	void ViewFreeBegin();
	void ViewFreeEnd();




};

```

