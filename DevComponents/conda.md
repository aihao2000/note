# conda

## 创建环境

```
conda create
```

## 迁移

```shell
pip install conda-pack
conda pack -n env_name
mv env_name.tar,gz .../.conda/envs
conda activate env_name
conda-unpack

```

