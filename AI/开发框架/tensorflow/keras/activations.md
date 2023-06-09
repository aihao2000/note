# activations

## softmax

## relu

## swish

```python
swish(x) = x * sigmoid(x)
```

这个函数在形状上与ReLU函数类似，但是具有更平滑的形状，并且可以更好地适应不同的特征分布。实验表明，使用swish激活函数可以在一些图像分类和语言建模等任务中提高模型的性能。

与ReLU相比，Swish函数的导数在整个实数域上处处可导，而ReLU函数的导数在x=0处不存在，因此Swish函数可以更好地支持梯度下降算法的优化，从而有助于提高模型的训练效率。

