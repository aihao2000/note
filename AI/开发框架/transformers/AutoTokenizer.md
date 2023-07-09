# AutoTokenizer

## from_pretrained

- "bert-base-uncased"

## call

返回一个字典,包含

- input_id

  替换单词为token后的序列

- token_type_ids

  如果有多个序列，标记属于哪一个序列

- attention_mask

  标记是否被屏蔽