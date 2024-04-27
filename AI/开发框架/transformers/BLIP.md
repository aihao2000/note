```python
def blip2_qa(
    image: Image.Image,
    prompt: str,
    decoding_method: str = "Nucleus sampling",
    temperature: float = 1.0,
    length_penalty: float = 1.0,
    repetition_penalty: float = 1.5,
    max_length: int = 50,
    min_length: int = 1,
    num_beams: int = 5,
    top_p: float = 0.9,
):
    inputs = processor(image, text=prompt, return_tensors="pt").to(
        "cuda", torch.float16
    )
    generated_ids = model.generate(
        **inputs,
        do_sample=decoding_method == "Nucleus sampling",
        temperature=temperature,
        length_penalty=length_penalty,
        repetition_penalty=repetition_penalty,
        max_length=max_length,
        min_length=min_length,
        num_beams=num_beams,
        top_p=top_p,
    )
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[
        0
    ].strip()
    return generated_text
```

