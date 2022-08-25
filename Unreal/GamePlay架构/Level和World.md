# World与Level

## Level

World由一个或多个Level组成。

- ALevelScriptActor

  管理关卡

- AInfo

  关卡的各种规则属性

  - AWorldSettings

    仅仅和Level相关，当Level被添加进World后，这个Level的Settings如果是主PersistentLevel（持久关卡），那么它就会被当作整个World的WorldSettings。

Actors里也保存着AWorldSettings和ALevelScriptActor的指针

## World

### world类型

```cpp
namespace EWorldType
{
	enum Type
	{
		None,		// An untyped world, in most cases this will be the vestigial worlds of streamed in sub-levels
		Game,		// The game world
		Editor,		// A world being edited in the editor
		PIE,		// A Play In Editor world
		Preview,	// A preview world for an editor tool
		Inactive	// An editor world that was loaded but not currently being edited in the level editor
	};
}
```

### 