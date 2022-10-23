### 1. 主要内容：

- 提出了一个残差学习框架，能够简化深度神经网络的训练；
- 用残差函数替代原始原始函数，重组了框架的各层；
- 这些残差网络更容易优化，而且能通过更深的层来提升准确率；

此文章研究思路为：在图像识别领域，神经网络的深度至关重要——> 但是层数越深，准确率反而降低（如下图）——> 提出了残差网络(ResNet)来解决这个问题。

![image-20221022162210276](%E3%80%8ADeep%20Residual%20Learning%20for%20Image%20Recognition%E3%80%8B.assets/image-20221022162210276.png)

可见随着网络层数的增加，准确率达到饱和后迅速退化，但是这种退化并不少过拟合造成的，且再一个合理的深度模型中，增加更多的层却导致了**更高的错误率**。
事实上 **退化**的出现表明了并非所有的系统都是容易优化的。设想，对于一个浅层网络，给它加上更多的层，有这样一种方法：用**恒等映射**来构建增加的层。这说明，一个更深的模型，至少不应该带来更高的错误率。
本文提出了一种深度**残差学习**框架来解决退化问题。我们明确让神经网络来拟合残差映射F(x)=H(x)−xF(x)=H(x)−x，而不是原来的底层映射H(X)H(X)。而残差映射相对更容易优化，例如，在极端情况下，恒等映射时，将残差变为全0,比原来用非线性层堆叠更加简单。

![image-20221022162158681](%E3%80%8ADeep%20Residual%20Learning%20for%20Image%20Recognition%E3%80%8B.assets/image-20221022162158681.png)

公式F(x)=H(x)−xF(x)=H(x)−x可以通过前馈神经网络的”shortcut connections”来实现，如上图。

### 3. 创新点：深度残差学习

- 残差学习：
  1. H(x)H(x)由非线性层拟合而来，x为输入，既然能拟合H(x)H(x)，同样也能拟合H(X)−XH(X)−X；
  2. 明确让这些层，逼近残差函数F(x)=H(x)−xF(x)=H(x)−x，则原始函数变为Hx)=F(x)+xHx)=F(x)+x；
  3. 两种函数都可以优化，但是残差函数学习更加简单；
- 恒等映射：
  1. 构建一个模块如上图figure2,公式为：
     y=F(x,Wi)+xy=F(x,Wi)+x
  2. 上图figure2的例子包含两层F=W2σ(W1x)F=W2σ(W1x),F+xF+x由shortcut和一个加法来完成；
  3. shortcut连接没有增加额外的参数和计算复杂度；
  4. 如果x和F的维度不相同（例如, 当改变了输入/输出的通道），可以通过shortcut连接执行一个线性映射WsWs 来匹配两者的维度:y=F(x,Wi)+Wsxy=F(x,Wi)+Wsx
  5. 该方法对卷积层和全连接层都适用；

### 4. 网络结构：

![architecture](%E3%80%8ADeep%20Residual%20Learning%20for%20Image%20Recognition%E3%80%8B.assets/post3-architecture.png)

左边为VGG-19,中间为‘Plain Network’,右边为‘Residual Network’
下图Table1展示了ResNet更多的架构：

![architecture1](%E3%80%8ADeep%20Residual%20Learning%20for%20Image%20Recognition%E3%80%8B.assets/post3-architecture1.png)