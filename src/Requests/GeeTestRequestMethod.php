<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest\Requests;

use Exception;
use FFans\GeeTest\Utils;
use Flarum\Settings\SettingsRepositoryInterface;
use Throwable;

class CaptchaArgs
{
    public string $used_type;
    public string $user_ip;
    public string $lot_number;
    /**
     * @var string the context or event of your CAPTCHA
     */
    public string $scene;
    public string $referer;
}

class ResponseSuccessOrFail
{
    /**
     * @var string request status
     */
    public string $status;
    /**
     * @var string double check result
     */
    public string $result;
    /**
     * @var string double check result descriptions
     */
    public string $reason;
    /**
     * @var CaptchaArgs validation output parameters
     */
    public CaptchaArgs $captcha_args;
}

class Desc
{
    public string $type;
}

class ResponseError
{
    /**
     * @var string request status
     */
    public string $status = 'error';
    /**
     * @var string error code
     */
    public string $code;
    /**
     * @var string error message
     */
    public string $msg;
    /**
     * @var Desc error descriptions
     */
    public Desc $desc;
}

class GeeTestRequestMethod
{
    const HTTP_TIMEOUT_DEFAULT = 5; // 单位：秒
    const VERIFY_URL_V3 = 'http://api.geetest.com/validate';
    const VERIFY_URL_V4 = 'http://gcaptcha4.geetest.com/validate';
    protected array $result;
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    private string $captchaKey;
    private array $params = ['captcha_id' => '', 'lot_number' => '', 'pass_token' => '', 'gen_time' => '', 'captcha_output' => '',];

    public function __construct(array $params, string $contextEvent, SettingsRepositoryInterface $settings)
    {
        $this->params = $params;
        $this->settings = $settings;
        $standalone = Utils::getSetting($settings, $contextEvent . '.' . 'standalone');
        $this->captchaKey = $standalone ? Utils::getSetting($settings, $contextEvent . '.' . 'key') : Utils::getSetting($settings, 'key');
    }

    /**
     * 发送GET请求，获取服务器返回结果
     */
    private function httpGet($url, $params)
    {
        $url .= '?' . http_build_query($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, self::HTTP_TIMEOUT_DEFAULT); // 设置连接主机超时（单位：秒）
        curl_setopt($ch, CURLOPT_TIMEOUT, self::HTTP_TIMEOUT_DEFAULT); // 允许 cURL 函数执行的最长秒数（单位：秒）
        curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacert.pem');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);
        return $res;
    }

    /**
     * 发送POST请求，获取服务器返回结果
     */
    private function httpPost($url, $params, $headers = [])
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, self::HTTP_TIMEOUT_DEFAULT); // 设置连接主机超时（单位：秒）
        curl_setopt($ch, CURLOPT_TIMEOUT, self::HTTP_TIMEOUT_DEFAULT); // 允许 cURL 函数执行的最长秒数（单位：秒）
        curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacert.pem');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(['Content-type' => 'application/x-www-form-urlencoded'], $headers));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (strcmp($httpCode, '200') != 0) {
            $res = false;
        }

        return $res;
    }

    public function doubleCheck()
    {
        try {
            $params = array_merge(
                $this->params, [
                    'sign_token' => $this->getSignature(),
                ]
            );
            $resBody = $this->httpPost(self::VERIFY_URL_V4 . '?captcha_id=' . $this->params['captcha_id'],
                $params,
                ['Content-Type' => 'application/x-www-form-urlencoded']
            );

            if (!$resBody) {
                throw new Exception('request geetest api fail');
            }

            $this->result = json_decode($resBody, true);
            Utils::logInfo('doubleCheck: typeof=' . gettype($this->result) . ' key=' . $this->captchaKey . ' body=' . json_encode($this->result, JSON_FORCE_OBJECT));

        } catch (Throwable $e) {
            $this->result = [
                'result' => 'error',
                'reason' => 'request geetest api fail'
            ];

            Utils::logInfo('doubleCheck() Error: typeof=' . gettype($this->result) . ' key=' . $this->captchaKey . ' params=' . var_export($params, true) . ' reason=' . $this->result['reason'], $e->getMessage());
        } finally {
            return $this;
        }
    }

    private function getSignature()
    {
        return hash_hmac('sha256', $this->params['lot_number'], $this->captchaKey);
    }

    public function isSuccess()
    {
        return strcmp($this->result['result'], 'success') == 0;
    }

    public function isFail()
    {
        return strcmp($this->result['result'], 'fail') == 0;
    }

    public function isError()
    {
        return (strcmp($this->result['result'], 'error') == 0) || strcmp($this->result['status'], 'error') == 0;
    }


    public function getResult()
    {
        return $this->result;
    }
}
