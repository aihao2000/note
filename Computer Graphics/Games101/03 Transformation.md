# Transformation

## 模型变换

### 二维

#### 缩放（Scale）

![image-20220518223118939](03%20Transformation.assets/image-20220518223118939.png)

####  旋转（Rotation）

![](03%20Transformation.assets/image-20220519151555445.png)
$$
\begin{pmatrix}
\cos{\theta} & -\sin{\theta}\\
\sin{\theta} & \cos{\theta}
\end{pmatrix}
$$

#### 线性变换

可被表示为矩阵的变换

![image-20220519170331578](03%20Transformation.assets/image-20220519170331578.png)

#### 齐次坐标（Homogenous Coordinates）

增加一个维度，值为0或1。

当这个维度为0时，表示这个元组表示一个向量。

当这个维度为1时，表示这个元组表示一个坐标。

可以将平移变换作为一个矩阵乘法

![image-20220519181215068](03%20Transformation.assets/image-20220519181215068-16529551370352.png)

满足逻辑需要：

![image-20220519180958740](03%20Transformation.assets/image-20220519180958740-16529550053911.png)

两点相加表示这两个点的终点。

![image-20220519191746636](03%20Transformation.assets/image-20220519191746636-16529590687583.png)

先应用线性变换，再平移

### 三维

#### 缩放与平移

![image-20220521203456327](03%20Transformation.assets/image-20220521203456327-16531364989211.png)

### 旋转

![image-20220521203529022](03%20Transformation.assets/image-20220521203529022-16531365305212.png)

![image-20220521204130440](03%20Transformation.assets/image-20220521204130440-16531368917673.png)

## 

![image-20220529212151010](03%20Transformation.assets/image-20220529212151010-16538305124761.png)

## 视图变换

### 相机定义

- 位置
- 朝向
- 向上方向

![image-20220531162457487](03%20Transformation.assets/image-20220531162457487.png)

通常的定义：

- 位于源点（0，0，0）

- 向上方向为y
- 朝向为-z

特殊相机转换为一般相机：

相机当前位于$\vec{e}$向上方向为$\hat{t}$朝向为$\hat{g}$

![image-20220531221200672](03%20Transformation.assets/image-20220531221200672.png)

1. 将相机平移到源点
$$
  { \vec{e} }=
  \begin{pmatrix}
  e_x \\
  e_y \\
  e_z \\
  1 \\
  \end{pmatrix}
  \rightarrow
  \begin{pmatrix}
  0 \\
  0 \\
  0 \\
  1 \\
  \end{pmatrix}
  \\
  可得变换矩阵为
  \begin{pmatrix}
  1 & 0 & 0 & -e_x\\
  0 & 1 & 0 & -e_y \\
  0 & 0 & 1 & -e_z \\
  0 & 0 & 0 & 1 \\
  \end{pmatrix}
$$

2. 讲相机旋转到相对应的方向， $\hat{g}$旋转到 -Z，$\hat{t}$旋转到Y

  该旋转的逆更加好写：

  1. -Z旋转向g
     $$
     \hat{-Z}=
     \begin{pmatrix}
     0 \\
     0 \\
     -1 \\
     0
     \end{pmatrix}
     \rightarrow
     \hat{g}=
     \begin{pmatrix}
     g_x \\
     g_y \\
     g_z \\
     0 \\
     \end{pmatrix}
     \\
     \begin{pmatrix}
     0 & 0 & -g_x & 0 \\
     0 & 0 & -g_y & 0 \\
     0 & 0 & -g_z & 0 \\
     0 & 0 & 0 & 1 \\
     \end{pmatrix}
     \begin{pmatrix}
     0 \\
     0 \\
     -1 \\
     0
     \end{pmatrix}
     =
     \begin{pmatrix}
     g_x \\
     g_y \\
     g_z \\
     0 \\
     \end{pmatrix}
     $$
     
  2. Y旋转向t
     $$
     { \hat{Y} }=
     \begin{pmatrix}
     0 \\
     1 \\
     0 \\
     0 \\
     \end{pmatrix}
     \rightarrow
     { \vec{t} }=
     \begin{pmatrix}
     t_x \\
     t_y \\
     t_z \\
     0 \\
     \end{pmatrix}
     
     \\
     得到旋转矩阵
     \begin{pmatrix}
     0 & t_x & 0 & 0 \\
     0 & t_y & 0 & 0 \\
     0 & t_z & 0 & 0 \\
     0 & 0 & 0 & 1 \\
     \end{pmatrix}
     $$
     
  3. X转型${ \vec{g} } \times  { \vec{t} }$

     显然左乘旋转矩阵
     $$
     \\
     \begin{pmatrix}
     ({ \vec{g} } \times  { \vec{t} })_x & 0 & 0 & 0 \\
     ({ \vec{g} } \times  { \vec{t} })_y & 0 & 0 &  0\\
     ({ \vec{g} } \times  { \vec{t} })_z & 0 & 0 & 0 \\
     0 & 0 & 0 & 1 \\
     \end{pmatrix}
     $$
     


  可得旋转矩阵得逆为
$$
\begin{pmatrix}
  ({ \vec{g} } \times  { \vec{t} })_x & t_x & -g_x & 0 \\
  ({ \vec{g} } \times  { \vec{t} })_y & t_y & -g_y & 0 \\
  ({ \vec{g} } \times  { \vec{t} })_z & t_z & -g_z & 0 \\
  0 & 0 & 0 & 1 \\
  \end{pmatrix}
$$
  这是个正交矩阵，其逆为该矩阵得转置,即旋转矩阵为
$$
  \begin{pmatrix}
  ({ \vec{g} } \times  { \vec{t} })_x & ({ \vec{g} } \times  { \vec{t} })_y & ({ \vec{g} } \times  { \vec{t} })_z & 0\\
  t_x & t_y & t_z & 0 \\
  -g_x & -g_y & -g_z & 0\\
  0 & 0 & 0 & 1\\
  \end{pmatrix}
$$

综上，相机的变换矩阵为
$$
M_{ortho}=\begin{pmatrix}
({ \vec{g} } \times  { \vec{t} })_x & ({ \vec{g} } \times  { \vec{t} })_y & ({ \vec{g} } \times  { \vec{t} })_z & 0\\
t_x & t_y & y_z & 0 \\
-g_x & -g_y & -g_z & 0\\
0 & 0 & 0 & 1\\
\end{pmatrix}
\begin{pmatrix}
1 & 0 & 0 & -e_x\\
0 & 1 & 0 & -e_y \\
0 & 0 & 1 & -e_z \\
0 & 0 & 0 & 1 \\
\end{pmatrix}
$$


## 投影变换

### 投影种类

- 3D 变为2D

- 正交投影（Orthographic projection）

  原本平行的线仍然平行。

  并不会带来近大远小的现象。  

- 透视投影（Perspective projection）

  原本平行的线将平行线将相交。

  更类似于人眼的成像。

![image-20220602200012004](03%20Transformation.assets/image-20220602200012004.png)

![image-20220602200111566](03%20Transformation.assets/image-20220602200111566.png)

### 正交投影

![image-20220602200344029](03%20Transformation.assets/image-20220602200344029.png)

#### 简单实现

1. 抛弃z轴
2. 按比例将坐标缩放到 [-1,1]

#### 标准实现

1. 定义标准（正则，规范）立方体

  左右，下上，远近

  [l,r] ,[b,t],[f,n]

2. 将任意一个立方体平移到标准立方体内

  ![image-20220602214810112](03%20Transformation.assets/image-20220602214810112.png)


### 透视投影

#### 实现

![image-20220605220526104](03%20Transformation.assets/image-20220605220526104.png)

1. 挤压

   近平面距离为n，原平面距离为z

   ![image-20220605220603353](03%20Transformation.assets/image-20220605220603353.png)

   x、y值变为原来的n/z倍
   $$
   {
   \begin{pmatrix}
   x \\
   y \\
   z \\
   1 \\
   \end{pmatrix}
   }
   \rightarrow
   {
   \begin{pmatrix}
   nx \\
   ny \\
   unknown \\
   z \\
   \end{pmatrix}
   }
   \\
   得出变换矩阵的部分元素
   \begin{pmatrix}
   n & 0 & 0 & 0 \\
   0 & n & 0 & 0 \\
   ? & ? & ? & ? \\
   0 & 0 & 1 & 0 \\
   \end{pmatrix}
   $$
   对于z=n的点，其z值不会发生变换，即
   $$
   \begin{pmatrix}
   x \\
   y \\
   n \\
   1 \\
   \end{pmatrix}
   \rightarrow
   \begin{pmatrix}
   nx \\
   ny \\
   n^2 \\
   n \\
   \end{pmatrix}
   $$
   可得变换矩阵第三行的方程1
   $$
   \begin{pmatrix}
   0 & 0 & A & B 
   \end{pmatrix}
   \begin{pmatrix}
   x \\
   y \\
   n \\
   1 \\
   \end{pmatrix}
   $$
   对于z=f得中心点即（0，0，f）经过变换后仍为（0，0，f）
   $$
   \begin{pmatrix}
   0 \\
   0 \\
   f \\
   1 \\
   \end{pmatrix}
   \Rightarrow
   \begin{pmatrix}
   0 \\
   0 \\
   f \\
   1 \\
   \end{pmatrix}
   ==
   \begin{pmatrix}
   0 \\
   0 \\
   f^2 \\
   f \\
   \end{pmatrix}
   $$
   

   可得变换矩阵第三行的方程2
   $$
   Af+B=f^2
   $$
   联立方程1、2得
   $$
   A=n+f \\
   B=-nf
   $$
   综上，挤压变换矩阵为
   $$
   \begin{pmatrix}
   n & 0 & 0 & 0 \\
   0 & n & 0 & 0 \\
   0 & 0 & n+f & -nf \\
   0 & 0 & 1 & 0 \\
   \end{pmatrix}
   $$

2. 进行正交投影

#### 视锥定义

![image-20220611214111798](03%20Transformation.assets/image-20220611214111798.png)

- 宽高比

- 可看到角度的范围（Field of View（fov）），近远平面重点锁确定的角度称为**垂直可视角度**(aspect ratio)

  垂直可视角度越小，越像正交投影

根据以上定义可以转为为

![image-20220612124659172](03%20Transformation.assets/image-20220612124659172.png)



