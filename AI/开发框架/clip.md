# CLIP

## 加载预训练模型

返回模型，和处理过程

```python
model, preprocess = clip.load("ViT-B/32", device)
```

## 图像编码

```python
image=preprocess(Image.open(path)).unqueeze(0)
with torch.go_grad():
    image_feature=model.endcode_image(image)
    
```

