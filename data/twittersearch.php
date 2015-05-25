<?php
require('../library/TwitterAPIExchange.php');

header('Content-Type: application/json');

$oauth_access_token = getenv("TW_OAUTH_ACCESS_TOKEN");
$oauth_access_token_secret = getenv("TW_OAUTH_ACCESS_TOKEN_SECRET");
$consumer_key = getenv("TW_CONSUMER_KEY");
$consumer_secret = getenv("TW_CONSUMER_SECRET");

$settings = array(
    'oauth_access_token' => $oauth_access_token,
    'oauth_access_token_secret' => $oauth_access_token_secret,
    'consumer_key' => $consumer_key,
    'consumer_secret' => $consumer_secret
);

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=%23italiasicura%20-scuole%20-scuola%20-Angelis+from:italia_sicura';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
$response = $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

echo $response;
