<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest\Listeners;

use FFans\GeeTest\Enums\ContextEvent;
use FFans\GeeTest\Utils;
use FFans\GeeTest\Validators\GeeTestValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;

class RegisterValidate
{
    /**
     * @var GeeTestValidator
     */
    protected $validator;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param GeeTestValidator $validator
     */
    public function __construct(GeeTestValidator $validator, SettingsRepositoryInterface $settings)
    {
        $this->validator = $validator;
        $this->settings = $settings;
    }

    public function handle(Saving $event)
    {
        // We also check for the actor's admin status, so that we can allow admins to create users from the admin panel without recaptcha blocking the action.
        if (!$event->user->exists && Utils::isEnabled($this->settings, ContextEvent::Signup) && !$event->actor->isAdmin()) {
            $this->validator->assertValid([
                'geetest' => Arr::get($event->data, 'attributes.ffans-geetest-result', ''),
            ]);
        }
    }

}
