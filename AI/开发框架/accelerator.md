# Accelerator

加速深度学习训练过程

使用Accelerator进行加速训练步骤如下：

- 构造Accelerator实例并设置参数
- 调用prepare方法，准备所有训练需要用到的组件，并更新，如model,optimizer,train_dataloader,scheduler
- 对于训练的模型使用with accelerator.accumulate(model),并在代码块中计算损失执行反向
- 使用accelerator.is_main_process判断是否为主进程，保存模型
- 将以上操作封装为函数，使用accelerator.nbotebook_launcher执行

## 构造函数

- mixed_precision

  控制是否使用混合精度训练，从'no','fp16','bf16 or 'fp8'中选择

- log_with

  从'all','tensorboard','wandb','comet_ml'中选择
  
- logging_dir

