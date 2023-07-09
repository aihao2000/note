# scheduler

## SchedulerMixin

### from_pretraind()

多种scheduler可以由相同的配置文件生成，比如Stablediffusion支持以下Scheduler

```
from diffusers import StableDiffusionPipeline
from diffusers import (
    DDPMScheduler,
    DDIMScheduler,
    PNDMScheduler,
    LMSDiscreteScheduler,
    EulerDiscreteScheduler,
    EulerAncestralDiscreteScheduler,
    DPMSolverMultistepScheduler,
)

repo_id = "runwayml/stable-diffusion-v1-5"

ddpm = DDPMScheduler.from_pretrained(repo_id, subfolder="scheduler")
ddim = DDIMScheduler.from_pretrained(repo_id, subfolder="scheduler")
pndm = PNDMScheduler.from_pretrained(repo_id, subfolder="scheduler")
lms = LMSDiscreteScheduler.from_pretrained(repo_id, subfolder="scheduler")
euler_anc = EulerAncestralDiscreteScheduler.from_pretrained(repo_id, subfolder="scheduler")
euler = EulerDiscreteScheduler.from_pretrained(repo_id, subfolder="scheduler")
dpm = DPMSolverMultistepScheduler.from_pretrained(repo_id, subfolder="scheduler")

# replace `dpm` with any of `ddpm`, `ddim`, `pndm`, `lms`, `euler_anc`, `euler`
pipeline = StableDiffusionPipeline.from_pretrained(repo_id, scheduler=dpm)
```

### compatibles

查看所有兼容的scheduler

## ConfigMixin

### config

返回配置文件

### from_config

使用配置文件生成scheduler

## 不同scheduler的特点

| Scheduler 名字                                               | 效果                           |
| ------------------------------------------------------------ | ------------------------------ |
| [LMSDiscreteScheduler](https://huggingface.co/docs/diffusers/v0.17.1/en/api/schedulers/lms_discrete#diffusers.LMSDiscreteScheduler) | 通常会带来更改好的结果         |
| [EulerDiscreteScheduler](https://huggingface.co/docs/diffusers/v0.17.1/en/api/schedulers/euler#diffusers.EulerDiscreteScheduler) ，[EulerAncestralDiscreteScheduler](https://huggingface.co/docs/diffusers/v0.17.1/en/api/schedulers/euler_ancestral#diffusers.EulerAncestralDiscreteScheduler) | 可以使用仅仅30步生成高质量结果 |
| [DPMSolverMultistepScheduler](https://huggingface.co/docs/diffusers/v0.17.1/en/api/schedulers/multistep_dpm_solver#diffusers.DPMSolverMultistepScheduler) | 速度质量权衡，仅需二十步       |

