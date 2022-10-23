# AH_ExtLibrary

## 安全检查

- 指针判空

    ```cpp
    #define AH_CHECK_NULLPTR(ptr,returnVal) \
    	if(ptr==nullptr)\
    	{\
    		UE_LOG(LogTemp,Error,TEXT("%s:%s ==nullptr"),ANSI_TO_TCHAR(__FUNCTION__),ANSI_TO_TCHAR(#ptr));\
    		return returnVal;\
    	}
    
    ```
    
    C++20
    ```cpp
    #define CHECK_NULLPTR(x) if(x==nullptr){UE_LOG(LogTemp,Error,TEXT("%s:%s ==nullptr"),ANSI_TO_TCHAR(std::source_location::current().function_name()));return;}
    ```

- 函数调用打印

  ```cpp
  #define AH_PRINT_FUNCTION_CALLED()\
  	if(GEngine)\
  	{\
  		GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Red, FString::Printf(TEXT("%s is called"), ANSI_TO_TCHAR(__FUNCTION__)));\
  	}
  ```

  
