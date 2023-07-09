# diffusers.pipeline

## \_\_call\_\_()

返回一个对象PipelineOutput

- images
- generator

参数：

- num_inference_steps

## \_\_init\_\_()

- safety_checker

  检查生成的对象，当不需要式可以设置为None

- requires_safety_checker

- 该pipeline需要的组件，如vae,text_encoder,tokenizer,unet,schedule

## components

可以获取管道中的所有组件，并不需要重复加载权重到内存创建另外一个管道

```python
pipeline=Pipeline(**components)
```

## from_pretrained()

使用model_index.json获取：

- pipeline的类型"_class_name"
- 创建该pipeline的diffusers的版本"_diffusers_version"
- 子文件夹存储了库中的哪些组件，属性名是其组件名，值为一个数组，第一项为库名，第二项为类名

```json
{
  "_class_name": "StableDiffusionPipeline",
  "_diffusers_version": "0.6.0",
  "feature_extractor": [
    "transformers",
    "CLIPImageProcessor"
  ],
  "safety_checker": [
    "stable_diffusion",
    "StableDiffusionSafetyChecker"
  ],
  "scheduler": [
    "diffusers",
    "PNDMScheduler"
  ],
  "text_encoder": [
    "transformers",
    "CLIPTextModel"
  ],
  "tokenizer": [
    "transformers",
    "CLIPTokenizer"
  ],
  "unet": [
    "diffusers",
    "UNet2DConditionModel"
  ],
  "vae": [
    "diffusers",
    "AutoencoderKL"
  ]
}
```

参数：

- variant

  加载变体参数使用，如"fp16","no_ema"

- torch_type

  参数类型
  
- user_safetensors

## from_ckpt()



## save_pretrained()

- variant

