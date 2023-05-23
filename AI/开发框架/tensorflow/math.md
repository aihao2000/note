# tensorflow.math

## normalize

```python
tf.math.l2_normalize(x,axis)
```

axis的值为轴id,计算标准值的轴。

如axis=0，以列向量为单位标准化

如axis=1，以行向量为单位标准化

## cumprod

```python
tf.math.cumprod(x, axis=0, exclusive=False, reverse=False, name=None)
```

- exclusive

- reverse

  反向计算乘积

```python
x = tf.constant([[1, 2, 3], [4, 5, 6]], dtype=tf.float32)
cumprod = tf.math.cumprod(x, axis=0)

print(cumprod.numpy())  # 输出 [[ 1.  2.  3.], [ 4. 10. 18.]]
```

