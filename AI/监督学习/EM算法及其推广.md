# EM算法

初值敏感型算法，只能保证收敛到极小值。

## 步骤

对于存在隐变量z的实验，随机变量z的结果不可观测，随机变量y的数据可以观测，n次实验结果$Y=(y_1,...,y_n)$

求模型参数为$\theta$的极大似然估计
$$
\tilde{\theta}=arg\max_{\theta}logP(Y|\theta)
$$
Q函数：完全数据的对数似然函数$logP(Y,Z|\theta)$关于在给定 观测数据Y和当前参数$\theta^{(i)}$下 对为观测数据Z的条件概率分布$P(Z|Y,\theta^{(i)})$的期望称为Q函数

EM算法：

- 选取参数$\theta^{(0)}$,然后通过下面的步骤迭代计算参数的估计值，知道收敛为止

- 第i次迭代如下

  求使Q函数极大的$\theta$并更新为$\theta$
  $$
  Q(\theta,\theta^{(i)})=\sum_Z log P(Y,Z|\theta)P(Z|Y,\theta^{(i)})
  $$

- 直至算法收敛

## EM算法的导出

极大化观测数据（不完全数据）Y关于参数$\theta$的对数似然函数，即极大化
$$
L(\theta)=logP(Y|\theta)\\\
=log\sum_ZP(Y,Z,|\theta)\\
=\log(\sum_ZP(Y|Z,\theta)P(Z|\theta))
$$
极大化的主要困难是式中有为观测数据并有包含 和 或 积分的对数

EM算法通过迭代逐步近似极大化$L(\theta)$。

假设第i次迭代后$\theta$的估计值是$\theta^{(i)}$。希望新估计的$\theta$能使$L(\theta)$增加，即$L(\theta)>L(\theta^{(i)})$，逐步达到极大值

为此考虑两者的差
$$
L(\theta)-L(\theta^{(i)})=\log(\sum_Z{P(Y|Z,\theta)P(Z|\theta)})-\log{P(Y|\theta^{(i)})}
$$
利用Jensen不等式，即
$$
log\sum_j\lambda_jy_j\ge\sum_j\lambda_jlogy_j\\
其中\lambda_j\ge 0,\sum_j\lambda_j=1
$$
得
$$
L(\theta)-L(\theta^{(i)})=\log(\sum_Z{P(Y|Z,\theta)P(Z|\theta)})-\log{P(Y|\theta^{(i)})} \\
=\log(\sum_Z{\frac{P(Y|Z,\theta)P(Z|\theta)}{P(Y|\theta^{(i)})}})\\
=\log(\sum_Z{P(Z|Y,\theta^{(i)})\frac{P(Y|Z,\theta)P(Z|\theta)}{P(Z|Y,\theta^{(i)})P(Y|\theta^{(i)})}} )\\
\ge \sum_Z{P(Z|Y,\theta^{(i)})\log(\frac{P(Y|Z,\theta)P(Z|\theta)}{P(Z|Y,\theta^{(i)})P(Y|\theta^{(i)})})}
$$
令
$$
B(\theta,\theta^{(i)})\\
=L(\theta^{(i)})+\sum_Z{P(Z|Y,\theta^{(i)})\log(\frac{P(Y|Z,\theta)P(Z|\theta)}{P(Z|Y,\theta^{(i)})P(Y|\theta^{(i)})})}\\
\le L(\theta^{(i)})+L(\theta)-L(\theta^{(i)})=L(\theta)
$$
则
$$
L(\theta)\ge B(\theta,\theta^{(i)})
$$
及$B(\theta,\theta^{(i)})$是$L(\theta)$的下界，因此选择$\theta^{(i+1)}$使$B(\theta,\theta^{(i+1)})$达到极大
$$
\theta^{(i+1)}=arg\max_{\theta}B(\theta,\theta^{(i)})
$$
![image-20230420144205627](./EM%E7%AE%97%E6%B3%95%E5%8F%8A%E5%85%B6%E6%8E%A8%E5%B9%BF.assets/image-20230420144205627.png)


$$
Q(\theta,\theta^{(i)})=\sum_Z{P(Z|Y,\theta^{(i)})logP(Y,Z|\theta)}\\
=E[(logP(Y,Z|\theta)|Y,\theta^{(i)}]\\
$$



**多元变量的条件期望是指在给定一些随机变量的取值时，另外一些随机变量的期望值。假设我们有一个 $n$ 维随机向量 $\mathbf{X} = (X_1, X_2, \ldots, X_n)^T$，我们感兴趣的是在给定一些子向量 $\mathbf{Y} = (Y_1, Y_2, \ldots, Y_m)^T$ 的取值时，另外一些子向量 $\mathbf{Z} = (Z_1, Z_2, \ldots, Z_{n-m})^T$ 的条件期望。**

**条件期望的定义是：**

**$$E(\mathbf{Z}|\mathbf{Y}) = \int_{-\infty}^{\infty} \cdots \int_{-\infty}^{\infty} \mathbf{z} \cdot f(\mathbf{z}|\mathbf{y}) d\mathbf{z}$$**

**其中，$f(\mathbf{z}|\mathbf{y})$ 是给定 $\mathbf{Y}$ 的条件下 $\mathbf{Z}$ 的概率密度函数。这个式子的意义是将 $\mathbf{Z}$ 的每个元素乘以对应的概率，然后对所有可能的 $\mathbf{Z}$ 进行积分求和。**

**对于离散型的随机向量，条件期望可以表示成：**

**$$E(\mathbf{Z}|\mathbf{Y}) = \sum_{\mathbf{z}} \mathbf{z} \cdot P(\mathbf{Z}=\mathbf{z}|\mathbf{Y})$$**

**其中，$P(\mathbf{Z}=\mathbf{z}|\mathbf{Y})$ 是给定 $\mathbf{Y}$ 的条件下 $\mathbf{Z}$ 取值为 $\mathbf{z}$ 的概率。**



图像解释为

![image-20230420144503324](./EM%E7%AE%97%E6%B3%95%E5%8F%8A%E5%85%B6%E6%8E%A8%E5%B9%BF.assets/image-20230420144503324.png)



## EM算法再高斯混合模型学习中的应用

### 高斯混合模型

$$
P(y|\theta)=\sum_{k=1}^K{\alpha_k \phi(y|\theta_k) }
$$

- $\alpha_k$是系数，$\alpha_k \ge 0$,$\sum_{k=1}^K{\alpha_k=1}$
- $\phi(y|\theta_k)$是高斯分布密度，$\theta_k=(\mu_k,\sigma^2_k)$,称为第k个分模型

可以理解为$\alpha_k$的概率使用第k个高斯分布模型$\phi(y|\theta_k)$生成观测结果

### 高斯混合模型参数估计中的EM算法

观测数据$y_j,j=1,2,...,N$

记未观测数据$\gamma_{jk}$为第j个样本来自于第k个模型
$$
\gamma_{jk}=
\begin{cases}
1 & 第j个观测来自于第k个分模型\\
0 & else
\end{cases}
$$
因此完全数据为$(y_j,\gamma_{j1},\gamma_{j2},...,\gamma_{jK}),j=1,...,N$

完全数据的似然函数
$$
P(y,\gamma|\theta)=\prod_{j=1}^N P(y_j,\gamma_{j1},...,\gamma_{jK}|\theta)\\
=\prod_{j=1}^N \prod_{k=1}^K[\alpha_k\phi(y_j|\theta_k)]^{\gamma_{jk}}\\
=\prod_{j=1}^N\prod_{k=1}^K\alpha_k^{\gamma_{jk}}\phi(y_j|\theta_k)^{\gamma_{jk}}\\
=\prod_{k=1}^K\alpha_k^{n_k}\prod_{j=1}^N\phi(y_j|\theta_k)^{\gamma_{jk}}
$$
$n_k=\sum_{j=1}^N\gamma_{jk}$,代表了第k个模型贡献了多少次预测

因此$\sum_{k=1}^K n_k=N$

那么，完全数据的对数似然函数为
$$
log P(y,\gamma|\theta)=\sum_{k=1}^K \log(\alpha_k^{n_k}\prod _{j=1}^N\phi(y_j|\theta_k)^{\gamma_{jk}})\\
=\sum_{k=1}^K\left(n_k\log(\alpha_k)+\sum_{j=1}^N \gamma_{jk}\log(\phi(y_j|\theta_k)) \right)\\
=\sum_{k=1}^K\left(\sum_{j=1}^N{\gamma_{jk}}\log(\alpha_k)+\sum_{j=1}^N \gamma_{jk}\log(\phi(y_j|\theta_k)) \right)
$$


#### E

$$
Q(\theta,\theta^{(i)})=E[\log(P(y,\gamma|\theta),y,\theta^{(i)})]\\
=E[\sum_{k=1}^K\left(\sum_{j=1}^N{\gamma_{jk}}\log(\alpha_k)+\sum_{j=1}^N \gamma_{jk}\log(\phi(y_j|\theta_k)) \right)]\\
=\sum_{k=1}^K\left(\sum_{j=1}^N{E[\gamma_{jk}]}\log(\alpha_k)+\sum_{j=1}^N E[\gamma_{jk}]\log(\phi(y_j|\theta_k)) \right)
$$

???

令
$$
\hat\gamma_{jk}=E(\gamma_{jk}|y,\theta)=P(\gamma_{jk}=1|y,\theta)\\
=\frac{P(\gamma_{jk}=1,y_j|\theta)}{\sum_{k=1}^KP(\gamma_{jk}=1,y_j|\theta)}\\
=\frac{P(y_j|\gamma_{jk}=1,\theta)P(\gamma_{jk}=1|\theta)}{\sum_{k=1}^KP(y_j|\gamma_{jk}=1,\theta)P(\gamma_{jk}=1|\theta)}\\
=\frac{\alpha_k\phi(y_j|\theta_k)}{\sum_{k=1}^k\alpha_k\phi(y_j|\theta_k)}
$$
???

$\hat\gamma_{jk}$是当前模型参属下第j个观测数据来自第k个分模型的概率，称为分模型k对观测数据$y_j$的响应度。
$$
Q(\theta,\theta^{(i)})=\sum_{k=1}^K\left(\sum_{j=1}^N{\hat\gamma_{jk}}\log(\alpha_k)+\sum_{j=1}^N \hat\gamma_{jk}\log(\phi(y_j|\theta_k)) \right)
$$

#### M

计算新一轮迭代模型的参数

求函数$Q(\theta,\theta^{(i)})$对$\theta$的极大值，$\hat\mu_k,\hat\sigma_k^2$分别对$\mu_k,\sigma_k^2$求偏导并令其为0的到，$\hat\alpha_k$在$\sum_{k=1}^K\alpha_k=1$的条件下求偏导并令其等于0，结果如下：

![image-20230422103832187](./EM%E7%AE%97%E6%B3%95%E5%8F%8A%E5%85%B6%E6%8E%A8%E5%B9%BF.assets/image-20230422103832187.png)



重复以上计算，知道对数似然函数值不再又明显的变化为止

#### 概览

![image-20230422103947929](./EM%E7%AE%97%E6%B3%95%E5%8F%8A%E5%85%B6%E6%8E%A8%E5%B9%BF.assets/image-20230422103947929.png)
