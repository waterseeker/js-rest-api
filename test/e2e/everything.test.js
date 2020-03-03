import http from 'http';
import test from 'ava';
import got, { HTTPError } from 'got';
import listen from 'test-listen';
import app from '../../src/app';

test.before(async t => {
    t.context.server = http.createServer(app);
    t.context.baseUrl = await listen(t.context.server);
});

test.after.always(t => {
    t.context.server.close();
});

test.serial('POST /api/user - empty body gets 400', async t => {
    await t.throwsAsync(
        got.post('api/user', {
            prefixUrl: t.context.baseUrl,
            json: true
        }),
        {
            instanceOf: HTTPError,
            message: 'Response code 400 (Bad Request)'
        }
    );
});

test.serial('POST /api/user - valid request gets 201', async t => {
    const { statusCode } = await got.post('api/user', {
        prefixUrl: t.context.baseUrl,
        json: {
            user_id: '43',
            login: 'user1',
            password: 'password1'
        }
    });
    t.is(statusCode, 201);
});

test.serial('POST /api/authenticate - empty body gets 400', async t => {
    await t.throwsAsync(
        got.post('api/authenticate', {
            prefixUrl: t.context.baseUrl,
            json: true
        }),
        {
            instanceOf: HTTPError,
            message: 'Response code 400 (Bad Request)'
        }
    );
});

test.serial('POST /api/authenticate - no user gets 404', async t => {
    await t.throwsAsync(
        got.post('api/authenticate', {
            prefixUrl: t.context.baseUrl,
            json: {
                login: 'DOESNOTEXIST',
                password: 'DOESNOTEXIST'
            }
        }),
        {
            instanceOf: HTTPError,
            message: 'Response code 404 (Not Found)'
        }
    );
});

test.serial(
    "POST /api/authenticate - password doesn't match gets 401",
    async t => {
        await t.throwsAsync(
            got.post('api/authenticate', {
                prefixUrl: t.context.baseUrl,
                json: {
                    login: 'user1',
                    password: 'DoesNotMatch'
                }
            }),
            {
                instanceOf: HTTPError,
                message: 'Response code 401 (Unauthorized)'
            }
        );
    }
);

test.serial(
    'POST /api/authenticate and POST /api/logout - valid requests get 200',
    async t => {
        const { statusCode, body } = await got.post('api/authenticate', {
            prefixUrl: t.context.baseUrl,
            json: {
                login: 'user1',
                password: 'password1'
            },
            responseType: 'json'
        });

        t.is(statusCode, 200);
        t.log('POST /api/authenticate succeeded');

        // Regex test blindly taken from https://gist.github.com/bugventure/f71337e3927c34132b9a
        t.regex(
            body.token,
            /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
        );

        const { statusCode: logoutStatusCode } = await got.post('api/logout', {
            prefixUrl: t.context.baseUrl,
            headers: {
                'authentication-header': body.token
            }
        });

        t.is(logoutStatusCode, 200);
        t.log('POST /api/logout succeeded');
    }
);

test.serial('POST /api/logout - invalid token gets 401', async t => {
    await t.throwsAsync(
        got.post('api/logout', {
            prefixUrl: t.context.baseUrl,
            headers: {
                'authentication-header': 'invalid-12345'
            }
        }),
        {
            instanceOf: HTTPError,
            message: 'Response code 401 (Unauthorized)'
        }
    );
});

test.serial('POST /api/articles - empty body gets 400', async t => {
    await t.throwsAsync(
        got.post(
            'api/articles',
            {
                prefixUrl: t.context.baseUrl,
                headers: {
                    'authentication-header': 'invalid-12345'
                }
            },
            {
                instanceOf: HTTPError,
                message: 'Response code 400 (Bad Request)'
            }
        )
    );
});

test.serial('POST /api/articles - invalid token gets 401', async t => {
    await t.throwsAsync(
        got.post(
            'api/articles',
            {
                prefixUrl: t.context.baseUrl,
                headers: {
                    'authentication-header': 'invalid-12345'
                },
                json: {
                    article_id: 'string',
                    title: 'string',
                    content: 'string',
                    visibility: 'public'
                }
            },
            {
                instanceOf: HTTPError,
                message: 'Response code 401 (Unauthorized)'
            }
        )
    );
});

test.serial('POST /api/articles - valid request gets 201', async t => {
    const {
        body: { token }
    } = await got.post('api/authenticate', {
        prefixUrl: t.context.baseUrl,
        json: {
            login: 'user1',
            password: 'password1'
        },
        responseType: 'json'
    });

    const { statusCode } = await got.post('api/articles', {
        prefixUrl: t.context.baseUrl,
        headers: {
            'authentication-header': token
        },
        json: {
            article_id: 'string',
            title: 'string',
            content: 'string',
            visibility: 'public'
        }
    });

    t.is(statusCode, 201);
});

test.serial('GET /api/articles - unauthenticated returns public articles', async t => {
    const {statusCode, body} = await got('api/articles', {
        prefixUrl: t.context.baseUrl,
        responseType: 'json'
    });

    t.is(statusCode, 200);
    t.deepEqual(body.sort(), [
        {content: 'here is some content 1', visibility:'public', author:'42', title:'testArticle1', article_id:'articleid1'},
        {content: 'here is some content 6', visibility:'public', author:'42', title:'testArticle6', article_id:'articleid6'}
    ])
})

test.serial('GET /api/articles - authenticated returns private articles', async t => {
    const {
        body: { token }
    } = await got.post('api/authenticate', {
        prefixUrl: t.context.baseUrl,
        json: {
            login: 'user1',
            password: 'password1'
        },
        responseType: 'json'
    });
    
    const {statusCode, body} = await got('api/articles', {
        prefixUrl: t.context.baseUrl,
        headers: {
            'authentication-header': token
        },
        responseType: 'json'
    });

    t.is(statusCode, 200);
    t.deepEqual(body.sort(), [
        {content: 'here is some content 1', visibility:'public', author:'42', title:'testArticle1', article_id:'articleid1'},
        {content: 'here is some content 3', visibility:'logged_in', author:'42', title:'testArticle3', article_id:'articleid3'},
        {content: 'here is some content 4', visibility:'private', author:'43', title:'testArticle4', article_id:'articleid4'},
        {content: 'here is some content 5', visibility:'logged_in', author:'42', title:'testArticle5', article_id:'articleid5'},
        {content: 'here is some content 6', visibility:'public', author:'42', title:'testArticle6', article_id:'articleid6'}
    ])
})
