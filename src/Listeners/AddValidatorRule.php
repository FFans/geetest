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
use FFans\GeeTest\Requests\GeeTestRequestMethod;
use FFans\GeeTest\Utils;
use Flarum\Api\ForgotPasswordValidator;
use Flarum\Forum\LogInValidator;
use Flarum\Foundation\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Validator;

class AddValidatorRule
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(AbstractValidator $flarumValidator, Validator $validator)
    {
        if (!Utils::isExtensionSetup($this->settings)) {
            return;
        }

        $validator->addExtension(
            'double_check',
            function ($attribute, $value) use ($flarumValidator, $validator) {
                // Utils::logInfo('AddValidatorRule:', $value);

                $validator->setCustomMessages(
                    [
                        'required' => Utils::translate('lib.verify.required_message'),
                        'double_check' => Utils::translate('lib.verify.not_pass_message'),
                    ]
                );

                if (empty($value)) {
                    return false;
                }

                $contextEvent = $flarumValidator instanceof LogInValidator ? ContextEvent::Login : ($flarumValidator instanceof ForgotPasswordValidator ? ContextEvent::Forgot : ContextEvent::Signup);

                $verification = (new GeeTestRequestMethod($value, $contextEvent, $this->settings))->doubleCheck();

                if ($verification->isFail()) {
                    return false;
                }

                return $verification->isSuccess() || $verification->isError();
            }
        );

        if ($flarumValidator instanceof LogInValidator && Utils::isEnabled($this->settings, ContextEvent::Login)) {
            $validator->addRules([
                'ffans-geetest-result' => ['required', 'double_check'],
            ]);
        }

        if ($flarumValidator instanceof ForgotPasswordValidator && Utils::isEnabled($this->settings, ContextEvent::Forgot)) {
            $validator->addRules([
                'ffans-geetest-result' => ['required', 'double_check'],
            ]);
        }
    }
}
