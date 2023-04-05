# ssh

非对称加密组件，用于通讯

# 生成ssh

```git
ssh-keygen -t ed25519 -C "your_email@example.com"
```

# ssh-agent

```
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 本地公钥和私钥上传到服务器

```shell
ssh-copy-id -i ~/.ssh/id_rsa.pub [user@]machine
```



