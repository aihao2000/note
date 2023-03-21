# matplotlib

matplotlib在 figure（图）上绘制数据，每个小部件可以包含一个或多个Axes（轴）

![image-20230121204845173](./matplotlib.assets/image-20230121204845173.png)

## figure

图始终跟踪所有子轴，一组 Artists(标题，图形图例，颜色条等)，以及所有子图

创建figure的方式如下：

```python
fig = plt.figure() # 创建一个空的没有任何Axes的figure
fig,ax = ply.subslots() # 具有一个Axes的figure
fig,axs = plt.subplots # 具有2*2 网格 Axes的figure
```

## Axes

一个Axes是一个附着在Figure的Artist，包含了一些绘制数据。

通常包含两个 Axis object（3D图会包含三个）。

Axis object提供 刻度线以及刻度标签来为Axes中的数据提供scales。

每个Axes有一个title(set_title())，一个x_lable以及一个y_lable

## Axis

这个对象设置比例以及限制，并且生成ticks（轴上的标记）以及ticklables（ticks上的字符串标签）。

ticks的位置由Locator对象决定

ticklables由Formatter对象格式化。

## Artist

基本上，Figure上可见的所有内容都是Artist（甚至Figure，Axes，和Axis对象）。

Artist包括Text对象，Linu2D对象以及collections对象。

当Figure被渲染时，所有Artists都被绘制到画布上

## plotting functions

绘制函数期望numpy.array或numpy.ma.masked_array或者可传递给numpy.asarray的对象作为输入

### scatter

绘制点