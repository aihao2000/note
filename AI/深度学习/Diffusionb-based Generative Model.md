# Diffusiion-based Generative Model

## 前向扩散

初始图像为$x_0$，添加高斯噪声，生成$x_0,x_1,...,x_t$，其中$x_t$对于$x_{t-1}$为高斯分布
$$
q(X_t|x_{t-1})=N(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_tI)
$$

- $\beta_t$越大，则和$x_{t-1}$的差别越大
- 再DDPM的作者采用线性增长$\beta_1=10^{-4},...,\beta_T=0.02$

### 重参数化

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

令$\alpha_t=1-\beta_t,\overline \alpha_t=\prod_{i=0}^t\alpha_ii$可归纳为
$$
x_t \hfill \\
=\sqrt{1-\beta_t}x_{t-1}+\sqrt{\beta_t}\epsilon \hfill\\
=\sqrt{\alpha_t}x_{t-1}+\sqrt{1-\alpha_t}\epsilon\hfill\\
=\sqrt{\alpha_t}(\sqrt{\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_{t-1}}\epsilon)++N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+\sqrt{\alpha_t(1-\alpha_{t-1})}\epsilon++N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+N(0,\alpha_t(1-\alpha_{t-1}))+N(0,1-\alpha_t) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+N(0,1-\alpha_t\alpha_{t-1}) \hfill \\
=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_t\alpha_{t-1}}\epsilon \hfill \\
=... \hfill \\
=\sqrt{\alpha_t...\alpha_1}x_0+\sqrt{1-\alpha_t...\alpha_1}\epsilon \hfill \\
=\sqrt{\overline\alpha_t}x_0+\sqrt{1-\overline\alpha_t}\epsilon \hfill \\
$$

因此

$$
q(x_t|x_0)=N(x_t;\sqrt{\overline \alpha_t}x_0,(1-\overline\alpha_t))
$$

t越大，$\beta_t$越大，$\alpha_t$越小，因此均值趋近于0，方差趋近于1。
$$
\lim_{t->\infty}(x_t|x_0)=\lim_{t->\infty}q(x_t)=N(0,I)
$$

## 逆向扩散

希望由$x_t$变化为$x_0$
$$
p_{\theta}(x_{t-1}|x_t)=N(x_{t-1},\mu_{\theta}(x_t,t),\Sigma_{\theta}(x_t,t))
$$
使用神经网络来估计p，估计每一步的方差与均值.

### 训练神经网络

训练神经网络类似于一个变分自动编码机（VAE）。

当有$x_0$后，可以使用贝叶斯公式反推数据分布,把逆向过程用前向过程表示
$$
q(x_{t-1}|x_t,x_0)=\frac{q(x_t|x_{t-1},x_0)q(x_{t-1}|x_0)}{q(x_t|x_0)}
$$

....

可以优化一个训练数据的负对数似然函数。
$$
-logp(x)
$$
可以证明logp(x)有一个下界
$$
logp(x)\ge E_{q}(x_1|x0)[logp_{\theta}(x_0|x_1)]-\\D_{KL}(q(x_T|x_0)||p(x_T))-\\ \sum_{t=2}^T E_{q(x_t|x_0)}[D_{KL}(q(x_{t-1}|x_t,x_0))]\\
=L_0-L_T-\sum_{t=2}^T L_{t-1}
$$

- $E_{q}(x_1|x0)[logp_{\theta}(x_0|x_1)]$

  重构项，使用独立解码器学习

- $[D_{KL}(q(x_{t-1}|x_t,x_0))]$

  表明

