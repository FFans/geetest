# FFans GeeTest 极验验证码

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest) [![Downloads](https://img.shields.io/packagist/dt/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest)

[Flarum](http://flarum.org) 扩展程序，使用[极验服务](https://www.geetest.com/)保护社区安全。

> 请先申请 [极验账号](https://www.geetest.com/Register)，然后前往 [后台](https://auth.geetest.com/product) 创建应用，获取验证码标识和密钥。

![img.png](img.png)

## 功能

- [x] 注册
- [x] 登录
- [x] 忘记密码
- [x] 支持行为验 4.0 版本
- [ ] 支持行为验证 3.0 版本
- [ ] 支持发帖

## 安装

使用 [扩展程序管理器](https://discuss.flarum.org/d/33955) 或通过 composer 手动安装:

```sh
composer require ffans/geetest:"*"
```

## 更新

```sh
composer update ffans/geetest:"*"
php flarum migrate
php flarum cache:clear
```

## 致谢

- 特别感谢极验官方和[右可哥](https://yorkun.com/)提供测试账号，感谢支持。
- 开发时有参考 `fof/recaptcha`，特此感谢。

## 链接

- [国际社区](https://discuss.flarum.org/d/34860)
- [中文社区](https://discuss.flarum.org.cn/d/15787)
- [Packagist](https://packagist.org/packages/ffans/geetest)
- [GitHub](https://github.com/FFans/geetest)
