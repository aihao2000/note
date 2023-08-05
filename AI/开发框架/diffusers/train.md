# train

## 标记变量

- gradient_accumulation_steps

  累积多少步进行梯度下降

- epoch

  训练轮数

- num_update_steps_per_epoch

  每一轮会执行多少次更新

  ```python
  num_update_steps_per_epoch = math.ceil(
          len(train_dataloader) / gradient_accumulation_steps
      )
  ```

- max_train_steps

  最大训练步数

  ```python
  max_train_steps = num_train_epochs * num_update_steps_per_epoch
  ```

- num_train_epochs

  ```python
  num_train_epochs = math.ceil(max_train_steps / num_update_steps_per_epoch)
  ```

- global_step

  训练总共进行了多少步