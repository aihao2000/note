# Shading

## Visiblity/ occlusion

### 画家算法

先画远的再画近的，但有时很难严格分清远近

![image-20220621192421852](05%20Shading.assets/image-20220621192421852.png)

### Z-Buffer

![image-20220622191443344](05%20Shading.assets/image-20220622191443344.png)

- 对每一个像素进行分析排序，永远存储最近的距离/最浅的深度
- 存储深度缓冲，颜色缓冲

![image-20220624222405840](05%20Shading.assets/image-20220624222405840.png)

## Shading 定义