<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest\Enums;

abstract class ContextEvent {
    const Signup 	= 'signup';
    const Login 	= 'login';
    const Forgot 	= 'forgot';
}
