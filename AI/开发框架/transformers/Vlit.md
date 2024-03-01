```python
processor = ViltProcessor.from_pretrained("/share2/aihao/workspace/deeplearning-content/models/dandelin/vilt-b32-finetuned-vqa")
model = ViltForQuestionAnswering.from_pretrained("/share2/aihao/workspace/deeplearning-content/models/dandelin/vilt-b32-finetuned-vqa").to("cuda")
def vqa(image, text):
    encoding = processor(image, text, return_tensors="pt").to("cuda")
    # forward pass
    outputs = model(**encoding)
    logits = outputs.logits
    idx = logits.argmax(-1).item()
    return model.config.id2label[idx]Ï
```

