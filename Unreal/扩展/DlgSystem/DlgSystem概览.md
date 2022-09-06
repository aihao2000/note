# DlgSystem

## 使用流程

- 对需要对话的NPC添加DlgDialogueParticipant接口

  - 实现GetParticipantName
  - 实现GetParticcipantDisplayName

- 创建并编写Dialogue

  - 在NPC创建Dlg Dialogue变量引用此Dialogue

- 在想要开始对话的地方，执行Dialogue->StartDialogue

  - 会返回一个DialogueContext，里面包含DIalogue的相关信息

- 在进行对话选择的地方，调用DialogueContext->ChooseOption

  DialogueContext会被更新

- 显示

  - Get OptionText