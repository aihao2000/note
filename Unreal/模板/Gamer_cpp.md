```cpp
// Fill out your copyright notice in the Description page of Project Settings.

#pragma once
#include "Gamer.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/Controller.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "GameFramework/Character.h"
#include "Kismet/KismetMathLibrary.h"
#include "Engine/World.h"
#include "Weapon.h"

#define debug_output(x)if (GEngine)GEngine->AddOnScreenDebugMessage(-1, 10, FColor::Red, x)
// Sets default values
AGamer::AGamer()
{
	// Set this pawn to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
	
	GetCapsuleComponent()->InitCapsuleSize(80.0f, 95.0f);

	
	
	//bUseControllerRotationPitch = false;
	//bUseControllerRotationYaw = false;
	//bUseControllerRotationRoll = false;
	

	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->bUseControllerDesiredRotation = true;
	GetCharacterMovement()->bIgnoreBaseRotation = true;
	GetCharacterMovement()->RotationRate = FRotator(0.0f, 500.0f, 0.0f);
	GetCharacterMovement()->JumpZVelocity = JumpSpeed;
	GetCharacterMovement()->AirControl = 0.35f;
	GetCharacterMovement()->MaxWalkSpeed = WalkForwardSpeed;
	GetCharacterMovement()->MaxWalkSpeedCrouched = CrouchSpeed;
	GetCharacterMovement()->MinAnalogWalkSpeed = 20.0f;
	GetCharacterMovement()->BrakingDecelerationWalking = 2000.f;

	GetMesh()->SetRelativeLocation(FVector(0, 0, -100));

	SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
	SpringArm->SetupAttachment(GetMesh(),TEXT("headSocket"));
	//SpringArm->SetupAttachment(GetMesh());
	SpringArm->SetRelativeLocation(FVector(0, 43.072698, 0.013053));
	SpringArm->TargetArmLength = 300.0f;
	SpringArm->bUsePawnControlRotation = true;

	Camera = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
	Camera->SetupAttachment(SpringArm,USpringArmComponent::SocketName);//将摄像机固定在吊杆的末端，让吊杆调整以匹配控制器的方向
	Camera->bUsePawnControlRotation = true;

	MagicStaff = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MagicStaff"));
	MagicStaff->SetupAttachment(GetMesh(), TEXT("WeaponSocket"));
	MagicStaff->SetHiddenInGame(true);

}
// Called when the game starts or when spawned
void AGamer::BeginPlay()
{
	Super::BeginPlay();
	
}

void AGamer::TurnAtRate(float Rate)
{
	AddControllerYawInput(Rate * TurnRateGamepad * GetWorld()->GetDeltaSeconds());
}

void AGamer::LookUpAtRate(float Rate)
{
	AddControllerPitchInput(Rate * TurnRateGamepad * GetWorld()->GetDeltaSeconds());
}



void AGamer::AttackBegin()
{
	RestTime = 0;
	if (DefendPressed)return;
	RestTime = 0;
	InBattle = 1;
	AttackPressed = true;

}

void AGamer::AttackEnd()
{
	AttackPressed = false;;
}

void AGamer::DefendBegin()
{
	RestTime = 0;
	if (AttackPressed)return;
	DefendPressed = true;
}

void AGamer::DefendEnd()
{
	DefendPressed = false;
}

void AGamer::UsePropsOrDisarmBegin()
{
	RestTime = 0;
	if (InBattle)
	{
		DisarmBegin();
	}
	else
	{
		UsePropsBegin();
	}
	
}
void AGamer::UsePropsOrDisarmEnd()
{
	if (UsePropsPressed)
	{
		UsePropsEnd();
	}
	else
	{
		DisarmEnd();
	}
}

void AGamer::UsePropsBegin()
{
	UsePropsPressed = true;
}

void AGamer::UsePropsEnd()
{
	UsePropsPressed = false;
}

void AGamer::DisarmBegin()
{
	InBattle = false;
}

void AGamer::DisarmEnd()
{

}

void AGamer::ViewSwitch()
{
	IsFirstPerson = !IsFirstPerson;
	if (IsFirstPerson)
	{
		SpringArm->TargetArmLength = 0;
	}
	else
	{
		SpringArm->TargetArmLength = 300.0f;
	}
}

void AGamer::MoveForwardBegin()
{

}

void AGamer::MoveForwardEnd()
{
}

void AGamer::InteractOrSpecialAttackBegin()
{
	if (InBattle)
	{
		SpecialAttackBegin();
		
	}
	else
	{
		InteractPressed = true;
	}
}
void AGamer::SpecialAttackBegin()
{
	SpecialAttackPressed = true;
}

void AGamer::SpecialAttackEnd()
{
	SpecialAttackPressed = false;
}

void AGamer::InteractBegin()
{
	InteractPressed = true;
}

void AGamer::InteractEnd()
{
	InteractPressed = false;
}

void AGamer::InteractOrSpecialAttackEnd()
{
	if (SpecialAttackPressed)
	{
		SpecialAttackEnd();
	}
	else
	{
		InteractEnd();
	}
}

void AGamer::ViewFreeBegin()
{
	FreeViewPressed = true;
	SpringArm->AttachToComponent(GetMesh(),FAttachmentTransformRules::KeepWorldTransform);
	GetCharacterMovement()->bUseControllerDesiredRotation = false;
	bUseControllerRotationYaw = false;
}

void AGamer::ViewFreeEnd()
{
	SpringArm->AttachToComponent(GetMesh(), FAttachmentTransformRules::KeepWorldTransform, TEXT("headSocket"));
	GetCharacterMovement()->bUseControllerDesiredRotation = true;
	bUseControllerRotationYaw = true;
}



void AGamer::RunBegin()
{
	RestTime = 0;
	RunPressed = true;
	GetCharacterMovement()->MaxWalkSpeed = RunSpeed; 
}

void AGamer::RunEnd()
{
	RunPressed = false;
	if (CrouchPressed)
	{
		GetCharacterMovement()->MaxWalkSpeed = CrouchPressed;
	}
	else
	{
		GetCharacterMovement()->MaxWalkSpeed = WalkForwardSpeed;
	}
}

void AGamer::CrouchBegin()
{
	RestTime = 0;
	CrouchPressed = true;
	GetCharacterMovement()->MaxWalkSpeed = CrouchSpeed;
	ACharacter::Crouch();
}

void AGamer::CrouchEnd()
{
	CrouchPressed = false;
	if (RunPressed)
	{
		GetCharacterMovement()->MaxWalkSpeed = RunSpeed;
	}
	else
	{
		GetCharacterMovement()->MaxWalkSpeed = WalkForwardSpeed;
	}
	ACharacter::UnCrouch();
}

void AGamer::ProneSwirch()
{
	RestTime = 0;
	InProne = !InProne;
	if (InProne)
	{
		GetCharacterMovement()->MaxWalkSpeed = ProneSpeed;
	}
	else
	{
		GetCharacterMovement()->MaxWalkSpeed = WalkForwardSpeed;
	}
}


void AGamer::JumpBegin()
{
	RestTime = 0;
	if (InProne)
	{
		InProne = false;
		return;
	}
	if (CrouchPressed)
	{
		return;
	}
	ACharacter::Jump();
	RestTime = 0;
	JumpPressed = true;
}

void AGamer::JumpEnd()
{
	ACharacter::StopJumping();
	JumpPressed = false;
	RestTime = 0;
}
void AGamer::MoveForward(float Value)
{
	if (DisableMovement)return;
	if ((Controller != nullptr) && (Value != 0.0f))
	{
		RestTime = 0;

		if (Value > 0)
		{
			AddMovementInput(GetActorForwardVector(), Value);
		}
		else
		{
			//方案1，使用控制器旋转 
		// find out which way is forward
			const FRotator Rotation = Controller->GetControlRotation();
			const FRotator YawRotation(0, Rotation.Yaw, 0);

			// get forward vector
			const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
			AddMovementInput(Direction, Value);
		}
	}
}

void AGamer::MoveRight(float Value)
{
	if (DisableMovement)return;
	if ( (Controller != nullptr) && (Value != 0.0f) )
	{
		RestTime = 0;

		////方案一，使用控制器控制移动方向
		//// find out which way is right
		//const FRotator Rotation = Controller->GetControlRotation();
		//const FRotator YawRotation(0, Rotation.Yaw, 0);
	
		//// get right vector 
		//const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);
		//// add movement in that direction
		//AddMovementInput(Direction, Value);

		//方案二，
		AddMovementInput(GetActorRightVector() * Value);
		
	}
}

// Called every frame
void AGamer::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	RestTime += DeltaTime;
	RunningTime += DeltaTime;
}

// Called to bind functionality to input
void AGamer::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	check(PlayerInputComponent);

	PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &AGamer::JumpBegin);
	PlayerInputComponent->BindAction("Jump", IE_Released, this, &AGamer::JumpEnd);

	PlayerInputComponent->BindAction("Run", IE_Pressed, this, &AGamer::RunBegin);
	PlayerInputComponent->BindAction("Run", IE_Released, this, &AGamer::RunEnd);

	PlayerInputComponent->BindAction("Crouch", IE_Pressed, this, &AGamer::CrouchBegin);
	PlayerInputComponent->BindAction("Crouch", IE_Released, this, &AGamer::CrouchEnd);

	PlayerInputComponent->BindAction("Prone", IE_Pressed, this, &AGamer::ProneSwirch);

	PlayerInputComponent->BindAxis("MoveForward/Backward", this, &AGamer::MoveForward);
	PlayerInputComponent->BindAction("MoveForward", IE_Pressed, this, &AGamer::MoveForwardBegin);
	PlayerInputComponent->BindAction("MoveForward", IE_Released, this, &AGamer::MoveForwardEnd);

	PlayerInputComponent->BindAxis("MoveRight/Left", this, &AGamer::MoveRight);

	PlayerInputComponent->BindAxis("TurnRight/LeftMouse", this, &AGamer::TurnAtRate);
	PlayerInputComponent->BindAxis("LookUp/DownMouse", this, &AGamer::LookUpAtRate);
	


	PlayerInputComponent->BindAction("Attack", IE_Pressed, this, &AGamer::AttackBegin);
	PlayerInputComponent->BindAction("Attack", IE_Released, this, &AGamer::AttackEnd);

	PlayerInputComponent->BindAction("Defend", IE_Pressed, this, &AGamer::DefendBegin);
	PlayerInputComponent->BindAction("Defend", IE_Released, this, &AGamer::DefendEnd);


	PlayerInputComponent->BindAction("ViewSwitch", IE_Released, this, &AGamer::ViewSwitch);

	PlayerInputComponent->BindAction("UseProps/Disarm", IE_Pressed, this, &AGamer::UsePropsOrDisarmBegin);
	PlayerInputComponent->BindAction("UseProps/Disarm", IE_Released, this, &AGamer::UsePropsOrDisarmEnd);

	PlayerInputComponent->BindAction("Interact/SpecialAttack", IE_Pressed, this, &AGamer::InteractOrSpecialAttackBegin);
	PlayerInputComponent->BindAction("Interact/SpecialAttack", IE_Released, this, &AGamer::InteractOrSpecialAttackEnd);

	PlayerInputComponent->BindAction("ViewFree", IE_Pressed, this, &AGamer::ViewFreeBegin);
	PlayerInputComponent->BindAction("ViewFree", IE_Released, this, &AGamer::ViewFreeEnd);


}


```

