# models

通常由ModelMixin，COnfigMixin派生而来，

## ModelMixin

实现了加载保存参数的方法

### save_pretrained

保存模型以及配置到一个目录，并通过from_pretrained再次加载

- variant

### from_pretrained

  下载并缓存模型的参数以及配置

  - subfolder

## UNet2DModel

由以下层组成

- conv_in
- time_proj
- time_embedding

### 构造函数

## UNet2DConditionModel

### 构造函数

in_channels规定第0层，conv_in的输入通道数，使用same类型的卷积

```python
# input
conv_in_padding = (conv_in_kernel - 1) // 2
self.conv_in = nn.Conv2d(
    in_channels,
    block_out_channels[0],
    kernel_size=conv_in_kernel,
    padding=conv_in_padding,
)
```

time_embedding_type实现time_proj层，有两种取值：

- fourier

  使用GaussianFourierProjection module

- positional

  使用Timesteps module

[1,2n]个block由数组类型参数构建：

- down_block_types

- up_block_types
- block_out_channels
- only_cross_attention
- num_attention_heads
- attention_head_dim
- cross_attention_dim
- layers_per_block

