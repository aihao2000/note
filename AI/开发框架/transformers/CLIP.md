# CLIP

CLIP包含两个模型，text_encoder,image_encoder，以及线性层将两个模型的输出映射为同样的维度内对比学习

## CLIPModel

使用CLIPModel加载整个CLIP模型，包含text_encoder,image_encoder

### call

返回CLIPOutput对象

- loss
- logits_per_image
- logits_per_text
- text_embeds
- image_embeds
- text_model_output
- vision_model_output

```python
@dataclass
class CLIPOutput(ModelOutput):
    """
    Args:
        loss (`torch.FloatTensor` of shape `(1,)`, *optional*, returned when `return_loss` is `True`):
            Contrastive loss for image-text similarity.
        logits_per_image:(`torch.FloatTensor` of shape `(image_batch_size, text_batch_size)`):
            The scaled dot product scores between `image_embeds` and `text_embeds`. This represents the image-text
            similarity scores.
        logits_per_text:(`torch.FloatTensor` of shape `(text_batch_size, image_batch_size)`):
            The scaled dot product scores between `text_embeds` and `image_embeds`. This represents the text-image
            similarity scores.
        text_embeds(`torch.FloatTensor` of shape `(batch_size, output_dim`):
            The text embeddings obtained by applying the projection layer to the pooled output of [`CLIPTextModel`].
        image_embeds(`torch.FloatTensor` of shape `(batch_size, output_dim`):
            The image embeddings obtained by applying the projection layer to the pooled output of [`CLIPVisionModel`].
        text_model_output(`BaseModelOutputWithPooling`):
            The output of the [`CLIPTextModel`].
        vision_model_output(`BaseModelOutputWithPooling`):
            The output of the [`CLIPVisionModel`].
    """

    loss: Optional[torch.FloatTensor] = None
    logits_per_image: torch.FloatTensor = None
    logits_per_text: torch.FloatTensor = None
    text_embeds: torch.FloatTensor = None
    image_embeds: torch.FloatTensor = None
    text_model_output: BaseModelOutputWithPooling = None
    vision_model_output: BaseModelOutputWithPooling = None

    def to_tuple(self) -> Tuple[Any]:
        return tuple(
            self[k] if k not in ["text_model_output", "vision_model_output"] else getattr(self, k).to_tuple()
            for k in self.keys()
        )
```



### get_text_features

### get_image_features

## CLIPProcessor

### call

- text

- images

- return_tensors

- padding

  bool，传入True

可以使用AutoProcessor加载CLIP的预处理器

使用CLIPImageProcessor



## CLIPVisionModel

需要使用CLIPImageProcessor加工图像,加工后返回一个字典，可以从pixel_values获取输入

返回一个BaseModelOutputWithPooling对象

### call

- output_hidden_states

## CLIPVisionModelOutput

```python
image_embeds: Optional[torch.FloatTensor] = None
last_hidden_state: torch.FloatTensor = None
hidden_states: Optional[Tuple[torch.FloatTensor]] = None
attentions: Optional[Tuple[torch.FloatTensor]] = None
```

## CLIPTextModel

## CLIPImageProcessor

```shell
pixiv/{AI}/{user}/{series_id}{series_title}/{series_order}_{page_title}_{page_tag}_{type}_{tags_transl_only}_{id}
```

