# 系统交互

```python
import os
```

## os

- 得到当前工作目录

  ```python
  os.getcwd()
  ```

- 返回指定目录下的所有文件和目录名:

  ```python
  os.listdir()
  ```

- 函数用来删除一个文件

  ```python
  os.remove()
  ```

- 删除多个目录

  ```python
  os.removedirs（r“c：\python”）
  ```

  若想要递归删除整个目录，使用shutil.rmtree

- 运行shell命令

  ```python
  os.system()
  ```

- 读取和设置环境变量

  ```python
  os.getenv() 
  ```

  ```python
  os.putenv()
  ```

- 给出当前平台使用的行终止符

  ```python
  os.linesep    # Windows使用'\r\n'，Linux使用'\n'而Mac使用'\r'
  ```

- 指示你正在使用的平台

  ```python
  os.name       # 对于Windows，它是'nt'，而对于Linux/Unix用户，它是'posix'
  ```

- 重命名

  ```python
  os.rename（old， new）
  ```

- 创建多级目录

  ```python
  os.makedirs（r“c：\python\test”）
  ```

- 创建单个目录

  ```python
  os.mkdir（“test”）
  ```

- 获取文件属性

  ```python
  os.stat（file）
  ```

- 修改文件权限与时间戳

  ```python
  os.chmod（file）
  ```

- 终止当前进程

  ```python
  os.exit（）
  ```

- 获取文件大小

  ```python
  os.path.getsize（filename）
  ```

- 更换路径

  ```python
  os.chdir("path") 
  ```

## path

- 检验给出的路径是否是一个文件

  ```python
  os.path.isfile()
  ```

- 检验给出的路径是否是一个目录

  ```python
  os.path.isdir()
  ```

- 判断是否是绝对路径

  ```python
  os.path.isabs()
  ```

- 检验给出的路径是否真地存

  ```python
  os.path.exists()
  ```

- 返回一个路径的目录名和文件名

  ```python
  os.path.split()
  ```

  ```python
  os.path.split('/home/swaroop/byte/code/poem.txt') 
  # 结果：('/home/swaroop/byte/code', 'poem.txt')
  ```

- 分离扩展名：os.path.splitext()

- 获取路径名：os.path.dirname()

- 获取文件名：os.path.basename()

