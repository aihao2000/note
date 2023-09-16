# VAE

## VaeImageProcessor

```python
vae_image_processor = VaeImageProcessor(
            vae_scale_factor=self.vae_scale_factor,
            do_convert_rgb=True,
            do_normalize=False,
        )
```

- vae_scale_factor

  vae对图像缩放的倍数，隐空间长宽都为原来的1/vae_scale_factor

## AutoEncoderKL

### config

- scaling_factor

  如sdxl vae的scaling_factor为0.13025。图像经过vae编码后，通常需要手动乘scaling_factor，同样，隐变量在vae解码前，也需要手动除scaling_factor
