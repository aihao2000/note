## 静态链接库和动态链接库的区别

- 静态链接库：

  链接时完整地拷贝至可执行文件中，被多次使用就会有多份冗余拷贝

- 动态链接库

  连接时不复制，程序运行时由操作系统加载到内存供程序调用

```cpp
BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
                     )
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
```

- HMODULE hModule
  
  指向自身的句柄

- DWORD  ul_reason_for_call
  
  指明了系统调用DLL的原因
  
  - DLL_PROCESS_ATTCH
    
    进程映射：将DLL文件映射到进程的地址空间
  
  - ALL_PROCESS_DETACH
    
    进程卸载：DLL被从进程的地址空间接触映射
    
    - FreeLibrary解除DLL映射
    - 进程结束解除DLL映射
  
  - DLL_THREAD_ATTACH
    
    线程映射
  
  - DLL_THREAD_DETACH
    
    线程卸载

- LPVOID lpReserved
  
  隐式加载/显示加载