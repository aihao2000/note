# 线性代数回顾

## 向量

### 点乘

$$
\vec{a} {\cdot} \vec{b} =x_a{\cdot}x_b+y_a{\cdot}y_b+z_a{\cdot}z_b...
$$

- 计算余弦值
  $$
  \vec{a} * \vec{b} =||\vec{a}||\cdot||\vec{b}||\cdot cos<\vec{a},\vec{b}>
  $$

- 计算$\vec{b}$在$\vec{a}$上的投影$\vec{b}_\bot$
  $$
  \vec{b}_\bot=\cos{<\vec{a},\vec{b}>}{\cdot}{||\vec{b}||}{\cdot}{\hat{a}}
  $$
  根据$\vec{a}$分解为两个向量
  
- 判断方向的接近程度，利用cos函数的性质

  点乘值大于0则大概于同一个方向（夹脚小于90度）

  点乘值小于0则夹脚大于90度

- 建立直角坐标系

  ![image-20220518214514232](C:\Users\AisingioroHao\AppData\Roaming\Typora\typora-user-images\image-20220518214514232.png)

## 差积

计算出一个和原来两个向量都垂直的向量 
$$
a \times b=-b \times a
$$

$$
||a \times b||=||a|| ||b|| sin<a,b>
$$

![image-20220518210236361](C:\Users\AisingioroHao\AppData\Roaming\Typora\typora-user-images\image-20220518210236361.png)

![image-20220518210634490](C:\Users\AisingioroHao\AppData\Roaming\Typora\typora-user-images\image-20220518210634490.png)

- 判断左和右
- 判断内和外

## 矩阵

