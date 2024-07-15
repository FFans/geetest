<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest;

use FFans\GeeTest\Listeners\AddValidatorRule;
use FFans\GeeTest\Listeners\RegisterValidate;
use FFans\GeeTest\Validators\GeeTestValidator;
use Flarum\Api\ForgotPasswordValidator;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\Forum\LogInValidator;
use Flarum\User\Event\Saving as UserSaving;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

//    (new Extend\Settings())
//        ->default('ffans-geetest.signup', true)
//        ->default('ffans-geetest.login', true)
//        ->default('ffans-geetest.forgot', true)
//        ->default('ffans-geetest.forgot', true),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(ForumAttributes::class),

    (new Extend\Routes('api'))
        ->post('/ffans/geetest/test', 'ffans-geetest.test', Api\Controller\TestGeeTestController::class),

    (new Extend\Validator(GeeTestValidator::class))
        ->configure(AddValidatorRule::class),

    (new Extend\Validator(LogInValidator::class))
        ->configure(AddValidatorRule::class),

    (new Extend\Validator(ForgotPasswordValidator::class))
        ->configure(AddValidatorRule::class),

    (new Extend\Event())
        ->listen(UserSaving::class, RegisterValidate::class)
];
