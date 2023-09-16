# Stable diffusion

## autoencoder_kl

### 超参数

- scaling_factor

  用于缩放隐空间下的图像,模型的输入通常需要再手动乘scaling_factor，再传入unet

### decoder

## unet

- time_proj 

  映射时间信息t到block_out_channels[0]的维度