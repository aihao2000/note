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

## accelerate launch

- --multi_gpu 
- --num_processes

## logger

```python
- import logging
- logger = logging.getLogger(__name__)
+ from accelerate.logging import get_logger
+ logger = get_logger(__name__)
```

使用logger.info打印日志

## tracker

- 使用创建accelerator的log_with参数规定tracker平台：tensorboard,wandb ...

- 在主进程调用accelerator.init_tracker,并指定项目名称

  ```python
  if accelerator.is_main_process:
          tracker_config = dict(vars(args))
  
          # tensorboard cannot handle list types for config
          tracker_config.pop("validation_prompt")
          tracker_config.pop("validation_blueprint")
  
          accelerator.init_trackers(args.tracker_project_name, config=tracker_config)
  ```

  

## save/load states

训练不支持model.register_to_config的模型，需要注册保存和假造的hook函数

```python
# create custom saving & loading hooks so that `accelerator.save_state(...)` serializes in a nice format
def save_model_hook(models, weights, output_dir):
    for model in models:
        sub_dir = (
            "unet"
            if isinstance(model, type(accelerator.unwrap_model(unet)))
            else "image_encoder"
        )
        model.save_pretrained(os.path.join(output_dir, sub_dir))

        # make sure to pop weight so that corresponding model is not saved again
        weights.pop()

def load_model_hook(models, input_dir):
    while len(models) > 0:
        # pop models so that they are not loaded again
        model = models.pop()

        if isinstance(model, type(accelerator.unwrap_model(image_encoder))):
            # load transformers style into model
            load_model = CLIPVisionModel.from_pretrained(
                input_dir, subfolder="image_encoder"
            )
            model.config = load_model.config
        else:
            # load diffusers style into model
            load_model = UNet2DDobuleConditionModel.from_pretrained(
                input_dir, subfolder="unet"
            )
            model.register_to_config(**load_model.config)

        model.load_state_dict(load_model.state_dict())
        del load_model

accelerator.register_save_state_pre_hook(save_model_hook)
accelerator.register_load_state_pre_hook(load_model_hook)
```

