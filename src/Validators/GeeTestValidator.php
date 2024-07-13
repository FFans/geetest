<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest\Validators;

use FFans\GeeTest\Utils;
use Flarum\Foundation\AbstractValidator;

class GeeTestValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'geetest' => [
            'required',
            'double_check',
        ],
    ];

    protected function getMessages()
    {
        return [
            'required' => Utils::translate('lib.verify.required_message'),
            'double_check' => Utils::translate('lib.verify.not_pass_message'),
        ];
    }
}
