# Docker

## run

```bash
docker run -d -p 80:80 docker/getting-started
```

- -d

  后台运行

- -it

  交互式运行

- --gpus all

- --network

  网络模式,表示容器应该链接到哪个docker网络，docker网络时用于容器间通信的虚拟网络

  - bridge
  
  - host
  
    使用主机的网络，共享IP和PORT资源
  
  - container
  
  - none
  
- -v

  ```shell
  host_path:docker_path
  ```

- --name

## rmi

删除镜像

## Dockerfile

使用Dockerfile构建自己的镜像，创建名为```Dockerfile```的文件

### FROM

制定基础镜像

```dockerfile
FROM pytorch/pytorch:2.1.1-cuda12.1-cudnn8-runtime
```

### RUN

执行shell命令

### LABEL

设置作者信息

### ADD

将本地文件打包到镜像中

### CMD

容器运行时执行

### USER

### 构建

```shell
docker image build . --build-arg UID=$(id -u) --tag aihao_worksapce:v1
```

### examples

```dockerfile
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime
LABEL author="aihao2000" email="aihao2000@outlook.com"
RUN pip install \ 
    diffusers \
    transformers \
    huggingface_hub \
    accelerate \
    tensorboard \
    wandb \
    datasets \
    bitsandbytes \
    deepspeed \
    numpy \
    opencv_python \
    opencv_python_headless \
    tqdm \
    watermark \
    kornia \
    timm \
    pytorch-lightning \
    scipy \
    jupyter \
    && pip install xformers --index-url https://download.pytorch.org/whl/cu118 \
    && pip cache purge \
    && conda clean -all
RUN apt update && apt install -y git \
    git-lfs \
    vim \
    curl \
    wget \
    tmux \
    rsync \
    && rm -rf /var/lib/apt/lists/* && apt clean && apt autoremove -y
```



```dockerfile
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime
LABEL author="aihao2000" email="aihao2000@outlook.com"
RUN pip install \ 
    diffusers \
    transformers \
    huggingface_hub \
    accelerate \
    tensorboard \
    wandb \
    datasets \
    bitsandbytes \
    deepspeed \
    numpy \
    opencv_python \
    opencv_python_headless \
    tqdm \
    watermark \
    kornia \
    timm \
    pytorch-lightning \
    scipy \
    jupyter \
    && pip install xformers --index-url https://download.pytorch.org/whl/cu118 \
    && pip cache purge \
    && conda clean -all
RUN apt update && apt install -y git \
    git-lfs \
    vim \
    curl \
    wget \
    tmux \
    rsync \
    && rm -rf /var/lib/apt/lists/* && apt clean && apt autoremove -y
```

## 用户权限配置

```shell
sudo group docker
sudo gapsswd -a $username docker
newgrp docker
```

