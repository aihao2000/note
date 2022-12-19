客户端访问某个能与客户端开启会话的Servlet程序时，Web应用程序会创建一个与该客户端对应的HttpSession对象







- 发送请求时，第一次没有cookie，直接发送
- 服务器没有cookie头部，于是为用户创建一个sessionid，用作标识这个用户的会话，并且在返回给用户的响应中增加了cookie的头部信息
- 浏览器接收响应检查响应，发现cookie的头部，把cookie保存起来
- cookie还存在是，如果host path都符合，那么在请求的头部增加该符合的cookie信息
- 服务器接收到cookie，得到session的值与先前保存的sessionid做比较，如果一致，服务器视为是同一个会话

