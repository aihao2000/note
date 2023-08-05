# rsync

基础格式：

```
rsync source dest
```

基于source去同步更新dest

## 路径格式

末尾为/则代表该目录下的所有文件

否则则为目录本身

## 同步两个文件夹

path1/A下的所有文件会传输到path2/A

```shell
rsync -Pat path1/A/ path2/A
```

## --existing

只更新目标已经存在的文件

## --ignore-existing

更新目标端不存在的文件