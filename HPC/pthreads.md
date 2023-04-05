# pthread

```shell
gcc -g -Wall code.c –lpthread
```



## 线程管理

### 创建

```c
int pthread_create (
pthread_t* thread_p /* out */,
const pthread_attr_t* attr_p /* 创建现成的属性，如果NULL则为默认属性 */,
void* (*start_routine)(void) /* 新线程执行的函数 */,
void* arg_p /* 执行函数的参数 */) ;
```

## 同步

### 互斥量与锁

```c
int pthread_mutex_init(
pthread_mutex_t∗ mutex_p ,
const pthread_mutexattr_t∗ attr_p);
int pthread_mutex_lock(
    pthread_mutex_t∗ mutex_p );
int pthread_mutex_unlock(pthread_mutex_t∗ mutex_p );
int pthread_mutex_destroy(pthread_mutex_t∗ mutex_p);
```

### 信号量

```c
int sem_init(
sem_t∗ semaphore_p,
int shared,
unsigned initial_val);

int sem_destroy(sem_t∗ semaphore_p);
int sem_post(sem_t∗ semaphore_p);
int sem_wait(sem_t∗ semaphore_p);
```

