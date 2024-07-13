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
use Flarum\Settings\SettingsRepositoryInterface;

class Utils
{
    const PREFIX = 'ffans-geetest';

    public static function isExtensionSetup(SettingsRepositoryInterface $settings, string $type = null): bool
    {
        return match ($type) {
            ContextEvent::Signup => !self::isNil($settings, [ContextEvent::Signup . '.product', ContextEvent::Signup . '.id', ContextEvent::Signup . '.key']),
            ContextEvent::Login => !self::isNil($settings, [ContextEvent::Login . '.product', ContextEvent::Login . '.id', ContextEvent::Login . '.key']),
            ContextEvent::Forgot => !self::isNil($settings, [ContextEvent::Forgot . '.product', ContextEvent::Forgot . '.id', ContextEvent::Forgot . '.key']),
            default => !self::isNil($settings, ['product_service', 'product', 'id', 'key']),
        };
    }

    private static function isNil(SettingsRepositoryInterface $settings, array $keys)
    {
        return array_reduce($keys, function ($carry, $key) use ($settings) {
            return $carry === false && trim($settings->get(self::getSettingPath($key), '')) === '';
        }, false);
    }

    public static function getSettingPath(string $key): string
    {
        return self::PREFIX . '.' . $key;
    }

    public static function getSetting(SettingsRepositoryInterface $settings, string $key): string
    {
        return $settings->get(self::getSettingPath($key), '');
    }

    public static function isEnabled(SettingsRepositoryInterface $settings, string $contextEvent): bool
    {
        return $settings->get(self::getSettingPath($contextEvent), '') === '1';
    }

    public static function logError(string $message, mixed $details = null)
    {
        resolve('log')->error('[FFans\GeeTest] ' . $message);
        $details && resolve('log')->error(var_export($details, true));
    }

    public static function logInfo(string $message, mixed $details = null)
    {
        resolve('log')->info('[FFans\GeeTest] ' . $message);
        $details && resolve('log')->info(var_export($details, true));
    }
    public static function translate(string $key)
    {
        return resolve('translator')->trans(self::PREFIX.'.'.$key);
    }
}
