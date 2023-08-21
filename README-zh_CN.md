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
 or
```shell
└─> wo color
? which one › - Use arrow-keys. Return to submit.
❯   color
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