# str

字符串类型

不可改变

- 若不希望转义，字符串前加r

- 若希望嵌入变量，字符串前加f

- 切片

  ```python
  str[start:end:step]
  ```

- 格式化字符串%()

  ```python
  a="%d%f%s"%(2,3.4,"abc")
  ```

- str.format() 格式化：在字符串中使用花括号 {} 包含需要格式化的变量或表达式，然后调用 `str.format()` 方法进行格式化。例如，"{} is {} years old".format("Tom", 20) 会输出 "Tom is 20 years old"。
