# js-rest-api

This is an exercise in creating a node/express API that has grown out of a code challenge for a job application. 
Basic instructions were to create a RESTful API using node/express with no frontend.
There are Users and Articles. 
There needed to be token-based authentication using uuid.
Users should be able to hit the authenticate endpoint multiple times and generate a valid token each time. 
    A new token does not invalidate older ones. 
Articles should have 3 access levels - public (anyone can see), private(only authenticated users can see), protected(only the author can see).