# FName

- FName()

  ```cpp
  FName(FString());//用FString初始化Name
  ```

## 转换

### 从FName

- 变为FString

  name.ToString()

- 变为FText

  text=FText::FromName(name);

### 到FName

- 从FString

  name=FName(*string);

- 从FText

  

