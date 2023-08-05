# Denoising Diffusion Probabilistic Models（DDPM）

 概率扩散模型（DDPM）包含前向扩散和后向扩散两个部分。

 前向扩散即对采样的图片多次添加噪声,使数据变为标准高斯分布的过程。

 反向扩散即从标准高斯分布中任意采样,逐步去除噪声的过程生成符合采样分布的图片。

## 前向扩散

初始图像为$x_0$，添加高斯噪声，生成$x_0,x_1,...,x_t$，其中$x_t$对于$x_{t-1}$为高斯分布
$$
q(x_t|x_{t-1})=N(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_tI)
$$

- $\beta_t$越大，则和$x_{t-1}$的差别越大
- DDPM的作者采用线性增长$\beta_1=10^{-4},...,\beta_T=0.02$

## 重参数化

假设一个变量符合高斯分布
$$
z\sim N(z,\mu,\sigma^2I)
$$

可以引入随机变量$\epsilon$，等价于
$$
z=\mu+\sigma\cdot\epsilon,\epsilon \sim N(0,I)
$$
因此具体变换可写为
$$
x_t=\sqrt{1-\beta_t}x_{t-1}+\sqrt{\beta_t}\epsilon_{t-1}
$$

- $\epsilon \sim N(0,I)$

令$\alpha_t=1-\beta_t,\overline \alpha_t=\prod_{i=0}^t\alpha_i$可归纳为
$$
x_t \hfill \\
=\sqrt{1-\beta_t}x_{t-1}+\sqrt{\beta_t}\epsilon \hfill\\
=\sqrt{\alpha_t}x_{t-1}+\sqrt{1-\alpha_t}\epsilon\hfill\\
=\sqrt{\alpha_t}(\sqrt{\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_{t-1}}\epsilon)+N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+\sqrt{\alpha_t(1-\alpha_{t-1})}\epsilon+N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+N(0,\alpha_t(1-\alpha_{t-1}))+N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+N(0,1-\alpha_t\alpha_{t-1}) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_t\alpha_{t-1}}\epsilon \hfill \\
=... \hfill \\
=\sqrt{\alpha_t...\alpha_1}x_0+\sqrt{1-\alpha_t...\alpha_1}\epsilon \hfill \\
=\sqrt{\overline\alpha_t}x_0+\sqrt{1-\overline\alpha_t}\epsilon \hfill \\
$$

因此

$$
q(x_t|x_0)=N(x_t;\sqrt{\overline \alpha_t}x_0,(1-\overline\alpha_t))\\
x_t=\sqrt{\overline\alpha_t}x_0+\sqrt{1-\overline\alpha_t}\epsilon \hfill \\
$$

t越大，$\beta_t$越大，$\alpha_t$越小，因此均值趋近于0，方差趋近于1。
$$
\lim_{t->\infty}(x_t|x_0)=\lim_{t->\infty}q(x_t)=N(0,I)
$$

逆向扩散

期望训练出一个$q(x_0)$来根据原来数据分布生成新的数据点

但是$q(x_{t-1}|x_t)$未知，因此使用一个$p_{\theta}$来估计$q(x_{t-1}|x_t)$，q为正态分布，因此选择p为正态分布，并使其均值和方差为参数。

希望由$x_t$变化为$x_0$
$$
p_{\theta}(x_{t-1}|x_t)=N(x_{t-1},\mu_{\theta}(x_t,t),\Sigma_{\theta}(x_t,t)) \\
p_{\theta}(x_{0:T})=p_{\theta}(x_T)\prod_{t=1}^T p_{\theta}(x_{t-1}|x_t)\\
p_\theta(x_0)=\int_{x_1:x_t}p(x_t)p_\theta(x_{t-1|x_t})...p_\theta(x_0|x_1)dx_1:x_t
$$

## 使用一个神经网络来估计反向扩散

使用神经网络来估计p，神经网络的输出即$p_\theta(x)$对应高斯分布得均值，使用最大似然估计反向扩散每一步的方差与均值，

训练神经网络类似于一个变分自动编码机（VAE）。

![image-20230428004735421](./DDPM.assets/image-20230428004735421.png)

- $q(x_1:x_t|x_0)=q(x_1|x_0)q(x_2|x_2)...q(x_t|x_{t-1})$

....

最大似然估计即优化一个训练数据的负对数似然函数。

使用最大似然估计来估计$p_{\theta}(x_0)$

经

![image-20230523193006776](./DDPM.assets/image-20230523193006776.png)

证明logp(x)有下界

$$
logp(x)\ge E_{q}(x_1|x_0)[logp_{\theta}(x_0|x_1)]-\\D_{KL}(q(x_T|x_0)||p(x_T))-\\ \sum_{t=2}^T E_{q(x_t|x_0)}[D_{KL}(q(x_{t-1}|x_t,x_0)||p_{\theta}(x_{t-1}|x_t))]\\
=L_0-L_T-\sum_{t=2}^T L_{t-1}
$$

- $E_{q}(x_1|x0)[logp_{\theta}(x_0|x_1)]$

- $D_{KL}(q(x_T|x_0)||p(x_T))$

  不含训练参数

因此，最大似然估计转换为最小化$L_{t-1}$



因此，最大似然估计转换为最小化$\sum_{t=1}^{T-1} E_{q(x_t|x_0)}[D_{KL}(q(x_t|x_{t-1},x_0)||p_{\theta}(x_t|x_{t+1}))]$

## 最小化$\sum_{t=1}^{T-1} E_{q(x_t|x_0)}[D_{KL}(q(x_t|x_{t-1},x_0)||p_{\theta}(x_t|x_{t+1}))]$

$L_{t-1}$代表真实分布$q(x_{t-1}|x_t,x_0)$和学习预测出的$p_{\theta}(x_{t-1}|x_t)$的差异

最小化KL散度可以使用公式计算，但有更简单的方法：$q(x_{t-1}|x_t,x_0)$的均值和方差为定值，可以让$q(x_{t-1}|x_t,x_0)$和$p_\theta(x_{t-1}|x_t)$得均值越接近越好，因此期望与求$q(x_{t-1}|x_t,x_0)$分布的均值，并训练神经网络使$G(x_t)$与之越接近越好

使用贝叶斯公式：
$$
q(x_{t-1}|x_t,x_0)=\frac{q(x_{t-1},x_t,x_0)}{q(x_t,x_0)}=\frac{q(x_t|x_{t-1})q(x_{t-1}|x_0)q(x_0)}{q(x_t|x_0)q(x_0)}=\frac{q(x_t|x_{t-1})q(x_{t-1}|x_0)}{q(x_t|x_0)}
$$

可以进行如下变换：

  ![image-20230428212852524](./DDPM.assets/image-20230428212852524.png)

 

发现$q(x_{t-1}|x_t,x_0)$的数据分布

均值为
$$
\mu(x_{t-1}|x_t,x_0)=
\frac{
		\sqrt \alpha_t(1-\overline \alpha_{t-1})x_t+\sqrt{\overline\alpha_{t-1}}\beta_t x_0
	}
	{
		1-\overline \alpha_t
	}
$$
方差为
$$
\sigma(x_{t-1}|x_t,x_0)=
\frac
{
	(1-\alpha_t)(1-\overline \alpha_{t-1})
}
{
	1-\overline\alpha_t
}
$$


由
$$
x_t=\sqrt{\overline\alpha_t}x_0+\sqrt{1-\overline\alpha_t}\epsilon \rightarrow x_0=\frac
{
	x_t-\sqrt{1-\overline \alpha_t}\epsilon
}
{
	\sqrt{\overline \alpha_t}
}
$$
代入$q(x_{t-1}|x_t,x_0)$均值化简

![image-20230523201229252](./DDPM.assets/image-20230523201229252.png)

得

$$
x_{t-1}=
\frac
{
	1
}
{
	\sqrt {\alpha_t}
}
(x_t-\frac
		{
			1-\alpha_t
		}
		{
			\sqrt{1-\overline \alpha_t}
		}
		\epsilon
	)
$$


最小化$\sum_{t=2}^T E_{q(x_t|x_0)}[D_{KL}(q(x_{t-1}|x_t,x_0)||p_{\theta}(x_{t-1}|x_t))]$即让两个分布尽可能相似，KL散度越小越好，使两个高斯分布KL散度最小等价于使其均值相似，因此我们可以只预测$\epsilon_t$
$$
x_{t-1}=\frac
{
	1
}
{
	\sqrt {\alpha_t}
}
(x_t-\frac
		{
			1-\alpha_t
		}
		{
			\sqrt{1-\overline \alpha_t}
		}
		\epsilon_{\theta}(x_t,t)
	)+\sigma_tz
$$
![image-20230429013317985](./DDPM.assets/image-20230429013317985.png)