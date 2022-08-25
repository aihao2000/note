# UObject

## 功能

- GC垃圾回收
- 元数据
- 反射生成
- 序列化
- 编辑器可见
- Class Default Object

# Actor

万物皆UObject，并用UClass为此一一命名。

进而有Actor。

ScnenCompomnent中包含Transform，并可以自由装卸给Actor。

## 功能

较于UObject，增加了：

- Replication

  网络复制

- Spawn

- Tick

## Component

