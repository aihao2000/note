- 加载蓝图类

  ```typescript
  let ucls = UE.Class.Load('/Game/StarterContent/MixinTest.MixinTest_C');
  ```

- 蓝图类转换为ts类

  ```typescript
  let jsClass = blueprint.tojs<typeof UE.Game.ALab.CharacterInfo.BP_CharacterInfoUI.BP_CharacterInfoUI_C>(bpClass);
  ```

- 定义中转类

  ```typescript
  interface MixinClassTemp extends UE.Game.ALab.CharacterInfo.BP_CharacterInfoUI.BP_CharacterInfoUI_C {}
  class TS_CharacterInfoUIControllerTemp {}
  ```

- setPrototypeOf

  ```typescript
  Object.setPrototypeOf(MixinClassTemp.prototype, jsClass.prototype);
  ```

- 派生MixinClassTemp,内部可以使用super

  ```typescript
  class MixinClass extends MixinClassTemp {
  }
  ```

- 得到MixinClassFinal

  ```typescript
  let mixinClassFinal = blueprint.mixin(jsClass, MixinClass);
  ```

  
