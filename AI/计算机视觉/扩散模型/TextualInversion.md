# TexualInversion

通过训练text transforme的word embedding来使扩散模型学习到新的概念

- 设计新的词V*，其对应新的token，也对应新的embedding，这个embedding便是需要训练的
- 随机性抽取中性上下文文本，源自CLIP ImageNet模板，构成prompt，与对应的概念图片，通过最小化图像重建损失进行优化得到最佳得embedding

![image-20230710020944728](./TextualInversion.assets/Outline%20of%20the%20text-embedding%20and%20inversion%20process.png)