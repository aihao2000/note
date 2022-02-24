# SQL

- select
- from
- join
- on
- where
- group by
- with
- having
- order by 
- limit

## 执行顺序

- from

  执行笛卡尔积生成虚拟表VT1，从右到左

  即最后的表为驱动表

- on

  筛选出满足条件的行VT2

- join

  根据连接规则生成虚拟表VT3

  - left outer join

    将左表作为基础表连接右表

  - right outer join

    将右表作为基础表连接左表

  - 吧左右表都极为保留表

- where

  对虚拟表VT3的行进行筛选

- group by

  将某一列相同值得行并为一组

- AGG_FUNC

  计算等聚合函数，从列中取得的值

- with

  CUBE生成结果数据集显示了所选列中值的所有组合的聚合

  ROLLUP生成的结果数据集显示了所选列中值得某一层次结构得聚合

- having

  对聚合后得组进行筛选

- select

  选出指定列

- distinct

  行去重

- order by

  排列

- limit/offset

  指定返回行

## SQL语句类别

- 数据定义语言
- 数据查询语言
- 数据操纵语言
- 数据控制语言

## 键

- 超键

  在关系中，能唯一标识元组得属性集

- 候选键

  最小超键

- 主键

  唯一和完整标识得数据列或属性集合

- 外键

  一个表中存在的另一个表得主键称此表得外键

## SQL约束

- not null

  保证该字段值一定不为空

- default

  保证字段有默认值

- primary key

  主键约束

- foreign key

  外键约束

- unique

  保证字段在表内得唯一性

- check

  限制值范围