# which one
列出 package.json 中的 scripts，选择其中某一项运行。

## Install

```shell
npm install -D @oasis-cloud/which-one
```

## Example
```shell
└─> wo 
? which one › - Use arrow-keys. Return to submit.
❯   test
    color
```
或
```shell
└─> wo c
? which one › - Use arrow-keys. Return to submit.
❯   color
    demo:c

```

### 过滤脚本后只有一个脚本存在则直接执行
```shell
└─> wo color
```

## 正则过滤
正则匹配采用忽略大小写的全局匹配方式进行过滤。

```shell
│which-one on  main 
└─> wo c
? which one › - Use arrow-keys. Return to submit.
❯   color
```

```shell
│which-one on  main 
└─> wo 'd.*:c'
? which one › - Use arrow-keys. Return to submit.
❯   demo:c
```

## 选项

### -r

支持 -r 选项，可执行上一次的 script。

```shell
│which-one on  main 
└─> wo 'd.*:c'
? which one › - Use arrow-keys. Return to submit.
❯   demo:c

# 执行 demo:c

│which-one on  main 
└─> wo -r
```
