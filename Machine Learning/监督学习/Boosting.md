# Boosting



$G_m(x)$在训练集上的分类误差率，[0,1]
$$
e_m=\sum_{i=1}^N P(G_m(x_i)\neq y_i)=\sum_{i=1}^N w_{mi}I(G_m(x_i)\neq y_i)
$$

$$
\alpha_m=\frac{1}{2}log\frac{1-e_m}{e_m}\hfill \\
Z_m=\sum_{i=1}^Nw_{mi}e^{-\alpha_my_iG_m(x_i)}\hfill \\
w_{m+1,i}=\frac{w_{mi}}{Z_m}e^{-\alpha_my_iG_m(x_i)} \hfill
$$
