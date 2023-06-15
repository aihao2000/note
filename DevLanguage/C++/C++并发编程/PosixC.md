### C语言POSIX semaphore

```cpp
#include<semaphore.h>
sem_t sem;//信号量声明
```

- sem_init

  第一个参数为初始化的信号量名

  第二个参数为0时，该信号量被该进程内的所有线程所共享，如果非0则被所有进程共享

  第三个参数为初始化信号量值的大小

- sem_post

  信号量+1

- sem_wait(）

  信号量-1

  当信号量等于0时，线程阻塞

