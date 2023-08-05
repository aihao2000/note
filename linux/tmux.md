# tmux

## 查看会话列表

```shell
tmux ls
```

## 创建一个会话

```shell
tmux new -s $session_name
```

## 从会话中脱离

ctrl+a d

## 返回会话

```shell
tmux attach-session 
```

- -t

  指定会话名，若不指定attach到最近一个会话