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
use ReflectionClass;

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
        $reflectionClass = new ReflectionClass(ContextEvent::class);
        $contextEvents = array_values($reflectionClass->getConstants());
        $baseSettings = [
            self::ProductService,
            self::Product,
            self::Id,
        ];

        // base setting names
        $settingNames = array_merge(
            $baseSettings,
            array_map(function ($event) { return "$event." . self::Product; }, $contextEvents),
            array_map(function ($event) { return "$event." . self::Id; }, $contextEvents)
        );

        // bool setting names
        $boolSettings = array_merge(
            $contextEvents,
            array_map(function ($event) { return "$event." . self::Standalone; }, $contextEvents)
        );

        // init base setting maps
        $allSettings = array_map(function ($name) {
            return ['name' => $name, 'isBool' => false];
        }, $settingNames);

        // merge bool setting maps
        $allSettings = array_merge($allSettings, array_map(function ($name) {
            return ['name' => $name, 'isBool' => true];
        }, $boolSettings));

        // assignment settings
        foreach ($allSettings as $setting) {
            $value = $this->settings->get(Utils::getSettingPath($setting['name']));
            if ($setting['isBool']) {
                $value = $value === '1';
            }
            $attributes[Utils::getSettingPath(Str::camel($setting['name']))] = $value;
        }

        // assignment general configured or not
        $attributes[Utils::getSettingPath(self::Configured)] = Utils::isExtensionSetup($this->settings);
        // assignment context event configured or not
        foreach ($contextEvents as $event) {
            $attributes[Utils::getSettingPath("$event." . self::Configured)] = Utils::isExtensionSetup($this->settings, $event);
        }

        return $attributes;
    }
}
