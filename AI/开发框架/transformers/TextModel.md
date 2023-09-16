# TextModel

## call

返回BaseModelOutputWithPooling，包含：

- last_hidden_state

## resize_token_embeddings

根据新的长度增加新的embedding向量

## get_input_embeddings

获取Embedding层，用.weight.data获取embedding 行向量矩阵