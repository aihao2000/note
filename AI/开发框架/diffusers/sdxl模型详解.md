

# Stable Diffusion XL

## UNet

addition_embed_type='text_embeds'

- 时间编码

```python
t_emb = self.get_time_embed(sample=sample, timestep=timestep) #(bs,320)
emb = self.time_embedding(t_emb, timestep_cond) # (bs,1280)
```

- 附加额外编码

  added_cond_kwargs包含text_embeds和time_ids

  ```python
  aug_emb = self.get_aug_embed(
      emb=emb, encoder_hidden_states=encoder_hidden_states, added_cond_kwargs=added_cond_kwargs
  ) # (bs,1280)
  emb = emb + aug_emb if aug_emb is not None else emb
  ```

- 卷积输入

  ```python
  sample = self.conv_in(sample) # (bs,4,128,128)->(bs,320,128,128)
  ```

- DownBlock2D

  - ResnetBlock2D对图像嵌入时间编码

    ```python
    hidden_states = resnet(hidden_states, temb, scale=scale)
    output_states = output_states + (hidden_states,)
    ```

    - norm1

      对hidden_states作归一化，使用GroupNorm层

      ```python
      self.norm1 = torch.nn.GroupNorm(num_groups=groups, num_channels=in_channels, eps=eps, affine=True)
      ```

      ```python
      hidden_states = input_tensor
      
      hidden_states = self.norm1(hidden_states)
      hidden_states = self.nonlinearity(hidden_states)
      ```

    - conv1

      ```python
      self.conv1 = conv_cls(in_channels, out_channels, kernel_size=3, stride=1, padding=1)
      ```

      ```python
      hidden_states = self.conv1(hidden_states, scale) if not USE_PEFT_BACKEND else self.conv1(hidden_states)
      ```

    - time_emb嵌入

      ```python
      self.time_emb_proj = linear_cls(temb_channels, out_channels)
      ```

      ```python
      temb = self.nonlinearity(temb)
      temb = (
                  self.time_emb_proj(temb, scale)[:, :, None, None]
                  if not USE_PEFT_BACKEND
                  else self.time_emb_proj(temb)[:, :, None, None]
              ) # (bs,1280)->(bs,320,1,1)
      hidden_states = hidden_states + temb
      
      hidden_states = self.norm2(hidden_states)
      
      hidden_states = self.nonlinearity(hidden_states)
      
      hidden_states = self.dropout(hidden_states)
      hidden_states = self.conv2(hidden_states, scale) if not USE_PEFT_BACKEND else self.conv2(hidden_states)
      output_tensor = (input_tensor + hidden_states) / self.output_scale_factor
      ```

  - Downsampler

    ```python
    hidden_states = downsampler(hidden_states, scale=scale)
    
    output_states = output_states + (hidden_states,)
    ```

  - Downblock2D返回hidden_states, output_states

- time_embedding(the)

- CrossAttnDownBlock2D

  包含restnet和Transformer2D模块

  - resnet....

  - Transformer2DModel
  
    - norm
  
      ```python
      self.norm = torch.nn.GroupNorm(num_groups=norm_num_groups, num_channels=in_channels, eps=1e-6, affine=True)
      
      hidden_states = self.norm(hidden_states)
      ```
    
    - 变形hidden_state
    
      ```python
      inner_dim = hidden_states.shape[1]
      hidden_states = hidden_states.permute(0, 2, 3, 1).reshape(batch, height * width, inner_dim)
      hidden_states = (
          self.proj_in(hidden_states, scale=lora_scale)
          if not USE_PEFT_BACKEND
          else self.proj_in(hidden_states)
      )
      ```
    
    - 遍历transformer_blocks，类型为BasicTransformerBlock
    
      hidden_states的shape为(bs,1024,1280)
    
      - norm1
    
        对hidden_states标准化
    
        ```python
        self.norm1 = nn.LayerNorm(dim, elementwise_affine=norm_elementwise_affine, eps=norm_eps)
        ```
    
        ```python
        norm_hidden_states = self.norm1(hidden_states)
        ```
    
      - attn1
    
        自注意力层
    
      - norm2
    
        ```python
        self.norm2 = nn.LayerNorm(dim, norm_eps, norm_elementwise_affine)
        ```
    
        ```python
        norm_hidden_states = self.norm2(hidden_states)
        ```
    
      - attn2
    
        交叉注意力层
    
      
    
    

## Transformer2DModel

- norm

  ```python
  self.norm = torch.nn.GroupNorm(num_groups=norm_num_groups, num_channels=in_channels, eps=1e-6, affine=True)
  ```

  

- 

## BasicTransformerBlock

## 