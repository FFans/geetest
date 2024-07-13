<?php

/*
 * This file is part of ffans/geetest.
 *
 * Copyright (c) 2024 Golden.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace FFans\GeeTest\Api\Controller;

use FFans\GeeTest\Validators\GeeTestValidator;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TestGeeTestController implements RequestHandlerInterface
{
    /**
     * @var GeeTestValidator
     */
    protected $validator;

    public function __construct(GeeTestValidator $validator)
    {
        $this->validator = $validator;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);

        $actor->assertAdmin();

        $data = $request->getParsedBody();

        $this->validator->assertValid([
            'geetest' => Arr::get($data, 'ffans-geetest-result', ''),
        ]);

        return new EmptyResponse();
    }
}
