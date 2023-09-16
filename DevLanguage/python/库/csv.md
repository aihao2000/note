# csv

## 读取

- 使用open打开文件

- 对文件对象创建csv reader

  ```python
  reader = csv.reader(f)
  ```

- 逐行读取，每行是一个list

  ```python
  for row in reader:
  ```

## 保存

- 使用open打开文件

- 对文件对象创建csv writer

  ```python
  writer = csv.writer(f)
  ```

- 直接写入一个二维列表

  ```python
  writer.writerows(result)
  ```

  