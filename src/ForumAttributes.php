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

use FFans\GeeTest\Enums\ContextEvent;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Str;

class ForumAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    const ProductService = 'product_service';
    const Product = 'product';
    const Id = 'id';
    const Standalone = 'standalone';
    const Configured = 'configured';

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(ForumSerializer $serializer, $model, array $attributes): array
    {
        $settingNames = [
            self::ProductService,
            self::Product,
            self::Id,
            ContextEvent::Signup . '.' . self::Product,
            ContextEvent::Signup . '.' . self::Id,
            ContextEvent::Login . '.' . self::Product,
            ContextEvent::Login . '.' . self::Id,
            ContextEvent::Forgot . '.' . self::Product,
            ContextEvent::Forgot . '.' . self::Id,
        ];

        foreach ($settingNames as $name) {
            $attributes[Utils::getSettingPath(Str::camel($name))] = $this->settings->get(Utils::getSettingPath($name));
        }

        $boolSettings = [
            ContextEvent::Signup,
            ContextEvent::Login,
            ContextEvent::Forgot,
            ContextEvent::Signup . '.' . self::Standalone,
            ContextEvent::Login . '.' . self::Standalone,
            ContextEvent::Forgot . '.' . self::Standalone,
        ];

        foreach ($boolSettings as $name) {
            $attributes[Utils::getSettingPath(Str::camel($name))] = $this->settings->get(Utils::getSettingPath($name)) === '1';
        }

        $attributes[Utils::getSettingPath(self::Configured)] = Utils::isExtensionSetup($this->settings);
        $attributes[Utils::getSettingPath(ContextEvent::Signup . '.' . self::Configured)] = Utils::isExtensionSetup($this->settings, ContextEvent::Signup);
        $attributes[Utils::getSettingPath(ContextEvent::Login . '.' . self::Configured)] = Utils::isExtensionSetup($this->settings, ContextEvent::Login);
        $attributes[Utils::getSettingPath(ContextEvent::Forgot . '.' . self::Configured)] = Utils::isExtensionSetup($this->settings, ContextEvent::Forgot);

        return $attributes;
    }
}
