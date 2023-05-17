# C版算法

## 排序

### qsort

```C
void qsort(
    void *base,
    size_t n,
    size_t size,
    int (*compar)(const void *, const void *)
    );
```

```C
int compar(const void *p1, const void *p2);
```

如果compar返回值小于0（< 0），那么p1所指向元素会被排在p2所指向元素的前面 如果compar返回值等于0（= 0），那么p1所指向元素与p2所指向元素的顺序不确定 如果compar返回值大于0（> 0），那么p1所指向元素会被排在p2所指向元素的后面

### 归并排序

```cpp
#define maxn 100007
#define type int
type buffer[maxn];
int greater(type* x, type* y)
{
	return *x <= *y;
}
void merge_sort(type* src, int l, int r)
{
	if (l >= r)return;
	int mid = (l + r) / 2;
	merge_sort(src, l, mid);
	merge_sort(src, mid+1, r);
	int i = l, j = mid + 1, p = l;
	while (i <= mid && j <= r)
	{
		if (greater(&src[i], &src[j]))
		{
			buffer[p++] = src[i++];
		}
		else
		{
			buffer[p++] = src[j++];
		}
	}
	while (i <= mid)
	{
		buffer[p++] = src[i++];
	}
	while (j <= r)
	{
		buffer[p++] = src[j++];
	}
	for (i = l; i <= r; i++)
	{
		src[i] = buffer[i];
	}
}
```

## bsearch

```c
void *bsearch(const void *key,
              const void *base, 
              size_t nitems, 
              size_t size, 
              int (*compar)(const void *, const void *))
```

## __int128读写

170141183460469231731687303715884105727

−170141183460469231731687303715884105728

39位数

```c
char rd(__int128* x)
{
    *x = 0;
    char c = getchar();
    int sgn = 1;
    while (!isdigit(c))
    {
        if (c == '-')sgn = -1;
        if (c == EOF)return c;
        c = getchar();
    }
    while (isdigit(c))
    {
        (* x) *= 10;
        (*x) += c - '0';
        c = getchar();
    }
    (*x) *= sgn;
    return c;
}
void print(__int128 x)
{
    if (x == 0)return;
    print(x / 10);
    putchar(x % 10 + '0');
}
```



## 字符串

- strcpy

  ```c
  char *strcpy(char *dest, const char *src)
  ```

  要求src以'\0'结尾

- srcncpy

  ```c
  char *strncpy(char *dest, const char *src, size_t n)
  ```

  不要求src以'\0'结尾，复制n个字节，但不会自动加'\0'

- strcat

  ```c
  char *strcat(char *dest, const char *src)
  ```

- strtok

  ```c
  char *strtok(char *str, const char *delim);
  for(char *i=strtok(src," ");i!=NULL;i=strtok(NULL,s))
  {
      
  }
  ```

- strstr

  ```cpp
  char *strstr(const char *x, const char *y)
  ```

  在x中找y,未找到返回NULL

- strspn

  ```c
  size_t strspn(const char *str1, const char *str2)
  ```

  返回str1中第一个str2中未拥有的字符下标

- strcspn

  ```c
  size_t strcspn(const char *str1, const char *str2)
  ```

  返回str1开头连续都不含str2中字符的字符数

- strpbrk

  ```c
  char *strpbrk(const char *str1, const char *str2)
  ```

  检索src1中第一个src2拥有的字符

- strrchr

  ```c
  char *strrchr(const char *str, int c)
  ```

  在参数str所指向字符串中搜索最后一次出现字符c的地址，若无返回NULL

- memmove

  ```c
  void *memmove(void *str1, const void *str2, size_t n)
  ```

  允许有重叠

- memcpy

  ```c
  void *memcpy(void *str1, const void *str2, size_t n)
  ```

  

- memchr

  在参数 **str** 所指向的字符串的前 **n** 个字节中搜索第一次出现字符 **c**（一个无符号字符）的位置。

  ```c
  void *memchr(const void *str, int c, size_t n)
  ```

  

## 数论

### 快速幂

```c++
long long fastpowmod(long long a,long long b,long long p)
{
    long long res=1;
    while(b)
    {
        if(b&1)res=(a*res)%p;
        a=(a*a)%p;
        b=b>>1;
    }
    return res;
}
```

### gcd

```C++
long long gcd(long long a,long long b)
{
    return b?gcd(b,a%b):a;
}
```

### 逆元

```c++
inv[1]=1;
for(int i=2;i<=n;i++){
        inv[i]=(ll)(p-p/i)*inv[p%i]%p;
    }//inv[i]为i模p的逆元
```

### 除法取模

```c++
long long divmod(long long a,long long b,long long p)//(a/b)%p
{
    return a*fastpowmod(b,p-2,p)%p;
}
```

### 素数

#### 线性筛

```C++
bool check[100005];
int prime[100005];     //储存第i个素数
void getprime(int n)
{
    memset(check, 0, sizeof(check));  // 标记数组初始化，初始均为 0
    int tot = 0;  // tot 初始为 0，用来记录质数总个数
    for (int i = 2; i <= n; ++i) {  // 从 2 开始枚举
        if (!check[i]) {  // 如果 i 没有被划去，则 i 为质数，加入质数表中
            prime[++tot] = i;
        }
        for (int j = 1; j <= tot; ++j) {  // 划去 i 与所有已筛出的质数的乘积
            if (i * prime[j] > n) {  // 判断合数是否在区间内
                break;
            }
            check[i * prime[j]] = 1;  // 划去在区间内的合数
            if (i % prime[j] == 0) {  // 保证合数只被其最小的质因子划去，提高筛选效率
                break;
            }
        }
    }
}
```

#### 素数前缀和

```c++
namespace sumprime {
    int prime[N], id1[N], id2[N], flag[N], ncnt, m;
    ll g[N], sum[N], a[N], T;
    ll n;

    int ID(ll x) {
        return x <= T ? id1[x] : id2[n / x];
    }

    ll calc(ll x) {
        return x * (x + 1) / 2 - 1;
    }

    ll f(ll x) {
        return x;
    }

    ll init(ll n) {
        T = sqrt(n + 0.5);
        for (int i = 2; i <= T; i++) {
            if (!flag[i]) prime[++ncnt] = i, sum[ncnt] = sum[ncnt - 1] + i;
            for (int j = 1; j <= ncnt && i * prime[j] <= T; j++) {
                flag[i * prime[j]] = 1;
                if (i % prime[j] == 0) break;
            }
        }
        for (ll l = 1; l <= n; l = n / (n / l) + 1) {
            a[++m] = n / l;
            if (a[m] <= T) id1[a[m]] = m; else id2[n / a[m]] = m;
            g[m] = calc(a[m]);
        }
        for (int i = 1; i <= ncnt; i++)
            for (int j = 1; j <= m && (ll) prime[i] * prime[i] <= a[j]; j++)
                g[j] = g[j] - (ll) prime[i] * (g[ID(a[j] / prime[i])] - sum[i - 1]);
    }
    ll solve(ll x) {//求<=x的的素数和
        memset(g,0,sizeof(g));
        memset(a,0,sizeof(a));
        memset(sum,0,sizeof(sum));
        memset(prime,0,sizeof(prime));
        memset(id1,0,sizeof(id1));
        memset(id2,0,sizeof(id2));
        memset(flag,0,sizeof(flag));
        ncnt=m=0;
        if (x <= 1) { return x; }
        return n = x, init(n), g[ID(n)];
    }
}
```

### 约数个数以及约数和

如果$N = p1^{c1} * p2^{c2} * ... *pk^{ck}$

约数个数：$ (c1 + 1) * (c2 + 1) * ... * (ck + 1)$
约数之和：$ (p1^0 + p1^1 + ... + p1^{c1}) * ... * (pk^0 + pk^1 + ... + pk^{ck})$

## 二项式定理

$$
(a+b)^n=\sum_{i=0}^nC_n^i*a^i*b^{n-i}
$$

## 计数

### 排列组合

#### 组合数递推

```c++
int C[maxn][maxn];
void iniC(int n)
{
    memset(C,0,sizeof(C));
    C[0][0]=1;
    for(int i=1;i<=n;i++)C[i][0]=1;
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=i;j++)
        {
            C[i][j]=C[i-1][j-1]+C[i-1][j];
        }
    }
}
```

#### 卢卡斯定理（组合数取模）

```C++
long long n,m,p,cnt/*个数*/,pr[1010]/*质数*/,al[1010]/*指数*/;
void exgcd(long long a,long long b,long long &x,long long &y)//扩展欧几里得算法
{
    if (!b) return (void)(x=1,y=0);
    exgcd(b,a%b,x,y);
    long long tmp=x;x=y;y=tmp-a/b*y;
}
long long ny(long long a,long long p)//逆元
{
    long long x,y;
    exgcd(a,p,x,y);
    return (x+p)%p;
}
long long POW(long long a,long long b,long long p)//快速幂
{
    long long t=1;
	a%=p;
    for(;b;b>>=1){
        if(b&1) t=t*a%p;
        a=a*a%p;
    }
    return t;
}
long long fac(long long n,long long p,long long ppa)//计算n!
{
    if (n==0) return 1;
    long long cir=1/*循环节*/,rem=1/*余数*/;
    for (long long i=1;i<=ppa;i++) if(i%p) cir=cir*i%ppa;
    cir=POW(cir,n/ppa,ppa);
    for(long long i=ppa*(n/ppa);i<=n;i++) if(i%p) rem=rem*(i%ppa)%ppa;
    return fac(n/p,p,ppa)*cir%ppa*rem%ppa;
}
long long sum_fac(long long n,long long p)//n!中p的个数
{
    return n<p?0:sum_fac(n/p,p)+(n/p);
}
long long C(long long n,long long m,long long p,long long ppa)//计算Cnm%pi^ai
{
    long long fz=fac(n,p,ppa),fm1=ny(fac(m,p,ppa),ppa),fm2=ny(fac(n-m,p,ppa),ppa);
    long long mi=POW(p,sum_fac(n,p)-sum_fac(m,p)-sum_fac(n-m,p),ppa);
    return fz*fm1%ppa*fm2%ppa*mi%ppa;
}
void pfd(long long n,long long m)//分解p
{
    long long P=p;
    for(long long i=2;i*i<=p;i++){
        if(!(P%i)){
            long long ppa=1;
            while(!(P%i)) ppa*=i,P/=i;
            pr[++cnt]=ppa;
			al[cnt]=C(n,m,i,ppa);
        }
    }
    if(P!=1) pr[++cnt]=P,al[cnt]=C(n,m,P,P);
}
long long crt()//中国剩余定理
{
    long long ans=0;
    for(long long i=1;i<=cnt;i++){
        long long M=p/pr[i],T=ny(M,pr[i]);
        ans=(ans+al[i]*M%p*T%p)%p;
    }
    return ans;
}
long long exlucas(long long n,long long m)//扩展卢卡斯 
{
	  pfd(n,m);
    return crt();
}
```

#### 卡特兰数

n对括号合法情况，n个数的出栈序列，n个点构成的不同二叉树数

$dp[i]=dp[i-1]*dp[n-i]$

$dp[i]=\frac{2*(2n-1)}{(n+1)}*dp[i-1]$

### 球盒模型

#### 球相同，盒不同，不允许有空盒

$$
C_{n-1}^{m-1}
$$

插板法，n-1个空插m-1个板子分成m份

#### 球相同，盒不同，允许有空盒

$$
C_{n+m-1}^{m-1}
$$

先给每个盒子放一个球，再插板，这个球其实是不存在的，再将其抽出，恰好弥补了空盒的情况

#### 球不同，盒相同，不允许有空盒（斯特林数）

$$
dp[n][m]=dp[n-1][m-1]+dp[n-1]*m
$$

对n个球依次放，并对每一个单独讨论
设为$dp[i][j]$是i个不同的球放入j个相同的盒子的种数
对于第i个球，有两种放法
-第i个球单独占一个盒子，方案书就是$dp[i-1][j-1]$
-第i个球和其他球在一起，方案数就是$j*dp[i-1][j]$

#### 球不同，盒相同，允许有空盒

和上一种情况差不多$dp[n][m-1]$就相当于空一个盒子的方案数了，所以求和即可
$\sum_{i=1}^mdp[n][i]$

#### 球不同，盒不同，不允许有空盒

$dp[n][m]=(dp[n-1][m-1]+dp[n-1][m]*m)*fact(m))$
fact是m的阶乘，对应球不同盒相同的情况，因为盒子不同了，所以有了
放法：$fact(m)$，相当于盒子的全排列

####  球不同，盒不同，允许有空盒

$m^n$
每个球m种方法

####  球相同，盒相同，不允许有空盒

- 当n小于m时，很明显无法满足无空盒的情况，方案数是0
- 当n大于等于m时
  - 如果第n个球单独占一个盒子，方案数时$dp[n-1][m-1]$
  - 如果第n个球不单独占一个盒子，方案数是$dp[n-m][m]$，相当于先给所有的盒子放一个球的方案

$$dp[n][m]=
\begin{cases}
dp[n-1][m-1]+dp[n-m][m] & \text{n>=m}\\
0 &\text{n<m}
\end{cases}$$

初始条件：$dp[k][k]=1$

 ####  球不同，盒相同，允许有空盒

 -当n小于m时，有一个盒子必然是空的，盒子相同空哪个都是一样的，所以方案数是$dp[n][m-1]$
 -当n大于等于m时，可以分为两种情况

 -  $dp[n][m-1]$，第m个盒子是空的情况
 -  $dp[n-m][m]$,第m个盒子不空的情况

$$dp[n][m]=
\begin{cases}
dp[n][m-1]+dp[n-m][m] & \text{n>=m}\\
dp[n][m-1] &\text{n<m}
\end{cases}$$
初始条件：$dp[k][1]=1,dp[1][k]=1,dp[0][k]=1$

# 数据结构

## cmap

```c
#pragma once
#include <stdlib.h>
#define type int
typedef struct node node;
struct node
{
	type key, val;
	node* l, * r;
};
int key_greater(type x, type y)
{
	return x > y;
}
int key_equal(type x, type y)
{
	return x == y;
}
void cmap_assign(node** p, type key, type val)
{
	while ((*p) != NULL)
	{
		if (key_equal(key, (*p)->key))
		{
			(*p)->val = val;
			return;
		}
		if (key_greater(key, (*p)->key))
		{
			p = &(*p)->r;
		}
		else
		{
			p = &(*p)->l;
		}
	}
	(*p) = (node*)malloc(sizeof(node));
	(*p)->key = key;
	(*p)->val = val;
	(*p)->l = NULL;
	(*p)->r = NULL;
}
node* cmap_get(node* p, type key)
{
	while (p != NULL && p->key != key)
	{
		if (key_greater(key, p->key))
		{
			p = p->r;
		}
		else
		{
			p = p->l;
		}
	}
	return p;
}
void cset_free(node* p)
{
	if (p != NULL)
	{
		cset_free(p->l);
		cset_free(p->r);
		free(p);
	}
}
```

## cqueue

```c
#pragma once
#include<stdlib.h>
#include<stdio.h>
#define type int
struct cqueue
{
	type* data;
	int front, back;
	int size;
	int maxsize;
};
typedef struct cqueue cqueue;
void cqueue_init(cqueue* src, int n)
{
	src->maxsize = n;
	src->data = (type*)malloc(sizeof(type) * n);
	src->front = 0;
	src->back = 0;
	src->size = 0;
}
int cqueue_empty(cqueue* src)
{
	return src->size == 0;
}
int cqueue_full(cqueue* src)
{
	return src->size == src->maxsize;
}
void cqueue_push_back(cqueue* src,type x)
{
	if (cqueue_full(src))
	{
		while (1)
		{
			printf("push error\n");
		}
	}
	if (cqueue_empty(src))
	{
		src->data[src->back] = x;
		src->front = src->back;
	}
	else
	{
		src->back = (src->back + 1) % src->maxsize;
		src->data[src->back] = x;
	}
	src->size++;
}
void cqueue_push_front(cqueue* src, type x)
{
	if (cqueue_full(src))
	{
		while (1)
		{
			printf("push error\n");
		}
	}
	if (cqueue_empty(src))
	{
		src->data[src->front] = x;
		src->back = src->front;
	}
	else
	{
		src->front = ((src->front - 1) + src->maxsize) % src->maxsize;
		src->data[src->front] = x;
	}
	src->size++;
}
void cqueue_pop_front(cqueue* src)
{
	if (cqueue_empty(src))
	{
		while (1)
		{
			printf("pop error\n");
		}
	}
	src->size--;
	src->front = (src->front + 1) % src->maxsize;
}
void cqueue_pop_back(cqueue* src)
{
	if (cqueue_empty(src))
	{
		while (1)
		{
			printf("pop error\n");
		}
	}
	src->size--;
	src->back = (src->back - 1 + src->maxsize) % src->maxsize;
}
type cqueue_front(cqueue* src)
{
	if (cqueue_empty(src))
	{
		while (1)
		{
			printf("front error\n");
		}
	}
	return src->data[src->front];
}
type cqueue_back(cqueue* src)
{
	if (cqueue_empty(src))
	{
		while (1)
		{
			printf("back error\n");
		}
	}
	return src->data[src->back];
}
```

## cgraph

```cpp
#pragma once
#include<stdlib.h>
#include<string.h>
#define type cedge
#define maxn 100007
#define maxm 1000007
struct cedge
{
	int v;
};
struct cgraph
{
	int *h, *next;
	type *edge;
	int esize;
};
void cgraph_init(cgraph *src,int n,int m)
{
	src->h = (int*)malloc(sizeof(int) * n);
	src->next = (int*)malloc(sizeof(int) * m);
	src->edge = (type*)malloc(sizeof(type) * m);
	memset(src->h, 0, sizeof(int) * n);
	memset(src->next, 0, sizeof(int) * m);
	src->esize = 0;
}
void cgraph_add(cgraph* src,int u,type v)
{
	src->esize++;
	src->edge[src->esize] = v;
	src->next[src->esize] = src->h[u];
}
```

## cpriority_queue

```c
#define type int
#define ls(x) (x<<1)
#define rs(x) (x<<1|1)
#define f(x) (x>>1)
struct cpriority_queue
{
	type* data;
	int size, maxsize;
};
typedef struct cpriority_queue cpriority_queue;
int cpriority_queue_greater(type* a, type* b)
{
	return a < b;
}
int cpriority_queue_empty(cpriority_queue* src)
{
	return !src->size;
}
void cpriority_queue_init(cpriority_queue* p, int n)
{
	p->size = 0;
	p->data = (type*)malloc(sizeof(type) * (n + 1));
	p->maxsize = n;
}
static void swap(type* a, type* b)
{
	type tmp = *a;
	*a = *b;
	*b = tmp;
}
void cpriority_queue_push(cpriority_queue* p, type x)
{
	p->data[++(p->size)] = x;
	for (int i = p->size; f(i);)
	{
		if (cpriority_queue_greater(&(p->data[i]), &(p->data[f(i)])))
		{
			swap(&(p->data[i]), &(p->data[f(i)]));
			i = f(i);
		}
		else
		{
			break;
		}
	}
}
void cpriority_queue_pop(cpriority_queue* src)
{
	src->data[1] = src->data[src->size];
	src->size--;
	for (int i = 1; ls(i) <= src->size;)
	{
		int next = ls(i);
		if (rs(i) <= src->size)
		{
			if (cpriority_queue_greater(&(src->data[rs(i)]), &(src->data[ls(i)])))
			{
				next = rs(i);
			}
		}
		if (cpriority_queue_greater(&(src->data[i]), &(src->data[next])))
		{
			break;
		}
		swap(&(src->data[i]), &(src->data[next]));
		i = next;
	}
}
type cpriority_queue_top(cpriority_queue* src)
{
	type res;
	memcpy(&res, &src->data[1], sizeof(type));
	return res;
}
```

## bigint

```c
#define maxn 100007
typedef struct bigint bigint;
struct bigint
{
    char data[maxn];
    int size;
    int sgn;
};
void bigint_reverse(bigint* p)
{
    for (int i = 0, j = p->size - 1; i < j; i++, j--)
    {
        char tmp = p->data[i];
        p->data[i] = p->data[j];
        p->data[j] = tmp;
    }
}
void bigint_push(bigint* src, char x)
{
    src->data[src->size++] = x;
}
void bigint_pop(bigint* src)
{
    src->data[src->size--] = '\0';
}
void bigint_ini(bigint* src)
{
    memset(src->data, '\0', sizeof(src->data));
    src->size = 0;
}
void bigint_input(bigint* src)
{
    memset(src->data, '\0', sizeof(src->data));
    scanf("%s", src->data);
    src->size = strlen(src->data);
    if (src->data[0] == '-')
    {
        src->sgn = -1;
        bigint_reverse(src);
        bigint_pop(src);
        bigint_reverse(src);
    }
    else
    {
        src->sgn = 1;
    }
}



bigint mul(bigint a, bigint b)
{
    bigint_reverse(a.data);
    bigint_reverse(b.data);
    for (int i = 0; i < a.size; i++)
    {
        a.data[i] -= '0';
    }
    for (int i = 0; i < b.size; i++)
    {
        b.data[i] -= '0';
    }
    bigint res;
    bigint_ini(&res);
    res.sgn = a.sgn * b.sgn;
    for (int i = 0; i < a.size; i++)
    {
        for (int j = 0; j < b.size; j++)
        {
            if (i + j >= res.size)
            {
                bigint_push(&res, 0);
            }
            res.data[i + j] += a.data[i] * b.data[j];
        }
    }
    for (int i = 0; i < res.size; i++)
    {
        if ((unsigned char)res.data[i] >= 10)
        {
            if (i + 1 >= res.size)bigint_push(&res, 0);
            res.data[i + 1] = (unsigned char)res.data[i+1]+(unsigned char)res.data[i] / 10;
            res.data[i] = (unsigned char)res.data[i]%10;
        }
    }
    for (int i = 0; i < res.size; i++)
    {
        res.data[i] = (unsigned char)res.data[i] + '0';
    }
    if (res.sgn == -1)bigint_push(&res, '-');
    bigint_reverse(res.data);
    return res;
}
```



## 树状数组

```c
#define maxn 500007
#define lowbit(x) (x&-x) 
int n;
int data[maxn];
void add(int x, long long y)
{
	for (int i = x; i <= n; i += lowbit(i))
	{
		data[i] += y;
	}	
}
long long sum(int x)
{
	long long ans = 0;
	for (int i = x; i > 0; i -= lowbit(i))
	{
		ans += data[i];
	}
	return ans;
}
```



## 矩阵

```c++
const int mod=1e9+7;
struct matrix
{
    int r,c;
    vector<vector<ll> >x;
    void ini(int _r,int _c)
    {
        r=_r;c=_c;
        x.resize(r+1);
        for(int i=0;i<=r;i++)
        {
            x[i].resize(c+1,0);
        }
    }
    void iniE(int k)
    {
        r=k;c=k;
        x.resize(k+1);
        for(int i=0;i<=k;i++)
        {
            x[i].resize(k+1,0);
            x[i][i]=1;
        }
    }
    void output()
    {
        for(int i=1;i<=r;i++)
        {
            for(int j=1;j<=c;j++)
            {
                cout<<x[i][j]<<' ';
            }
            cout<<'\n';
        }
    }
};
inline matrix mul(matrix &a,matrix &b)
{
    matrix res;
    res.ini(a.r,b.c);
    for(int i=1;i<=a.r;i++)
    {
        for(int j=1;j<=b.c;j++)
        {
            for(int k=1;k<=a.c;k++)
            {
                res.x[i][j]=(res.x[i][j]+a.x[i][k]*b.x[k][j])%mod;
            }
        }
    }
    return res;
}

matrix fastpow(matrix a,int b)
{
    matrix res;
    res.iniE(a.r);
    while(b)
    {
        if(b&1)
        {
            res=mul(res,a);
        }
        b=b>>1;
        a=mul(a,a);
    }
    return res;
}
```



## 并查集

```c++
#define maxn 10007
#define maxm 200007
struct unionset
{
	int f[maxn], cnt[maxn], size;
};
typedef struct unionset unionset;
void unionset_init(unionset* src, int n)
{
	src->size = n;
	for (int i = 1; i <= n; i++)
	{
		src->f[i] = i;
		src->cnt[i] = 1;
	}
}
int unionset_find(unionset* src, int x)
{
	if (x == src->f[x])
	{
		return x;
	}
	else
	{
		return src->f[x] = unionset_find(src, src->f[x]);
	}
}
int unionset_query(unionset* src, int x, int y)
{
	return unionset_find(src, x) == unionset_find(src, y);
}
void unionset_merge(unionset* src, int x, int y)
{
	if (unionset_query(src, x, y))return;
	src->size--;
	src->cnt[unionset_find(src, x)] += src->cnt[unionset_find(src, y)];
	src->f[unionset_find(src, y)] = unionset_find(src, x);
}
```

## 线段树

```c++
template<typename T>
    struct segment_tree
    {
        int n;
        vector<T> v;
        segment_tree(int _n):n(_n)
        {
            v.resize(n<<2);
        }
        inline int ls(int x){
            return x<<1;
        }
        inline int rs(int x)
        {
            return x<<1|1;
        }
        void insert(int x,int l,int r,int L,int R,T val)
        {
            if(l==r)
            {
                v[x]=v[x]+v;
                return ;
            }
            if(l>=L&&r<=R)
            {
                v[x]=v[x]+v;
            }
            int mid=(l+r)/2;
            if(L<=mid)insert(ls(x),l,mid,L,R,v);
            if(R>mid)insert(rs(x),mid+1,r,L,R,v);
        }
    }
```



## 可持久化线段树

```c++
const int maxn=1000005;
int n,m;
int a[maxn];//数据原数组
int val[maxn*40], cnt=0; //sum记录原数组区间[1,k]的改编号对应区间值的数量
int ls[maxn*40], rs[maxn*40]; //ls左二子，rs右儿子
int root[maxn];                   //第i棵线段树的根编号
int build(int l, int r)
{
    int now = ++cnt;
    if (l == r)
    {
        val[now]=a[l];
        return now;
    }
    int mid = (l + r) >> 1;
    ls[now] = build(l, mid);
    rs[now] = build(mid + 1, r);
    return now;
}
//将位置y修改为k
int modify(int x,int l, int r, int y, int k)
{
    int now = ++cnt;
    if (l == r)
    {
        val[now] = k;
        return now;
    }
    int mid = (l + r) >> 1;
    if (y <= mid)
    {
        ls[now] = modify(ls[x],l,mid,y,k);
        rs[now] = rs[x];
    }
    else
    {
        ls[now] = ls[x];
        rs[now] = modify(rs[x],mid+1,r,y,k);
    }
    return now;
}
int query(int x,int l, int r, int y)//询问x线段树y位置的值
{
    if (l == r)
        return val[x];
    int mid = (l + r) >> 1;
    if (y <= mid)
        return query(ls[x],l, mid, y);
    return query(rs[x],mid + 1, r, y);
}
```

## 图论

### 链式前向星

```c++
#define maxn 100007
#define maxm 1000007
typedef struct cgraph cgraph;
typedef struct cedge cedge;
struct cedge
{
    int v;
};
struct cgraph
{
    int h[maxn], next[maxm], id[maxn], val[maxn];
    cedge edge[maxm];
    int esize;
};
void cgraph_init(cgraph* src)
{
    memset(src->val, 0, sizeof(src->val));
    memset(src->h, 0, sizeof(src->h));
    memset(src->next, 0, sizeof(src->next));
    memset(src->id, 0, sizeof(src->id));
    src->esize = 0;
}
void cgraph_add(cgraph* src, int u, int v)
{
    src->esize++;
    src->id[v]++;
    src->edge[src->esize].v = v;
    src->next[src->esize] = src->h[u];
    src->h[u] = src->esize;
}
```

### tarjan

```c++
cgraph g1, g2;
int dfn[maxn], low[maxn], num = 0, scc[maxn], sccn = 0, sk[maxn], sksize = 0;
void shrink_init()
{
    memset(dfn, 0, sizeof(dfn));
}
void tarjan(int u)
{
    dfn[u] = low[u] = ++num;
    sk[sksize++] = u;
    for (int i = g1.h[u]; i; i = g1.next[i])
    {
        int v = g1.edge[i].v;
        if (!dfn[v])
        {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        }
        else if (!scc[v])
        {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (dfn[u] == low[u])
    {
        sccn++;
        while (1)
        {
            int v = sk[--sksize];
            scc[v] = sccn;
            if (v == u)break;
        }
    }
}
void shrink(int n)
{
    for (int i = 1; i <= n; i++)
    {
        int u = i;
		g2.val[scc[u]] += g1.val[u];
        for (int j = g1.h[i]; j; j = g1.next[j])
        {
            int v = g1.edge[j].v;
            if (scc[u] == scc[v])continue;
            cgraph_add(&g2, scc[u], scc[v]);
        }
    }
}
```

### spfa

```c
cqueue q;
int inq[maxn], dis[maxn];
void spfa(cgraph* src,int n,int s)
{
	cqueue_init(&q);
	memset(inq, 0, sizeof(inq));
	for (int i = 1; i <= n; i++)
	{
		dis[i] = INT_MAX;
	}
	cqueue_push(&q, s);
	inq[s] = 1;
	dis[s] = 0;
	while (!cqueue_empty(&q))
	{
		int u = cqueue_front(&q);
		cqueue_pop(&q);
		inq[u] = 0;
		for (int i = src->h[u]; i; i = src->next[i])
		{
			int v = src->edge[i].v, len = src->edge[i].len;
			if (dis[u] + len < dis[v])
			{
				dis[v] = dis[u] + len;
				if (!inq[v])
				{
					inq[v] = 1;
					cqueue_push(&q, v);
				}
			}
		}
	}
}
```

### dijkstra

```C
cpriority_queue q;
int dis[maxn];
void dijkstra(cgraph* src,int n,int s)
{
	cpriority_queue_init(&q,maxm);
	for (int i = 1; i <= n; i++)
	{
		dis[i] = INT_MAX;
	}
	cedge x;
	x.v = s;
	x.len = 0;
	dis[s] = 0;
	cpriority_queue_push(&q, x);
	while (!cpriority_queue_empty(&q))
	{
		x = cpriority_queue_top(&q); 
		cpriority_queue_pop(&q);
		if (x.len > dis[x.v])continue;
		int u = x.v;
		for (int i = src->h[u]; i; i = src->next[i])
		{
			int v = src->edge[i].v;
			int len = src->edge[i].len;
			if (dis[u] + len < dis[v])
			{
				dis[v] = dis[u] + len;
				x.v = v;
				x.len = dis[v];
				cpriority_queue_push(&q, x);
			}
		}
	}
}

```

### dinic

```C++
namespace DINIC
{
    const int maxn = 205, maxm = 5005 * 2, inf = 0x3f3f3f3f;
    struct Edge
    {
        int v, w;
    };
    int e;
    struct Graph
    {
        void ini(int _n)
        {
            n = _n;
            esize = 1;
            memset(nxt, 0, sizeof(nxt));
            memset(h, 0, sizeof(h));
        }
        Edge edg[maxm];
        int  h[maxn], nxt[maxm], esize, n;
        inline void add(int u, int v, int w)
        {
            esize++;
            edg[esize] = { v,w };
            nxt[esize] = h[u];
            h[u] = esize;
        }
        int dep[maxn], inq[maxn], cur[maxn];
        int s, t;
        long long mxflow;
        bool tag;
        bool bfs()
        {
            for (int i = 1; i <= n; i++)
            {
                cur[i] = h[i];
                dep[i] = inf;
                inq[i] = 0;
            }
            queue<int> q;
            q.push(s);
            dep[s] = 0;
            inq[s] = 1;
            while (!q.empty())
            {
                int u = q.front();
                q.pop();
                for (int i = h[u]; i; i = nxt[i])
                {
                    int v = edg[i].v;
                    if (edg[i].w > 0 && dep[u] + 1 < dep[v])
                    {
                        dep[v] = dep[u] + 1;
                        if (!inq[v])
                        {
                            q.push(v);
                            inq[v] = 1;
                        }
                    }
                }
            }
            if (dep[t] == inf)return 0;
            return 1;
        }
        inline long long dfs(int u, long long mnflow)
        {
            long long usflow = 0, tmpflow = 0;
            if (u == t)
            {
                return mnflow;
            }
            for (int i = cur[u]; i; i = nxt[i])
            {
                cur[u] = i;
                int v = edg[i].v;
                if (edg[i].w > 0 && dep[v] == dep[u] + 1)
                {
                    tmpflow = dfs(v, mn(mnflow, edg[i].w));
                    if (!tmpflow) dep[v] = inf;
                    edg[i].w -= tmpflow;
                    edg[i ^ 1].w += tmpflow;
                    usflow += tmpflow;
                    mnflow -= tmpflow;
                    if (!mnflow)break;
                }
            }
            return usflow;
        }
        long long dinic(int _s, int _e)
        {
            s = _s;
            t = _e;
            mxflow = 0;
            while (bfs())
            {
                tag = 1;
                while (tag)
                {
                    tag = 0;
                    mxflow += dfs(s, INT_MAX);
                }
            }
            return mxflow;
        }
    }g;
}

```

### isap

```C++
namespace ISAP
{
    const int maxn = 1e5, maxm = 1e5;
    struct Edge
    {
        int v, w;
    };
    struct Graph
    {
        int h[maxn], nxt[maxm], esize, n;
        Edge edg[maxm];
        void ini(int _n)
        {
            n = _n;
            memset(h, 0, sizeof(h));
            memset(nxt, 0, sizeof(nxt));
            esize = 1;
        }
        void inline add(int u, int v, int w)
        {
            esize++;
            edg[esize] = { v,w };
            nxt[esize] = h[u];
            h[u] = esize;
        }
        int cur[maxn], gap[maxn], bfn[maxn], s, t;
        void bfs()
        {
            queue<int> q;
            memset(bfn, 0, sizeof(bfn));
            memset(gap, 0, sizeof(gap));
            for (int i = 1; i <= n; i++)
            {
                cur[i] = h[i];
            }
            q.push(t);
            bfn[t] = 1;
            gap[1]++;
            while (!q.empty())
            {
                int u = q.front();
                q.pop();
                for (int i = h[u]; i; i = nxt[i])
                {
                    int v = edg[i].v;
                    if (bfn[v])continue;
                    bfn[v] = bfn[u] + 1;
                    gap[bfn[v]]++;
                    q.push(v);
                }
            }
        }
        long long dfs(int u, int minflow)
        {
            if (u == t)return minflow;
            int useflow = 0;
            for (int& i = cur[u]; i; i = nxt[i])
            {
                int v = edg[i].v;
                if (bfn[v] + 1 != bfn[u] || edg[i].w <= 0)continue;
                long long tmp = dfs(v, min(minflow, edg[i].w));
                if (tmp)
                {
                    useflow += tmp;
                    minflow -= tmp;
                    edg[i].w -= tmp;
                    edg[i ^ 1].w += tmp;
                    if (!minflow)return useflow;
                }
            }
            gap[bfn[u]]--;
            if (!gap[bfn[u]])bfn[s] = n + 1;
            bfn[u]++;
            gap[bfn[u]]++;
            cur[u] = h[u];
            return useflow;
        }
        long long isap(int _s, int _t)
        {
            s = _s;
            t = _t;
            bfs();
            long long maxflow = 0;
            while (bfn[s] <= n)
            {
                maxflow += dfs(s, INT_MAX);
            }
            return maxflow;
        }
    }g;
}

```

### 最小费用最大流

```C++
namespace MCMF
{
    const int maxn = 5005, maxm = 50005 * 2, inf = 0x3f3f3f3f;
    struct Edge
    {
        int v, w, f;
    };
    struct Graph
    { 
        void ini(int _n)
        {
            n = _n;
            esize = 1;
            memset(nxt, 0, sizeof(nxt));
            memset(h, 0, sizeof(h));
        }
        Edge edg[maxm];
        int  h[maxn], nxt[maxm], esize, n;
        inline void add(int u, int v, int w, int f)
        {
            esize++;
            edg[esize] = { v,w,f };
            nxt[esize] = h[u];
            h[u] = esize;
        }
        int minf[maxn], pre[maxn], inedg[maxn], flow[maxn];
        bool inq[maxn];
        int s, t;
        int mxflow, mncost;
        inline bool spfa()
        {
            for (int i = 1; i <= n; i++)
            {
                minf[i] = inf;
                inq[i] = 0;
                pre[i] = 0;
                flow[s] = INT_MAX;
            }
            queue<int> q;
            q.push(s);
            minf[s] = 0;
            inq[s] = 1;
            while (!q.empty())
            {
                int u = q.front();
                q.pop();
                inq[u] = 0;
                for (int i = h[u]; i; i = nxt[i])
                {
                    int v = edg[i].v;
                    if (edg[i].w > 0 && minf[u] + edg[i].f < minf[v])
                    {
                        minf[v] = minf[u] + edg[i].f;
                        pre[v] = u;
                        inedg[v] = i;
                        flow[v] = mn(flow[u], edg[i].w);
                        if (!inq[v])
                        {
                            q.push(v);
                            inq[v] = 1;
                        }
                    }
                }
            }
            return pre[t];
        }
        void MCMF(int _s, int _t)
        {
            s = _s;
            t = _t;
            mxflow = 0;
            mncost = 0;
            while (spfa())
            {
                int x = t;
                mxflow += flow[t];
                mncost += flow[t] * minf[t];
                while (x != s)
                {
                    int i = inedg[x];
                    edg[i].w -= flow[t];
                    edg[i ^ 1].w += flow[t];
                    x = pre[x];
                }
            }
        }
    }g;
}

```

### 一般最大图匹配

```c++
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<iostream>
#include<queue>

using namespace std;
const int N = 5007, M = 500007, INF = 0x3f3f3f3f;

int n, m;
int dfn[M];
int low[N], fa[N];
int tim;
int pre[N];//前驱
int match[N];//匹配点
queue<int>q;
int head[N], ver[M], nex[M], tot;
int vis[N];

int ans;

void add(int x, int y)
{
    ver[tot] = y;
    nex[tot] = head[x];
    head[x] = tot ++ ;
}

int Find(int x)
{
    if(fa[x] == x)return x;
    return fa[x] = Find(fa[x]);
}



//朴素的lca，根据建图的方式暴力跳
inline int lca(int x, int y)
{
    ++ tim;//时间戳 / 缩点的编号
    while(dfn[x] != tim){
        dfn[x] = tim;//每走一步就标记一下， 如果遇见一个点已经被标记过了就说明这个点已经被另一个点走过了，也就说明是lca
        x = Find(pre[match[x]]);
        if(y)swap(x, y);
    }
    return x;//lca
}
//开花（缩环）
//x和y是要开花的两个点（此时x和y都是黑点刚找到奇环的时候）
//w是他们的lca
//整个花缩完之后就是一个黑点

//!这里虽然是两个点但是只是从x走到了x和y的lca：w，y到w路径上的点并没有染色或者丢到队列里去，所以要开两次，一次x一次y。
inline void blossom(int x, int y, int w)
{
    while(Find(x) != w){
        pre[x] = y;
        y = match[x];
        //如果是白点就直接染成黑色，然后丢到队列里面
        vis[y] = 1, q.push(y);
        if(Find(x) == x)fa[x] = w;
        if(Find(y) == y)fa[y] = w;
        x = pre[y];
    }
}

inline bool aug(int s)
{
    if((ans + 1) * 2 > n)return 0;

    for(int i = 1; i <= n; ++ i)
        fa[i] = i, pre[i] = vis[i] = 0;
    while(!q.empty())q.pop();
    q.push(s);
    vis[s] = 1;//从黑点开始
    //队列中都是黑点，所以遇到相邻未染色的点都染成白点
    while(!q.empty()){
        int x = q.front();
        q.pop();
        for(int i = head[x] ;~i; i = nex[i]){
            int y = ver[i];
            //如果相邻点是白点，或者是同一朵花中的节点，则直接跳过这个点
            if(Find(x) == Find(y) || vis[y] == 2) continue;
            if(!vis[y]){//未染色（匹配）点，说明找到了增广路
                vis[y] = 2;//没染色就把它染成白色
                pre[y] = x;
                if(!match[y]){
                    int u = y;
                    while(u){
                        int v = pre[u], z = match[v];
                        match[u] = v;match[v] = u;
                        u = z;
                    }
                    return 1;
                }
                vis[match[y]] = 1, q.push(match[y]);
            }
            else {
                int w = lca(x, y);
                blossom(x, y, w);
                blossom(y, x, w);
            }
        }
    }
    return 0;
}

int main()
{
    memset(head, -1, sizeof head);

    scanf("%d%d", &n, &m);
    for(int i = 1; i <= m; ++ i){
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y), add(y, x);
    }

    for(int i = 1; i <= n; ++ i){
        if(!match[i])
            ans += aug(i);
    }

    printf("%d\n", ans);

    for(int i = 1; i <= n; ++ i)
        printf("%d%s", match[i], i == n ? "\n" : " ");
    return 0;
}

```

### lca倍增法

```cpp
#include<iostream>
#include<string.h>
#include<climits>
#include<cstdio>
#include<algorithm>
using namespace std;
const int maxn=10005;
typedef long long ll;
struct Unionset
{
    int f[maxn];
    void ini(int n)
    {
        for(int i=1;i<=n;i++)
        {
            f[i]=i;
        }
    }
    int find(int x)
    {
        return x==f[x]?x:f[x]=find(f[x]);
    }
    void uni(int x,int y)
    {
        f[find(x)]=find(y);
    }
    bool query(int x,int y)
    {
        return find(x)==find(y);
    }
}us;
int n,m;
struct Edg
{
    int v,w;
}edg[maxn*2];
int h[maxn],nxt[maxn*2],esize=0;

inline void add(int u,int v,int w)
{
    esize++;
    edg[esize]={v,w};
    nxt[esize]=h[u];
    h[u]=esize;
}
int dep[maxn],fv[maxn][21],fw[maxn][21];
void dfs(int x,int pre)
{
    for(int i=h[x];i;i=nxt[i])
    {
        int v=edg[i].v;
        if(v==pre)continue;
        fv[v][0]=x;
        fw[v][0]=edg[i].w;
        dep[v]=dep[x]+1;
        dfs(v,x);
    }
}
const int maxm=50005;
struct Edge
{
    int u,v,w;
}e[maxm];
bool cmp(Edge a,Edge b)
{
    return a.w>b.w;
}
int lca(int x,int y)
{
    int res=INT_MAX;
    if(!us.query(x,y))
    {
        return -1;
    }
    if(dep[x]<dep[y])
    {
        swap(x,y);
    }
    for(int i=20;i>=0;i--)
    {
        if(dep[fv[x][i]]>=dep[y])
        {
            res=min(res,fw[x][i]);
            x=fv[x][i];
        }
    }
    if(x==y)return res;
    for(int i=20;i>=0;i--)
    {
        if(fv[x][i]!=fv[y][i])
        {
            res=min({res,fw[x][i],fw[y][i]});
            x=fv[x][i];
            y=fv[y][i];
        }
    }
    res=min({res,fw[x][0],fw[y][0]});
    return res;
}
int main()
{
    //freopen("P1967_2.in","r",stdin);
    ios::sync_with_stdio(0);
    cin.tie(0);
    memset(h,0,sizeof(h));
    memset(nxt,0,sizeof(nxt));
    memset(dep,0,sizeof(dep));
    cin>>n>>m;
    us.ini(n);
    for(int i=1;i<=m;i++)
    {
        cin>>e[i].u>>e[i].v>>e[i].w;
    }
    sort(e+1,e+1+m,cmp);
    for(int i=1;i<=m;i++)
    {
        if(!us.query(e[i].u, e[i].v))
        {
            us.uni(e[i].u,e[i].v);
            add(e[i].u,e[i].v,e[i].w);
            add(e[i].v,e[i].u,e[i].w);

        }
    }
    for(int i=1;i<=n;i++)
    {
        if(!dep[i])
        {
            dep[i]=1;
            fv[i][0]=i;
            fw[i][0]=INT_MAX;
            dfs(i,i);
        }
    }
    for(int i=1;i<=20;i++)
    {
        for(int j=1;j<=n;j++)
        {
            fv[j][i]=fv[fv[j][i-1]][i-1];
            fw[j][i]=min(fw[j][i-1],fw[fv[j][i-1]][i-1]);
        }
    }
    int q;
    cin>>q;
    for(int i=1;i<=q;i++)
    {
        int u,v;
        cin>>u>>v;
        cout<<lca(u,v)<<'\n';
    }
}
```

### 两点间k短路

```c++
#include <cstdio>
#include <climits>
#include <queue>
#include <algorithm>

const int MAXN = 1005;
const int MAXM = 100005;

struct Edge;
struct Node {
    Edge *e, *eo;
    int dist, times;
    bool vis;
} N[MAXN];

struct Edge {
    Node *u, *v;
    Edge *next;
    int w;

    Edge() {}
    Edge(Node *u, Node *v, int w, Edge *next) : u(u), v(v), w(w), next(next) {}
} _pool[MAXM << 1], *_curr = _pool;

void addEdge(int u, int v, int w) {
    N[u].e = new (_curr++) Edge(&N[u], &N[v], w, N[u].e);
    N[v].eo = new (_curr++) Edge(&N[v], &N[u], w, N[v].eo);
}

namespace Dijkstra {
    struct HeapNode {
        Node *u;
        int dist;

        HeapNode(Node *u, int dist) : u(u), dist(dist) {}

        bool operator<(const HeapNode &rhs) const {
            return dist > rhs.dist;
        }
    };

    void dijkstra(Node *s) {
        static std::priority_queue<HeapNode> q;
        s->dist = 0;
        q.emplace(s, 0);
        while (!q.empty()) {
            Node *u = q.top().u;
            q.pop();

            if (u->vis) continue;
            u->vis = true;

            for (Edge *e = u->eo; e; e = e->next) {
                if (e->v->dist > u->dist + e->w) {
                    e->v->dist = u->dist + e->w;
                    q.emplace(e->v, e->v->dist);
                }
            }
        }
    }

    void solve(int s, int n) {
        for (int i = 1; i <= n; i++) {
            N[i].dist = INT_MAX;
            N[i].vis = false;
        }

        dijkstra(&N[s]);
    }
}

namespace KthShortest {
    struct HeapNode {
        Node *u;
        int curr, last;

        HeapNode(Node *u, int curr, int last) : u(u), curr(curr), last(last) {}

        bool operator<(const HeapNode &rhs) const {
            return curr + last > rhs.curr + rhs.last;
        }
    };

    int astar(Node *s, Node *t, int k) {
        static std::priority_queue<HeapNode> q;
        q.emplace(s, 0, s->dist);
        while (!q.empty()) {
            Node *u = q.top().u;
            int curr = q.top().curr;
            int last = q.top().last;
            q.pop();

            ++u->times;
            if (u->times == k && u == t) return curr + last;
            if (u->times > k) continue;

            for (Edge *e = u->e; e; e = e->next) q.emplace(e->v, curr + e->w, e->v->dist);
        }

        return -1;
    }

    int solve(int s, int t, int k, int n) {
        Dijkstra::solve(t, n);
        return astar(&N[s], &N[t], k);
    }
}

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0, u, v, w; i < m; i++) {
        scanf("%d %d %d", &u, &v, &w);
        addEdge(u, v, w);
    }

    int s, t, k;
    scanf("%d %d %d", &s, &t, &k);
    if (s == t) ++k;

    int ans = KthShortest::solve(s, t, k, n);
    printf("%d\n", ans);

    return 0;
}
```



# 字符串

## kmp

```C++
const int maxn = 1000009;
int nxt[maxn];
char str1[maxn], str2[maxn];
int main()
{
	//freopen("P3375_11.in", "r", stdin);
	scanf("%s", str1 + 1);
	scanf("%s", str2 + 1);
	int n1 = strlen(str1+1), n2 = strlen(str2+1);
	nxt[2] = 1;
	for (int i = 2; i <= n2; i++)
	{
		int j = nxt[i];
		while (j != 1 && str2[i] != str2[j])j = nxt[j];
		nxt[i + 1] = (str2[i] == str2[j] ? j + 1 : 1);
	}
	for (int i = 1, j = 1; i <= n1; i++)
	{
		while (j != 1 && str1[i] != str2[j])j = nxt[j];
		if (str1[i] == str2[j])j++;
		if (j == n2 + 1)cout << i - n2 + 1 << '\n';
	}
	for (int i = 2; i <= n2 + 1; i++)
	{
		cout << nxt[i]-1 << ' ';
	}
```

## AC自动机

```c++
#include<bits/stdc++.h>
#define N 500010
using namespace std;
queue<int>q;
struct Aho_Corasick_Automaton{
    int c[N][26],val[N],fail[N],cnt;
    void ins(char *s){
        int len=strlen(s);int now=0;
        for(int i=0;i<len;i++){
            int v=s[i]-'a';
            if(!c[now][v])c[now][v]=++cnt;
            now=c[now][v];
        }
        val[now]++;
    }
    void build(){
        for(int i=0;i<26;i++)if(c[0][i])fail[c[0][i]]=0,q.push(c[0][i]);
        while(!q.empty()){
            int u=q.front();q.pop();
            for(int i=0;i<26;i++)
            if(c[u][i])fail[c[u][i]]=c[fail[u]][i],q.push(c[u][i]);
            else c[u][i]=c[fail[u]][i];
        }
    }
    int query(char *s){
        int len=strlen(s);int now=0,ans=0;
        for(int i=0;i<len;i++){
            now=c[now][s[i]-'a'];
            for(int t=now;t&&~val[t];t=fail[t])ans+=val[t],val[t]=-1;
        }
        return ans;
    }
}AC;
int n;char p[1000005];
int main(){
    scanf("%d",&n);
    for(int i=1;i<=n;i++)scanf("%s",p),AC.ins(p);
    AC.build();
    scanf("%s",p);int ans=AC.query(p);
    printf("%d\n",ans);
    return 0;
}
```

