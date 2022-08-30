![preview](https://pic3.zhimg.com/v2-b4e0dd15956ccb819fca93e73d1b8ed2_r.jpg)

![preview](https://pic1.zhimg.com/v2-c0cd2e5121f63c37615f78476e2a425c_r.jpg)

## 事件顺序

- **GameMode** Construct

  - BP ConstructionScript

- **GameState** Construct

  - BP ConstructionScript

- **PlayerController** Construct

  - BP ConstructionScript

- **PlayerState**  Construct

  - BP ConstructionScript

- **HUD**  Construct

  - BP ConstructionScript

- **Actor(place in world)**  Construct

  - **Component** Construct

    会执行两次

  - BP ConstructionScript

- **DefaultPawn**  Construct

  - BP ConstructionScript

- **GameMode** BeginPlay

- **GameState** BeginPlay

- **PlayerController** BeginPlay

- **PlayerState** BeginPlay

- **HUD** BeginPlay

- **DefaultPawn** BeginPlay

- **Actor(place in world) Component** BeginPlay

  - **Actor(place in world)** BeginPlay