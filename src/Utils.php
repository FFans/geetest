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
use ReflectionClass;

class Utils
{
    const PREFIX = 'ffans-geetest';

    private static function generateConfigKeys(): array
    {
        $reflectionClass = new ReflectionClass(ContextEvent::class);
        $contextEvents = array_values($reflectionClass->getConstants());

        $configKeys = [];

        foreach ($contextEvents as $event) {
            $configKeys[$event] = [
                "$event.product",
                "$event.id",
                "$event.key"
            ];
        }

        $configKeys['default'] = ['product_service', 'product', 'id', 'key'];

        return $configKeys;
    }

    public static function isExtensionSetup(SettingsRepositoryInterface $settings, string $type = 'default'): bool
    {
        $configKeys = self::generateConfigKeys();
        $key = $configKeys[$type] ?? $configKeys['default'];
        return !self::isNil($settings, $key);
    }

    private static function isNil(SettingsRepositoryInterface $settings, array $keys)
    {
        $flag = false;
        foreach ($keys as $key) {
            $flag = trim($settings->get(self::getSettingPath($key), '')) === '';
            if ($flag) break;
        }
        return $flag;
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

    /**
     * @param string $message
     * @param mixed $details
     */
    public static function logError(string $message, $details = null)
    {
        resolve('log')->error('[FFans\GeeTest] ' . $message);
        $details && resolve('log')->error(var_export($details, true));
    }

    /**
     * @param string $message
     * @param mixed $details
     */
    public static function logInfo(string $message, $details = null)
    {
        resolve('log')->info('[FFans\GeeTest] ' . $message);
        $details && resolve('log')->info(var_export($details, true));
    }

    public static function translate(string $key)
    {
        return resolve('translator')->trans(self::PREFIX . '.' . $key);
    }
}
