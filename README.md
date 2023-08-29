# which one
List the scripts in package.json and choose one to execute.

Read this in other languages: [English](./README.md) | [简体中文](./README-zh_CN.md)

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
## Regular Filtering
Regular matching is filtered using global matching that ignores case.

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

## Options

### -r

Supports the -r option, which executes the previous script.

```shell
│which-one on  main 
└─> wo 'd.*:c'
? which one › - Use arrow-keys. Return to submit.
❯   demo:c

# will execute demo:c

│which-one on  main 
└─> wo -r
```
