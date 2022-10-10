# AExtLibrary

## 安全检查

- 指针判空

    ```cpp
    #define CHECK_NULLPTR(ptr,returnVal) \
    	if(ptr==nullptr)\
    	{\
    		UE_LOG(LogTemp,Error,TEXT("%s:%s ==nullptr"),ANSI_TO_TCHAR(__FUNCTION__),ANSI_TO_TCHAR(#ptr));\
    		return returnVal;\
    	}\
    
    ```
    
    C++20
    ```cpp
    #define CHECK_NULLPTR(x) if(x==nullptr){UE_LOG(LogTemp,Error,TEXT("%s:%s ==nullptr"),ANSI_TO_TCHAR(std::source_location::current().function_name()));return;}
    ```

