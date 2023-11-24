```shell
!git config --global credential.helper store
!huggingface-cli login
```

##  下载模型

### 从镜像站下载

```shell
export HF_ENDPOINT=https://hf-mirror.com
```



```shell
huggingface-cli download --resume-download bigscience/bloom-560m --local-dir bloom-560m
```

