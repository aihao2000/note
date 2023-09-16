# UNet2DConditionModel

## 子模块

### conv_in_padding

Conv2d类型，将输入的图片转换到block_out_channels[0]上，大小不变

```python
conv_in_padding = (conv_in_kernel - 1) // 2
        self.conv_in = nn.Conv2d(
            in_channels, block_out_channels[0], kernel_size=conv_in_kernel, padding=conv_in_padding
        )
```

### time_proj

负责将时间信息映射到block_out_channels[0]维度上.

由time_embedding_type控制映射算法及层类型

```python
 		if time_embedding_type == "fourier":
            time_embed_dim = time_embedding_dim or block_out_channels[0] * 2
            if time_embed_dim % 2 != 0:
                raise ValueError(f"`time_embed_dim` should be divisible by 2, but is {time_embed_dim}.")
            self.time_proj = GaussianFourierProjection(
                time_embed_dim // 2, set_W_to_weight=False, log=False, flip_sin_to_cos=flip_sin_to_cos
            )
            timestep_input_dim = time_embed_dim
        elif time_embedding_type == "positional":
            time_embed_dim = time_embedding_dim or block_out_channels[0] * 4

            self.time_proj = Timesteps(block_out_channels[0], flip_sin_to_cos, freq_shift)
            timestep_input_dim = block_out_channels[0]
        else:
            raise ValueError(
                f"{time_embedding_type} does not exist. Please make sure to use one of `fourier` or `positional`."
            )
```



调用：

```python
		# 1. time
        timesteps = timestep
        if not torch.is_tensor(timesteps):
            # TODO: this requires sync between CPU and GPU. So try to pass timesteps as tensors if you can
            # This would be a good case for the `match` statement (Python 3.10+)
            is_mps = sample.device.type == "mps"
            if isinstance(timestep, float):
                dtype = torch.float32 if is_mps else torch.float64
            else:
                dtype = torch.int32 if is_mps else torch.int64
            timesteps = torch.tensor([timesteps], dtype=dtype, device=sample.device)
        elif len(timesteps.shape) == 0:
            timesteps = timesteps[None].to(sample.device)

        # broadcast to batch dimension in a way that's compatible with ONNX/Core ML
        timesteps = timesteps.expand(sample.shape[0])

        t_emb = self.time_proj(timesteps)
        # `Timesteps` does not contain any weights and will always return f32 tensors
        # but time_embedding might actually be running in fp16. so we need to cast here.
        # there might be better ways to encapsulate this.
        t_emb = t_emb.to(dtype=sample.dtype)
```



### time_embedding

TimestepEmbedding类型，并且可以添加条件，条件映射到timestep_input_dim维度，加到输入的timestep向量上然后进行整体编码

```python
self.time_embedding = TimestepEmbedding(
            timestep_input_dim,
            time_embed_dim,
            act_fn=act_fn,
            post_act_fn=timestep_post_act,
            cond_proj_dim=time_cond_proj_dim,
        )
```

### encoder_hid_proj

仅当encoder_hid_dim参数存在时存在该层，由encoder_hid_dim_type控制类型

负责计算用作交叉注意力的条件向量。将encoder_hid_dim维度投影到cross_attention_dim

encoder_hid_dim_type包含：

- text_proj
- text_image_proj
- image_proj

### class_emvedding

```python
# class embedding
if class_embed_type is None and num_class_embeds is not None:
    self.class_embedding = nn.Embedding(num_class_embeds, time_embed_dim)
elif class_embed_type == "timestep":
    self.class_embedding = TimestepEmbedding(timestep_input_dim, time_embed_dim, act_fn=act_fn)
elif class_embed_type == "identity":
    self.class_embedding = nn.Identity(time_embed_dim, time_embed_dim)
elif class_embed_type == "projection":
    if projection_class_embeddings_input_dim is None:
        raise ValueError(
            "`class_embed_type`: 'projection' requires `projection_class_embeddings_input_dim` be set"
        )
    # The projection `class_embed_type` is the same as the timestep `class_embed_type` except
    # 1. the `class_labels` inputs are not first converted to sinusoidal embeddings
    # 2. it projects from an arbitrary input dimension.
    #
    # Note that `TimestepEmbedding` is quite general, being mainly linear layers and activations.
    # When used for embedding actual timesteps, the timesteps are first converted to sinusoidal embeddings.
    # As a result, `TimestepEmbedding` can be passed arbitrary vectors.
    self.class_embedding = TimestepEmbedding(projection_class_embeddings_input_dim, time_embed_dim)
elif class_embed_type == "simple_projection":
    if projection_class_embeddings_input_dim is None:
        raise ValueError(
            "`class_embed_type`: 'simple_projection' requires `projection_class_embeddings_input_dim` be set"
        )
    self.class_embedding = nn.Linear(projection_class_embeddings_input_dim, time_embed_dim)
else:
    self.class_embedding = None
```

### add_embedding

由addition_embed_type控制

```python
if addition_embed_type == "text":
    if encoder_hid_dim is not None:
        text_time_embedding_from_dim = encoder_hid_dim
    else:
        text_time_embedding_from_dim = cross_attention_dim

    self.add_embedding = TextTimeEmbedding(
        text_time_embedding_from_dim, time_embed_dim, num_heads=addition_embed_type_num_heads
    )
elif addition_embed_type == "text_image":
    # text_embed_dim and image_embed_dim DON'T have to be `cross_attention_dim`. To not clutter the __init__ too much
    # they are set to `cross_attention_dim` here as this is exactly the required dimension for the currently only use
    # case when `addition_embed_type == "text_image"` (Kadinsky 2.1)`
    self.add_embedding = TextImageTimeEmbedding(
        text_embed_dim=cross_attention_dim, image_embed_dim=cross_attention_dim, time_embed_dim=time_embed_dim
    )
elif addition_embed_type == "text_time":
    self.add_time_proj = Timesteps(addition_time_embed_dim, flip_sin_to_cos, freq_shift)
    self.add_embedding = TimestepEmbedding(projection_class_embeddings_input_dim, time_embed_dim)
elif addition_embed_type == "image":
    # Kandinsky 2.2
    self.add_embedding = ImageTimeEmbedding(image_embed_dim=encoder_hid_dim, time_embed_dim=time_embed_dim)
elif addition_embed_type == "image_hint":
    # Kandinsky 2.2 ControlNet
    self.add_embedding = ImageHintTimeEmbedding(image_embed_dim=encoder_hid_dim, time_embed_dim=time_embed_dim)
elif addition_embed_type is not None:
    raise ValueError(f"addition_embed_type: {addition_embed_type} must be None, 'text' or 'text_image'.")

if time_embedding_act_fn is None:
    self.time_embed_act = None
else:
    self.time_embed_act = get_activation(time_embedding_act_fn)
```

### down_blocks

down_blocks

## forword

