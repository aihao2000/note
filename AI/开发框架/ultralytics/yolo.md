# yolo

## 加载模型

```python
model = YOLO('yolov8n.pt')  # pretrained YOLOv8n model
```

## 推理

 ```python
 results = model(['im1.jpg', 'im2.jpg'])  # return a list of Results objects
 ```

## 结果格式

对象列表，每个对象为一个样本的推理结果，拥有以下属性:

| Attribute    | Type                  | Description                                                  |
| ------------ | --------------------- | ------------------------------------------------------------ |
| `orig_img`   | `numpy.ndarray`       | The original image as a numpy array.                         |
| `orig_shape` | `tuple`               | The original image shape in (height, width) format.          |
| `boxes`      | `Boxes, optional`     | A Boxes object containing the detection bounding boxes.      |
| `masks`      | `Masks, optional`     | A Masks object containing the detection masks.               |
| `probs`      | `Probs, optional`     | A Probs object containing probabilities of each class for classification task. |
| `keypoints`  | `Keypoints, optional` | A Keypoints object containing detected keypoints for each object. |
| `speed`      | `dict`                | A dictionary of preprocess, inference, and postprocess speeds in milliseconds per image. |
| `names`      | `dict`                | A dictionary of class names.                                 |
| `path`       | `str`                 | The path to the image file.                                  |

## 结果方法

### 转换为可视化形式

```