# 基本命令
- redis-cli
  
  连接本地服务
  ```bash
  # 连接到主机为<host>，端口为<prot>，密码为password的服务上
  redis-cli -h <host> -p <port> -a <password>
  ```
# 数据类型
- key
     - DEL
       ```bash
       # 存在<key>时删除key
       DEL <key>
       ```
     - DUMP
       ```bash
       # 序列化给定<key>
       DUMP <key>
       ``` 
     - EXISTS
       ```bash
       EXISTS <key>
       ```
     - EXPIRE
       ```bash
       # 为给定key设置过期时间，以秒计
       EXPIRE <key> <seconds>
       ``` 
    - EXPIREAT
       ```

       ```  
- String
- Hash
- List
   - lpush 
- Set
  
  无序，哈希表实现

- zset
  
  有序，不允许重复