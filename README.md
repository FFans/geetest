# FFans GeeTest CAPTCHA

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest) [![Total Downloads](https://img.shields.io/packagist/dt/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest)

A [Flarum](http://flarum.org) extension. Bring GeeTest CAPTCHA to your forum.

![img.png](img.png)

## Features
- [x] Sign Up
- [x] Log In
- [x] Forgot Password
- [ ] Support CAPTCHA 3.0
- [ ] Support replay verification

## Installation

Install with [Extension Manager](https://discuss.flarum.org/d/33955) or composer:

```sh
composer require ffans/geetest:"*"
```

## Updating

```sh
composer update ffans/geetest:"*"
php flarum migrate
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/ffans/geetest)
- [GitHub](https://github.com/ffans/geetest)
- [Discuss](https://discuss.flarum.org/d/34860)
- [Chinese Community](https://discuss.flarum.org.cn/d/15787)
