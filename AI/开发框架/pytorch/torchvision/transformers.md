# torchvision.transformers

## Resize

更改尺寸，保持宽高比不变可以keep_ratio=True

## Pad

padding: 设置填充大小

- 当为 a 时，上下左右均填充 a 个像素
- 当为 (a, b) 时，左右填充 a 个像素，上下填充 b 个像素
- 当为 (a, b, c, d) 时，左上右下分别填充 a，b，c，d
- padding_mode: 填充模式，有 4 种模式，constant、edge、reflect、symmetric
- fill: 当 padding_mode 为 constant 时，设置填充的像素值，(R, G, B) 或者 (Gray)

## RandomRotation