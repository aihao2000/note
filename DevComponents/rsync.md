# rsync

同步更新两处计算机的文件与目录，并适当利用差分编码减少数据传输量

```python
rsync [options] source destination
rsync -r A B # 递归同步
rsync -a A B # 递归同步的同时同步元信息，比如文件权限
rsync --delete A B # 在同步过程中删除只存在B不存在A的内容
```

