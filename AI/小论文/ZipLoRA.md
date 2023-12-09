# ZipLoRA

基于以下发现：

- lora矩阵直接相加合并，当列的余弦相似度大时效果不好
- lora矩阵是稀疏的

因此引入可学习的新增参数去对列进行缩放，改变他们的余弦弦相似度以达到更好的合并效果

## 符号

- $\oplus$：lora矩阵和原矩阵的合并方法
- $\otimes$：python1中的乘法
- D：原矩阵
- $L$：lora矩阵s，c下标代表style和content

## 新增参数

新增可学习参数$m_c$,$m_s$，合并风格和内容的lora模型
$$
L_m=Merge(L_c,L_s,m_c,m_s)=\Delta W_m=m_c \otimes \Delta W_c +m_s \otimes \Delta W_s
$$
$m_c$,$m_s$两个$(1,col_W)$的向量，广播乘法对lora矩阵的每一列进行一个缩放

## 损失函数

$$
\mathcal{L}_{merge}=||(D\oplus L_m)(x_c,p_c)-(D\oplus L_c)(x_c,p_c)||^2 \\
+||(D\oplus L_m)(x_s,p_s)-(D\oplus L_s)(x_s,p_s)||^2 \\
+\lambda\sum_i |m_c^{(i)}\cdot m_s^{(i)}|
$$

第一项和第二项使新的ZipLoRA合并后的矩阵的输出$(D\oplus L_m)(x,p)$尽可能的接近原来单lora合并矩阵

第三项使参数尽可能小，lambda固定0.01
