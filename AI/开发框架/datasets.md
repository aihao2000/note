# datasets

## 预先查看数据集信息

```python
ds_builder=load_dataset_bnuilder(dataset_name)
ds_builder.info.features
```

## 加载数据集

### load_dataset

```
dataset=load_dataset(dataset_name)
```

- path

  数据集名称

- name

  配置选项

  可以使用get_dataset_config_names()

- spilt

  默认获取子数据集，比如spilt="train"
  
- data_dir

  使用目录创建数据集，path="imagefolder"||"audiofolder"

### from_genenrator

```python
from datasets import Dataset
def gen():
    yield {"pokemon": "bulbasaur", "type": "grass"}
    yield {"pokemon": "squirtle", "type": "water"}
ds = Dataset.from_generator(gen)
ds[0]
```



## 加工数据集

可以使用transformers快速加工处理数据集

### map

传入一个函数，将会自动为每个数据条目调用该函数

```python
def tokenization(example):
    return tokenizer(example["text"])

dataset = dataset.map(tokenization, batched=True)
```

- batched

  将会对批量数据条目调用

### set_transform

## 设置数据集格式

### set_format

```python
dataset.set_format(type="torch", columns=["input_ids", "token_type_ids", "attention_mask", "labels"])
dataset.format['type']
```



### to_tf_dataset

```python
from transformers import DataCollatorWithPadding

data_collator = DataCollatorWithPadding(tokenizer=tokenizer, return_tensors="tf")
tf_dataset = dataset.to_tf_dataset(
    columns=["input_ids", "token_type_ids", "attention_mask"],
    label_cols=["labels"],
    batch_size=2,
    collate_fn=data_collator,
    shuffle=True
)
```

## 指标

### list_metrics

查看可用指标

```python
from datasets import list_metrics
metrics_list = list_metrics()
['accuracy', 'bertscore', 'bleu', 'bleurt', 'cer', 'comet', 'coval', 'cuad', 'f1', 'gleu', 'glue', 'indic_glue', 'matthews_correlation', 'meteor', 'pearsonr', 'precision', 'recall', 'rouge', 'sacrebleu', 'sari', 'seqeval', 'spearmanr', 'squad', 'squad_v2', 'super_glue', 'wer', 'wiki_split', 'xnli']
```

### load_metric

```python
from datasets import load_metric
metric = load_metric('glue', 'mrpc')
```

可以使用inuts_description查看描述

```python
print(metric.inputs_description)
```

### compute

计算指标

```python
model_predictions = model(model_inputs)
final_score = metric.compute(predictions=model_predictions, references=gold_references)
```

## 创建数据集

### 快速构建

有两个基于文件夹的数据集构建器：ImageFolder，AudioFolder

dataset splits根据仓库结构自动生成，并且根据路径自动推断label

### 使用脚本构建

GeneratorBasedBuilder是从路径构建数据集的基类，主要包含三个方法自定义构建：

- info

  存储描述，证书，特征信息

- spilt_generators

  下载定义其分割方法splits

- generate_example

  对每个分割生成图像和标签

#### Conifg

派生BuilderConfig存储配置信息，并在GeneratorBasedBuilder中BUILDER_CONFIGS = []的方式存储不同配置

可在load_dataset(name)参数控制选取不同的配置信息

```python
class Food101(datasets.GeneratorBasedBuilder):
    """Food-101 Images dataset"""
 
    BUILDER_CONFIGS = [
        Food101Config(
            name="breakfast",
            description="Food types commonly eaten during breakfast.",
            data_url="https://link-to-breakfast-foods.zip",
            metadata_urls={
                "train": "https://link-to-breakfast-foods-train.txt", 
                "validation": "https://link-to-breakfast-foods-validation.txt"
            },
        ,
        Food101Config(
            name="dinner",
            description="Food types commonly eaten during dinner.",
            data_url="https://link-to-dinner-foods.zip",
            metadata_urls={
                "train": "https://link-to-dinner-foods-train.txt", 
                "validation": "https://link-to-dinner-foods-validation.txt"
            },
        )
    ]
```

#### info

通过实现\_info方法，返回一个datasets.DatasetInfo实现

```python
def _info(self):
    return datasets.DatasetInfo(
        description=_DESCRIPTION,
        features=datasets.Features(
            {
                "image": datasets.Image(),
                "label": datasets.ClassLabel(names=_NAMES),
            }
        ),
        supervised_keys=("image", "label"),
        homepage=_HOMEPAGE,
        citation=_CITATION,
        license=_LICENSE,
        task_templates=[ImageClassification(image_column="image", label_column="label")],
    )
```

features定义数据集的内部结构，构造函数接受一个[str,FieldType]的字典

FieldType可以是：

- datasets.Value
- datasets.ClassLabel
- datasets.Sqequence
- dict
- list

#### spilt

实现\_spilt\_enerators【下载及】生成split

需要下载，则使用DownloadManager.download()方法下载数据集

使用datasets.Split生成分割

```python
def _split_generators(self, dl_manager):
    archive_path = dl_manager.download(_BASE_URL)
    split_metadata_paths = dl_manager.download(_METADATA_URLS)
    return [
        datasets.SplitGenerator(
            name=datasets.Split.TRAIN,
            gen_kwargs={
                "images": dl_manager.iter_archive(archive_path),
                "metadata_path": split_metadata_paths["train"],
            },
        ),
        datasets.SplitGenerator(
            name=datasets.Split.VALIDATION,
            gen_kwargs={
                "images": dl_manager.iter_archive(archive_path),
                "metadata_path": split_metadata_paths["test"],
            },
        ),
    ]
```

#### 生成数据集

实现\_generate_examples方法生成数据集，接受spilt方法的images，metadata_path作为参数
