# UObejct

## 优点

1. **万物可追踪。**有了一个统一基类Object，我们就可以根据一个object类型指针追踪到所有的派生对象。如果愿意，我们都可以把当前的所有对象都遍历出来。按照纯面向对象的思想，万物皆是对象，所以有一个基类Object会大大方便管理。如果再加上一些机制，我们甚至可以把系统中的所有对象的引用图给展示出来。
2. **通用的属性和接口。**得益于继承机制，我们可以在object里加上我们想应用于所有对象的属性和接口，包括但不限于：Equals、Clone、GetHashCode、ToString、GetName、GetMetaData等等。代码只要写一遍，所有的对象就都可以应用上了。
3. **统一的内存分配释放。**实际上Cocos2dx里的CCObject的目的就是如此，可惜就是实现得不够好而已。用引用计数方案的话，你可以在Object上添加Retain+1/Release-1的接口；用GC的方案，你也有了一个统一Object可以引用，所以这也是为何几乎所有支持GC的语言都会设计出来一个Object基类的原因了。
4. **统一的序列化模型。**如果想要让系统里的各种类型对象支持序列化，那么你要嘛针对各种类型分别写一套（如protobuf就是用程序生成了序列化代码），要嘛就得利用模板和宏各种标记识别（我自己Medusa引擎里实现的序列化模块Siren就是如此实现的），而如果有了一个Object基类，最差的我们就可以利用上继承机制把统一的序列化代码放到Object里面去。而如果再加上设计良好的反射机制，实现序列化就更加的方便了。
5. **统计功能。**比如说我们想统计看看整个程序跑下来，哪种对象分配了最多次，哪种对象分配的时间最长，哪种对象存活的时间最长。等等其他很便利的功能，在有了可追踪和统一接口的基础上，我们也能方便的实现出来。
6. **调试的便利。**比如对于一块泄漏了的内存数据，如果是多类型对象，你可能压根没法知道它是哪个对象。但是如果你知道它是Object基类下的一个子类对象，你可以把地址转换为一个Object指针，然后就可以一目了然的查看对象属性了。
7. **为反射提供便利。**如果没有一个统一Object，你就很难为各种对象实现GetType接口，否则你就得在每个子类里都定义实现一遍，用宏也只是稍微缓解治标不治本。
8. **UI编辑的便利。**和编辑器集成的时候，为了让UI的属性面板控件能编辑各种对象。不光需要反射功能的支持，还需要引用一个统一Object指针。否则想象一下如果用一个void* Object，你还得额外添加一个ObjectType枚举用来转换成正确类型的C++对象，而且只能支持特定类型的C++类型对象。

## 代价

1. **臃肿的Object。**这算是继承的祖传老毛病了，我们越想为所有对象提供额外功能，我们就越会在Object里堆积大量的函数接口和成员属性。久而久之，这个Object身上就挂满了各种代码，可理解性就大大降低。Java和C#里的Object比较简单，看起来只有个位数的接口，那是因为有C++在JVM和CLR的背后默默的干着那些脏活累活，没显示出来给你看而已。而UE在原生的的C++基础上开始搭建这么一套系统，就是如今这么一个重量级的UObject了，大几十个接口，很少有人能全部掌握。
2. **不必要的内存负担。**有时候有些属性并不是所有对象都用的到，但是因为不确定，为了所有对象在需要的时候就可以有，你还是不得不放在Object里面。比如说一个最简单的void* UserData，看起来为所有对象附加一个void*数据也挺合理的，用的时候设置取出就好了。但是其实有些类型对象可能一辈子都用不到，用不到的属性，却还占用着内存，就是浪费。所以在一个统一的Object里加数据，就得非常的克制，不然所有的对象都不得不得多一份占用。
3. **多重继承的限制。**比如C多重继承于A和B，以前A和B都不是Object的时候还好，虽然大家对C++里的多重继承不太推荐使用，但是基本上也是不会有大的使用问题的。然后现在A和B都继承于Object了，现在让C想多重继承于A和B，就得面临一个尴尬的局面，变成菱形继承了！而甭管用不用得上全部用虚继承显然也是不靠谱的。所以一般有object基类的编程语言，都是直接限制多重继承，改为多重实现接口，避免了数据被继承多份的问题。
4. **类型系统的割裂。**除非是像java和C#那样，对用户隐藏整个背后系统，否则用户在面对原生C++类型和Object类型时，就不得不去思考划分对象类型。两套系统在交叉引用、互相加载释放、消息通信、内存分配时采用的机制和规则也是大不一样的。哪些对象应该继承于Object，哪些不用；哪些可以GC，哪些只能用智能指针管理；C++对象里new了Object对象该怎么管理，Object对象里new了C++对象什么时候释放？这些都是强加给用户思考的问题。

## 类型系统

object之外的类型信息构建，程序运行空间构建除了家的类型信息树组织。

- 反射：运行时得到类型信息的功能；通过类型信息创建对象，读取修改属性，调用方法的功能行为。

### C# Type

```c#
Type type=obj.GetType();
```



![preview](https://pic1.zhimg.com/v2-0daee3613ed457757b47b8393aec1b8c_r.jpg)

1. Assembly是程序集的意思，通常指的是一个dll。
2. Module是程序集内部的子模块划分。
3. Type就是我们最关心的Class对象了，完整描述了一个对象的类型信息。并且Type之间也可以通过BaseType，DeclaringType之类的属性来互相形成Type关系图。
4. ConstructorInfo描述了Type中的构造函数，可以通过调用它来调用特定的构造函数。
5. EventInfo描述了Type中定义的event事件（UE中的delegate大概）
6. FiedInfo描述了Type中的字段，就是C++的成员变量，得到之后可以动态读取修改值
7. PropertyInfo描述了Type中的属性，类比C++中的get/set方法组合，得到后可以获取设置属性值。
8. MethodInfo描述了Type中的方法。获得方法后就可以动态调用了。
9. ParameterInfo描述了方法中的一个个参数。
10. Attributes指的是Type之上附加的特性，这个C++里并没有，可以简单理解为类上的定义的元数据信息。

### C++

RTTI（Run TIme Type Identification）

- typeid

- dynamic_cast

  基类转派生类

#### 实现反射方案

- 宏

- 模板

  rttr库

  ```cpp
  #include <rttr/registration>
  using namespace rttr;
  struct MyStruct { MyStruct() {}; void func(double) {}; int data; };
  RTTR_REGISTRATION
  {
      registration::class_<MyStruct>("MyStruct")
           .constructor<>()
           .property("data", &MyStruct::data)
           .method("func", &MyStruct::func);
  }
  ```

- 编译器数据分析

   IDiaDataSource COM组件读取pdb文件内容，抽取类型定义的信息实现反射。

- 工具生成代码

  ```cpp
  #include <QObject>
  class MyClass : public QObject
  {
      Q_OBJECT
  　　Q_PROPERTY(int Member1 READ Member1 WRITE setMember1 )
  　　Q_PROPERTY(int Member2 READ Member2 WRITE setMember2 )
  　　Q_PROPERTY(QString MEMBER3 READ Member3 WRITE setMember3 )
  　　public:
  　　    explicit MyClass(QObject *parent = 0);
  　　signals:
  　　public slots:
  　　public:
  　　　 Q_INVOKABLE int Member1();
  　　　 Q_INVOKABLE int Member2();
  　　　 Q_INVOKABLE QString Member3();
  　　　 Q_INVOKABLE void setMember1( int mem1 );
  　　　 Q_INVOKABLE void setMember2( int mem2 );
  　　　 Q_INVOKABLE void setMember3( const QString& mem3 );
  　　　 Q_INVOKABLE int func( QString flag );
  　　private:
  　　　 int m_member1;
  　　　 int m_member2;
  　　　 QString m_member3;
  　};
  ```

  用预定义好的规则生成相应的C++代码来跟源文件对应上。

- UE的HUT方案

  - 


## 类型系统代码生成

项目名为LabByUE，类名为MyObject，继承自UObject测试。

- MyObject.generated.h

- GENERATED_BODY()

  ```cpp
  #define BODY_MACRO_COMBINE_INNER(A,B,C,D) A##B##C##D
  #define BODY_MACRO_COMBINE(A,B,C,D) BODY_MACRO_COMBINE_INNER(A,B,C,D)
  #define GENERATED_BODY(...) BODY_MACRO_COMBINE(CURRENT_FILE_ID,_,__LINE__,_GENERATED_BODY)
  ```

  - CURRENT_FILE_ID

    定义在下方，值为：

    FID\_{ProjectName}\_{FolderName}\_{FileName}

    ```cpp
    #define CURRENT_FILE_ID FID_LabByUE_Source_LabByUE_Template_MyObject_h
    ```

  生成的宏名为FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_GENERATED_BODY

- #define FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_GENERATED_BODY \

  添加了以下代码

  ```cpp
  PRAGMA_DISABLE_DEPRECATION_WARNINGS \
  public: \
  	FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_SPARSE_DATA \
  	FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_RPC_WRAPPERS_NO_PURE_DECLS \
  	FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_INCLASS_NO_PURE_DECLS \
  	FID_LabByUE_Source_LabByUE_Template_MyObject_h_15_ENHANCED_CONSTRUCTORS \
  private: \
  PRAGMA_ENABLE_DEPRECATION_WARNINGS
  ```

  - ~_ENHANCED_CONSTRUCTORS

    定义了

    ```cpp
    	/** Standard constructor, called after all reflected properties have been initialized */ \
    	NO_API UMyObject(const FObjectInitializer& ObjectInitializer = FObjectInitializer::Get()) : Super(ObjectInitializer) { }; \
    private: \
    	/** Private move- and copy-constructors, should never be used */ \
    	NO_API UMyObject(UMyObject&&); \
    	NO_API UMyObject(const UMyObject&); \
    public: \
    	DECLARE_VTABLE_PTR_HELPER_CTOR(NO_API, UMyObject); \
    	DEFINE_VTABLE_PTR_HELPER_CTOR_CALLER(UMyObject); \
    	DEFINE_DEFAULT_OBJECT_INITIALIZER_CONSTRUCTOR_CALL(UMyObject)
    ```

    - DEFINE_DEFAULT_CONSTRUCTOR_CALL(TClass)

      定义了

      ```cpp
      static void __DefaultConstructor(const FObjectInitializer& X) { new((EInternal*)X.GetObj())TClass(X); }
      ```

      声明一个构造函数包装器，根据名字反射创建对象时需要调用该类的构造函数。

      构造函数无法用函数指针指向，因此用static函数包装，在UClass里用函数指针保存构造函数。

      ```cpp
      class COREUOBJECT_API UClass : public UStruct
      ...
      {
          ...
      	typedef void (*ClassConstructorType) (const FObjectInitializer&);
      	ClassConstructorType ClassConstructor;
      	...
      }
      ```

    - DEFINE_VTABLE_PTR_HELPER_CTOR_CALLER(TClass)

      ```cpp
      	static UObject* __VTableCtorCaller(FVTableHelper& Helper) \
      		{ \
      			return new (EC_InternalUseOnlyConstructor, (UObject*)GetTransientPackage(), NAME_None, RF_NeedLoad | RF_ClassDefaultObject | RF_TagGarbageTemp) TClass(Helper); \
      		}
      ```

    - DECLARE_VTABLE_PTR_HELPER_CTOR(API, TClass)

      ```cpp
      API TClass(FVTableHelper& Helper);
      ```

  - ~_INCLASS_NO_PURE_DECLS

    ```cpp
    private: \
    	static void StaticRegisterNativesUMyObject(); \
    	friend struct Z_Construct_UClass_UMyObject_Statics; \
    public: \
    	DECLARE_CLASS(UMyObject, UObject, COMPILED_IN_FLAGS(0), CASTCLASS_None, TEXT("/Script/LabByUE"), NO_API) \
    	DECLARE_SERIALIZER(UMyObject)
    ```

    - DECLARE_CLASS( TClass, TSuperClass, TStaticFlags, TStaticCastFlags, TPackage, TRequiredAPI  )

      TClass：类名 TSuperClass：基类名字

      TStaticFlags：类的属性标记，这里是0，表示最默认，不带任何其他属性。读者可以查看EClassFlags枚举来查看其他定义。

      TStaticCastFlags：指定了该类可以转换为哪些类，这里为0表示不能转为那些默认的类，读者可以自己查看EClassCastFlags声明来查看具体有哪些默认类转换。

      TPackage：类所处于的包名，所有的对象都必须处于一个包中，而每个包都具有一个名字，可以通过该名字来查找。这里是"/Script/Hello"，指定是Script下的Hello，Script可以理解为用户自己的实现，不管是C++还是蓝图，都可以看作是引擎外的一种脚本，当然用这个名字也肯定有UE3时代UnrealScript的影子。Hello就是项目名字，该项目下定义的对象处于该包中。Package的概念涉及到后续Object的组织方式，目前可以简单理解为一个大的Object包含了其他子Object。

      TRequiredAPI：就是用来Dll导入导出的标记，这里是NO_API，因为是最终exe，不需要导出。

      添加了代码

      ```cpp
      private: \
          TClass& operator=(TClass&&);   \
          TClass& operator=(const TClass&);   \
      	TRequiredAPI static UClass* GetPrivateStaticClass(); \
      public: \
      	/** Bitwise union of #EClassFlags pertaining to this class.*/ \
      	enum {StaticClassFlags=TStaticFlags}; \
      	/** Typedef for the base class ({{ typedef-type }}) */ \
      	typedef TSuperClass Super;\
      	/** Typedef for {{ typedef-type }}. */ \
      	typedef TClass ThisClass;\
      	/** Returns a UClass object representing this class at runtime */ \
      	inline static UClass* StaticClass() \
      	{ \
      		return GetPrivateStaticClass(); \
      	} \
      	/** Returns the package this class belongs in */ \
      	inline static const TCHAR* StaticPackage() \
      	{ \
      		return TPackage; \
      	} \
      	/** Returns the static cast flags for this class */ \
      	inline static EClassCastFlags StaticClassCastFlags() \
      	{ \
      		return TStaticCastFlags; \
      	} \
      	/** For internal use only; use StaticConstructObject() to create new objects. */ \
      	inline void* operator new(const size_t InSize, EInternal InInternalOnly, UObject* InOuter = (UObject*)GetTransientPackage(), FName InName = NAME_None, EObjectFlags InSetFlags = RF_NoFlags) \
      	{ \
      		return StaticAllocateObject(StaticClass(), InOuter, InName, InSetFlags); \
      	} \
      	/** For internal use only; use StaticConstructObject() to create new objects. */ \
      	inline void* operator new( const size_t InSize, EInternal* InMem ) \
      	{ \
      		return (void*)InMem; \
      	} \
      	/* Eliminate V1062 warning from PVS-Studio while keeping MSVC and Clang happy. */ \
      	inline void operator delete(void* InMem) \
      	{ \
      		::operator delete(InMem); \
      	}
      ```

      