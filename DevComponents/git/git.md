
# clone
- b
  ```bash
  # 指定分支
  git clone -b <branch> <url> <filename>
  ```
# status
```bash
# 查看哪些文件处于什么状态，用于判断是工作区否有未跟踪的新文件，或修改
git status
```
- -s
  ```bash
  # 更为简短的显示
  # ?? <未跟踪的文件>
  # A <新添加到暂存区的文件>
  # M 修改过的文件
  git status -s
  ```
# diff
```bash
# 只显示未暂存的改动
git diff
```
- --cached
```bash
# 查看已经暂存起来的变化
git diff -cached
```
```
- --staged
  ```bash
  对比已暂存的与最后一次提交的文件差异
```
# .gitignore
git 忽略的文件
- 所有空行或者以#开头的行都会被git忽略
- 可以使用标准的glob模式匹配，它会递归的应用在整个工作区中
- 匹配模式可以以'/'开头防止递归
- 匹配模式可以以'/'结尾指定目录
- 要忽略指定模式以外的文件或目录，可以在模式前加上'!'取反
## glob
指shell所使用的简化了的正则表达式
- *匹配0个或多个任意字符
- [abc]匹配任何一个列在方括号中的字符
- ?只匹配一个任意字符
- **表示匹配任意中间目录
```bash
cat .gitignore
# 忽略所有的.a文件
*.a 
#跟踪所有的lib.a，即便在前面忽略了.a
!lib.a 
 # 之忽略当前目录下的TODO文件，而不忽略usbdir/TODO
/TODO
# 忽略任何目录下名为build的文件夹
build/
# 忽略doc/notes.txt，但不忽略doc/server/arch.txt
doc/*.txt
# 忽略doc/目录及其所有子目录下的.pdf文件
doc/**/*.pdf
```
# add
```bash
# 跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等
# 可理解为精确的将内容添加到下一次提交中
git add <file>
```
# commit
```bash
# 将当前暂存区的修改提交到版本区
git commit 
```
- --amend
```
# 将当前暂存区的修改提交到上次commit里
git commit --amend
```
- -a
```bash
# 将所有已经跟踪过的文件暂存起来一并提交跳过git add的步骤
git commit -a
```
# rm
```bash
#从暂存区，工作区删除<file>
git rm <file>
```
# mv
```bash
# 改名
git mv file_from file_to
```
# branch
- -l
  --list
  - -r 
  ```bash
  #remote-tracking branches
  #列出本地分支跟踪的远程分支
  branch -l -r
  ```
  - -a 
  ```bash
  # all branches
  # 列出所有分支
  branch -l -a
  ```
  
- -u
  
  --set-upstream-to
  ```bash
  git branch -u <remote>/<branch>
  git branch --set-upstream <remote>/<branch-name>
  # 设置当前分支跟踪serverfix
  git branch -u origin/serverfix
  git branch --set-upstream origin/serverfix
  ```
- -vv
  ```bash
  # 列出所有的本地分支，并且包含其与跟踪的远程分支的相关信息，但这时服务器的信息为之前缓存的服务器信息，若要知道最新的，可以git fetch --all更新一下
  git branch -vv
  ```
  
- -d 
  
  ```bash
  # 删除branch
  git branch -d <branch>
  ```
# switch
# fetch
```bash
#从<remote>拉取没有的信息，执行完成后将拥有那个远程仓库中所有分支的引用，可以随时合并或查看
git fetch <remote>
```
# pull
```bash
# 自动抓取当前分支所跟踪的远程分支并合并到当前分支
```
# push
- 推送本地分支到服务器
  ```bash
  git push <remote> <branch>
  git push origin serverfix
  # 当origin存在serverfix分支时会用本地的更新origin的，等价于
  git push origin:serverfix serverfix
  # 如果不想让
  ```
- --delete 
  ```bash
  # 删除<remote>上的<branch>分支
  git push <remote> --delete <branch>
  # 删除origin上的serverfix
  git push origin --delete serverfix
  ```
# checkout
- --track
  ```bash
  # 在本地创建origin/serverfix的跟踪分支
  git checkout -b <localbranch> <remote>/<remote-branch> 
  git checkout -b serverfix origin/serverfix
  # 等价于
  git checkout --track origin/serverfix
  # 可以用其他名字的跟踪分支
  git checkout -b myname origin/serverfix
  ```
- <_file>  
  

  ```bash
  # 将工作区的全部个文件状态同步为HEAD指向的状态
  git checkout .
  # 将工作区的README.md文件状态同步为HEAD指向的状态
  git checkout README.md
  ```
# reset
将当前HEAD重指向
- --hard
  ```bash
  # 回退一个版本，清空暂存区，本地的文件也将被回复后的版本替换，
  git reset --hard HEAD~1
  ```
- --soft
  ```bash
  # 回退一个版本，并将所原来HEAD的提交内容回复到暂存区，并且不改变工作区，暂存区原本的内容
  git reset --soft HEAD~1
  ```
- --reset
  ```bash
  # 回退一个版本，将暂存区的内容和本地已add的内容回复到未暂存的状态
  git reset --mixed HEAD~1
  ```
- <_file>
  ```bash
  # 取消暂存的文件<_file>
  git reset HEAD <_file>
  ```
# revert
将撤销某个提交作为一个提交
# rebase
```bash

# 将当前分支节点的操作移交到<branch>上
git rebase <branch>
# 将<topicbranch>上的修改变基到<basebranchd>上
git rebase <basebranch> <topicbranch>
# 将当前分支节点的操作移交到master分支上
git rebase master
# 将server上的修改变基到master
git rebase master server

```
- --onto
```bash

# 选中在client里但不在server分支里的修改，是他们在master分支上重放
git rebase --onto master server client
```
# remote
```bash
# 列出每一个远程器的简写
git remote
```
- v
  
  显示出需要读写远程仓库使用的git保存的简写与其对应的url

  ```bash
  git remote -v
  ```
- add
  
  ```bash
  #添加远程仓库
  git remote add <shortname> <url>
  git remote add pb https://github.com/paulboone/ticgit
  
  ```
- show
  
  ```bash
  # 显示<remote>的信息
  git remote show <remote>
  ```
- rename
  
  ```bash
  # 改写远程仓库的简写名,与此同时所有远程跟踪的分支名字也会更新
  git remote rename <remote_name> <remote_new_name>
  # 远程仓库简写名pb改为paul
  git remote rename pb paul
  # pb/master->paul/master
  ```
# tag
- 轻量标签
  
  某个提交的引用
  ```bash
  git tag <tag_name> [<commit_id>]
  ```

- 附注标签

  git数据库的一个完整对象，包含打标签者的名字，电子邮件地址，日期时间，此外还有个标签信息，可以使用GNU Privacy Fuard（GPG）签名并验证
  
  ```bash
  git tag -a <tag_name> [<commit_id>] -m <tag_info>
  # 创建轻量标签v1.4，附加信息"my version 1.4"
  git tag -a v1.4 -m "my version 1.4"
  
  ```
- 共享标签
  默认情况下，git push不会传送标签到远程仓库服务器上，需要显式的命令
  ```bash
  #推送特定标签
  git push <remote> <tag_name>
  ```
  ```bash
  # 推送所有不在远程仓库服务器上的标签
  git push <remote> --tags
  ```
- d
  
  ```bash
  #在本地上移除标签（并不会移出远程仓库的标签）
  git tag -d <tag_name>
  #移出远程仓库的标签
  git push <remote>:refs/tags/<tag_name>
  #或
  git push origin --delete <tag_name>
  ```
- 检出标签
  
  ```bash
  # 当前仓库将处于“分离头指针状态”，在此状态下的提交不属于任何分支，只能通过提交哈希才能访问
  git checkout <tag_name>
  ```

