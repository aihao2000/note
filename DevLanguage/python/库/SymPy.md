# SymPy

```python
import sympy as sym
```



## 定义符号

```pyhton
J, w = symbols('J, w')
```

## 定义表达式

```python
J=w**2
```

## 求微分式

```python
dJ_dw = diff(J,w)
```

## 求在某点微分值

```python
dJ_dw.subs([(w,2)])    # derivative at the point w = 2
```

