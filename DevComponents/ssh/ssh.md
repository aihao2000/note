# ssh

非对称加密组件，用于通讯

# 生成ssh

```git
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- -t指定密钥类型

# ssh-agent

```
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 本地公钥上传到服务器

```shell
ssh-copy-id -i ~/.ssh/id_rsa.pub [user@]machine
```



