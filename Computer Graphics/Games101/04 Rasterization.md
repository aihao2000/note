# 光栅化Raterization

将物体画在屏幕上

经过模型变化，相机变化，投影变化，所有的点都在[-1,1]内

## 定义屏幕

![image-20220612163753492](04%20Rasterization.assets/image-20220612163753492.png)

## 映射[-1,1]到[0，width]*[0,height]

$$
变换矩阵
\begin{pmatrix}
width/2 & 0 & 0 & width/2 \\
0 & height/2 & 0 &  height/2 \\
0 & 0 & 1 & 0 \\
0 & 0& 0 & 1 \\
\end{pmatrix}
$$

## 三角形 - 基本的形状单元

- 最基本的多边形

  分解其他多边形

- 保证是平面的

- 三角形的内外定义非常明确

- 定义三个顶点的属性，在三角形内部可以做渐变

## 判断每一个像素的中心点是否在三角形内

利用差积

再根据三角形的颜色对像素进行染色

## 锯齿问题

![image-20220612210553563](04%20Rasterization.assets/image-20220612210553563.png)

![image-20220612210531292](04%20Rasterization.assets/image-20220612210531292.png)

![image-20220612210709939](04%20Rasterization.assets/image-20220612210709939.png)

## Artifacts

图形学上的概念，错误或一切觉得不太正确的东西。

- 摩尔纹

  去掉奇数行和奇数列后的现象 ，空间中的采样出现的问题

- Weagon Wheel effect

  采样跟不上速度，时间中的采样出现的问题

## 反走样

对原来的信号进行模糊操作，再去采样。

### 傅里叶变化

![image-20220614192121092](04%20Rasterization.assets/image-20220614192121092.png)

把一个函数从时域变到频域

![image-20220614200333538](04%20Rasterization.assets/image-20220614200333538.png)

中心·为低频信息，外围为高频信息，由亮度表示

### 滤波

去掉一些频率的内容

滤波器（Filter）

- 高通滤波

  去掉低频滤波。

  ![image-20220614200958980](04%20Rasterization.assets/image-20220614200958980.png)

  发现只有边界变得明显，因为边界的色彩变化差异大。

- 低通滤波

  ![image-20220614201250984](04%20Rasterization.assets/image-20220614201250984.png)

  图片变得更模糊。

- 留下某一段的频率

  ![image-20220614201444706](04%20Rasterization.assets/image-20220614201444706.png)

  会留下部分边界信息 

滤波等于卷积等于平均（Filtering=Convolution=Avg

### 卷积

![image-20220614202936177](04%20Rasterization.assets/image-20220614202936177.png)

 

时域的卷积等于频域的乘积

![image-20220614203848660](04%20Rasterization.assets/image-20220614203848660.png)

##  反走样方法

- 增加采样率
- 先做模糊，再做采样

### MSAA

![image-20220618192752085](04%20Rasterization.assets/image-20220618192752085.png)

增加单个像素内的采样点

### FXAA（Fast Approximate AA）

先得到锯齿图，再进行图像后期处理，寻找锯齿边替换为正常边

### TAA（Temporal AA）

复用上一帧的结果，来影响这一帧的结果。 

### Super resolution/super sampling

- 从低采样到高采样

使用深度学习 

## Visiblity/ occlusion

### 画家算法

先画远的再画近的，但有时很难严格分清远近

![image-20220621192421852](04%20Rasterization.assets/image-20220621192421852.png)

### Z-Buffer

![image-20220622191443344](04%20Rasterization.assets/image-20220622191443344.png)

- 对每一个像素进行分析排序，永远存储最近的距离/最浅的深度
- 存储深度缓冲，颜色缓冲

![image-20220624222405840](04%20Rasterization.assets/image-20220624222405840.png)

