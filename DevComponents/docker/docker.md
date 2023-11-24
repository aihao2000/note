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



```dockerfile
FROM pytorch/pytorch:2.1.1-cuda12.1-cudnn8-runtime
LABEL author="aihao" email="aihao@xiaohongshu.com"
RUN pip install torch 
RUN pip install torchvision 
RUN pip install torchaudio
RUN pip install diffusers
RUN pip install transformers
RUN pip install huggingface_hub
RUN pip install accelerate
RUN pip install datasets
RUN pip install bitsandbytes
RUN pip install xformers
RUN pip install deepspeed
RUN pip install numpy
RUN pip install opencv_python
RUN pip install tqdm
RUN pip install watermark
RUN pip install kornia
RUN pip install timm
RUN pip install pytorch-lightning
RUN pip install scipy
RUN pip install tensorboard
RUN pip install wandb
```

