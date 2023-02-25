# NumPy

NumPy定义了专用的数组名为：ndarray.

numpy.array不同于标准库中的array.array,array.array只有少量的处理一维元素的函数。

numpy.对象包含（省略ndarray前缀)：

- .ndim

  轴的数量，维度的数量，如a\[100]\[100]的ndim就是2

- .shape

  每个轴元的得个数

- .reshape

  变形，若参数值为-1则说明该维个数根据其他维度自动计算

- .size

  所有元素的个数，shape的乘积

- .dtype

  元素的类型

- .itemsize

  元素的字节数

- .data

  返回一个包含实际元素的缓冲区

## 基本操作

### array()

创建一个ndarray

第一个参数可传入一个列表为初始值

可以用dtype参数指定元素类型

```python
c = np.array([[1, 2], [3, 4]], dtype=complex)
# array([[1.+0.j, 2.+0.j],
#       [3.+0.j, 4.+0.j]])
```

### zeros，ones，empty

zeros创建默认值为0的，ones创建默认值为1的，empty则不对初始值作任何规定。

### arange

同range，返回一个array

```python
np.arange(start,end,step) # [start,end)
```

### linspace

```python
np.linspace(start,end,nums) #[start,end],nums个元素
```

### 打印数组

若数组过大只会打印边角。

若强制完全打印则需要set_printoptions(threshold=sys.maxsize)

## 基础运算

- *

  对应位置元素相乘

- **x

  每一个元素变为原来的x立方

- @或A.dot(B)

  矩阵乘法

## column_stack

如果是参数是一个一维数组，则会变成一列，即n（元素个数）行一列得二维数组。

如果参数是一个二维数组，则不变。

多个二维数组堆叠在第二个轴中，即列数增加。

```python
import numpy as np
x= np.array([[1,2,3],[4,5,6]])
a=np.c_[np.array([0,0]),x,x**2,x**3,np.array([0,0])]
print(a)
[[  0   1   2   3   1   4   9   1   8  27   0]
 [  0   4   5   6  16  25  36  64 125 216   0]]
```

## tile

```python
numpy.tile(A,reps)
```

reps重复A次来构造一个数组

结果的ndim为A和reps的ndim的最大值

如果A或reps的维度不相等，那么会低的低维位会补1对齐。

A=(x1,x2,x3,...)代表第一维的元素重复x1遍，第二维的元素重复x2遍......

## 数学运算

np.

- log
- exp
- abs
- maximum

