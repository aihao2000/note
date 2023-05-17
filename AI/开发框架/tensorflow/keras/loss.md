## tensorflow.keras.loss

## MeanSquaredError

## SparseCategoricalCrossentropy

应用于one-hot编码的多分类问题
$$
\vec a=softmax(\vec  z)\\
L(\vec a,y)=
\begin{cases}
-log(a_1) \ \ \  y=1 \\
... \\
-log(a_n)\ \ \  y=n
\end{cases} \\
J(w,b)=\frac{1}{m}\sum_{i=1}^m\sum_{j=1}^N \{y^{(i)}=j\}(-log\frac{e^{z_j^{(i)}}}{\sum_{k=1}^Ne^{z_k^{(i)}}})
$$
