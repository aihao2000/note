

## decoder

![image-20230427003931617](./VAE.assets/image-20230427003931617.png)

x为真实世界数据，z为我们自己可设计又或为隐变量，神经网络参数为$\theta$可得$G(z)=x$

那么
$$
p_\theta(x)=\int_z p(z)p_\theta(x|z)dz \\
p_\theta(x|z) \propto exp(-||G(z)-x||_2)
$$

## 训练

使用最大似然估计

![image-20230428003308539](./VAE.assets/image-20230428003308539.png)
