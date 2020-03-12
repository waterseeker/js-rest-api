# js-rest-api

This is an exercise in creating a node/express API that has grown out of a code challenge for a job application. 
Basic instructions were to create a RESTful API using node/express with no frontend.
There are Users and Articles. 
There is a in-memory database.
There needed to be token-based authentication using uuid.
Users should be able to hit the authenticate endpoint multiple times and generate a valid token each time. 
    A new token does not invalidate older ones. 
Articles should have 3 access levels - 
    visibility settings:
    public - The article is available to everyone.
    private - The article is only accessible to the author.
    logged_in - The article is only accessible to users with a valid session.

The API should support the following calls:

    /api/user 
        POST - add a user to the database.
            Request Body(JSON):
                user_id: string
                login: string
                password: string
            Response
                HTTP 400, if the body is empty
                HTTP 201, if the user has been created. The response body can be empty.

    /api/authenticate
        POST - authenticate a user
            Request Body(JSON):
                login: string
                password: string  
            Response:
                HTTP 400, if the body is empty.
                HTTP 404, if there is no user of the given login name in the database
                HTTP 401, if a user with the given login name exists, but the password does not 
                    match that saved in the database for the corresponding user
                HTTP 200, if a user with the given login name exists and the given password matches
                    that saves in the database. The response body should be in the shape of:
                        {
                            "token": "<uuid>"
                        }
    
    /api/logout 
        POST - logs the user out. Requires a token in the request's headers.
            Response:
                HTTP 401, if the token is invalid
                HTTP 200, if the user is logged out successfully. The token that was passed
                    on becomes invalid. 

    /api/articles
        POST - creates an article consisting of title, content, and visibility (public, private, or logged_in).
            Only an authenticated user can create articles.
            Request Body(JSON):
                article_id: string
                title: string
                content: string
                visibility: 'public' | 'private' | 'logged_in':
                    public - the article is available publicly
                    private - the article is only accessible to the creator
                    logged_in - only users with a valid session can access the article        
            Response:
                HTTP 400, if the body is empty
                HTTP 401, if the provided token is invalid
                HTTP 201, if the article has been created. The response body can be empty.
        GET - returns a list of articles. The result depends on the token. 
            Response: 
                HTTP 200, if a valid token is given in the request's headers return:
                    *  all public articles
                    *  all articles with visibility: 'logged_in'
                    *  the sender's articles
                    otherwise return only public articles.
                    An article object consists of:
                        article_id, title, content, and user_id which are all strings
                        and the visibility field which is public, private, or logged_in
                    The articles can appear in any order
        
    *** Additional Requirements and Notes ***
    1. Added content should be kept in memory. There is no database/storage back end available.
    2. The token should be added as an authentication-header header to a request, wherever applicable
    3. A token is associated with a user. It is considered to be invalid if the token was used to log
        the user out, or if it has never been created as a result of loggin the user in.
    4. A user can have multiple valid tokens. Sending two consecutive login 
        requests can be completed successfully, and the token returned by the first request does not 
        become invalid as a result of the second request.
    5. The body of a response with a status codes 400-499 can be empty. 
    6. HTTP 5xx error codes are considered errors and must no be returned.
    7. The default export should be an http.Server object that is returned by app.listen().
    8. Assume that the following packages are supported:
        * uuid, version 3.3.2
        * lodash, version 4.17.11

Input guarantees

For simplicity, assume the following to be true
    * users have a unique id and login - the server will never receive two POST /api/user requests
        with the same id or login.
    * articles, likewise, also have a unique id
    * the content-type header will be set to application/json in ever such POST request
    * all strings passed on in request bodies are non-empty
    * id strings(along with other strings) are any string from 1 to 100 characters. 

Additional examples

Example 1

If you add a user like this:
{ "user_id": "1", "login": "user1", "password": "password1" }
and then call POST /api/authenticate with the same login and password, the response would look something like:
{ "token": "41f12014-eca7-4d71-9f57-218d294710c0" }

Example 2

If the user from Example 1 creates the following articles:
{ "article_id": "art1", "title": "title1", "content": "c1", "visibility": "public" }
{ "article_id": "art2", "title": "title2", "content": "c2", "visibility": "private" }
{ "article_id": "art3", "title": "title3", "content": "c3", "visibility": "logged_in" }
then called GET /api/articles(with no token passed on as a request's header) gives only one article object:
[{ "article_id": "art1", "title": "title1", "content": "c1", "visibility": "public", "user_id": "1" }]

With a valid token passed on as the authentication-header header, all 3 article objects should be returned. 

Then, if you then:
    * create a new user
    * log the user in
    * call the GET /api/articles request again with a new token

we should expect the following result
[
    { "article_id": "art1", "title": "title1", "content": "c1", "visibility": "public", "user_id": "1" },
    { "article_id": "art3", "title": "title3", "content": "c3", "visibility": "logged_in", "user_id": "1" }
]

Example 3
An example of the headers in a POST request sent to the /api/articles endpoint:

{
    "content-type": "application/json".
    "authentication-header": "41f12014-eca7-4d71-9f57-218d294710c0"
}