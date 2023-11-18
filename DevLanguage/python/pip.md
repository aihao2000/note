# pip

## 配置全局镜像源

```shell
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## 临时使用镜像源

```python
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package
```

## 删除源

```shell
pip config unset global.index-url
```