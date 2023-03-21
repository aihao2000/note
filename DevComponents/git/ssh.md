# 生成ssh
```git
ssh-keygen -t ed25519 -C "your_email@example.com"
```
# ssh-agent
```
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```