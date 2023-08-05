# Tokenizer

## from_pretrained

- "bert-base-uncased"

## call

返回一个字典,包含

- input_id

  替换单词为索引后的序列

- token_type_ids

  如果有多个序列，标记属于哪一个序列

- attention_mask

  标记是否被屏蔽

## add_tokens

添加新的tokens，内部为其分配id

## encode

将传入的句子分词并转换为id序列

## convert_tokens_to_ids

将传入的token列表转换为id序列

## \__len\_\_

返回词典大小