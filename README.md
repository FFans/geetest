# FFans GeeTest CAPTCHA

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest) [![Total Downloads](https://img.shields.io/packagist/dt/ffans/geetest.svg)](https://packagist.org/packages/ffans/geetest)

A [Flarum](http://flarum.org) extension. Bring [GeeTest CAPTCHA](https://www.geetest.com/en/adaptive-captcha-demo) to your forum.

> Apply your [GeeTest account](https://www.geetest.com/en/Register_en) first, then go to the [Dashboard](https://auth.geetest.com/product) and create your application, and now you get the id and the key.

![img.png](img.png)

## Features
- [x] Sign Up
- [x] Log In
- [x] Forgot Password
- [x] Support Adaptive CAPTCHA 4.0
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

## Credits

- Special thanks to GeeTest and [YorKun](https://yorkun.com/) for providing test accounts, thanks for your support.
- Special thanks to `fof/recaptcha` for the code reference during development.
- Extension Icon source from [GeeTest Figma](https://www.figma.com/community/file/1044470021229645118), licensed under CC BY 4.0.

## Links

- [Packagist](https://packagist.org/packages/ffans/geetest)
- [GitHub](https://github.com/ffans/geetest)
- [Discuss](https://discuss.flarum.org/d/34860)
- [Chinese Community](https://discuss.flarum.org.cn/d/15787)
