# tensorflow.

## 变量

### constant

### tensor

## 变换

### convert_to_tensor

list转tensor

### transpose

### boolean_mask

```python
def boolean_mask_v2(tensor, mask, axis=None, name="boolean_mask")
```

将根据mask的值选组tensor中的元素

### reshape



### gather

```python
@tf_export("gather", v1=[])
@dispatch.add_dispatch_support
def gather_v2(params,
              indices,
              validate_indices=None,
              axis=None,
              batch_dims=0,
              name=None):
```

根据下表选取元素并合并为容器

## 计算

### argmax

```python
def argmax_v2(input, axis=None, output_type=dtypes.int64, name=None)
```

返回最大值的下标

### reduce_max

```python
def reduce_max(input_tensor, axis=None, keepdims=False, name=None)
```

返回最大值

### reduce_sum

### norm

### matmul