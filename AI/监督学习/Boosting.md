# Boosting

## AdaBoost

加大分类误差率小的弱分类器权值，减小分类误差率大的弱分类器权值

修改每个分类器数据的权值，使用加权数据学习得到分类器

具体步骤如下：

- 初始权重$w_1^{(1)},...w_n^{(1)}=\frac{1}{n}$

- 反复使用某个学习算法学习得到分类器$f_m$，第m个分类器由$W_mX^$的数据集得到

- 计算$f^{(i)}$的错误率，权重，根据此计算$W^{(i+1)}$

  $G_m(x)$在训练集上的分类误差率，[0,1]
  $$
  e_m=\sum_{i=1}^N P(G_m(x_i)\neq y_i)=\sum_{i=1}^N w_{mi}I(G_m(x_i)\neq y_i)\\
  \alpha_m=\frac{1}{2}log\frac{1-e_m}{e_m}\hfill \\
  Z_m=\sum_{i=1}^Nw_{mi}e^{-\alpha_my_iG_m(x_i)}\hfill \\
  w_{m+1,i}=\frac{w_{mi}}{Z_m}e^{-\alpha_my_iG_m(x_i)} \hfill
  $$
  
