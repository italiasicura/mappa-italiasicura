<?php
/*$apiKey = '';
$userID = '';*/
/*$url = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key='.$apiKey.'&user_id='.$userID.'&format=json';*/
$url = 'https://api.flickr.com/services/feeds/photos_public.gne?id=127084029@N05&lang=en-us&format=json&nojsoncallback=1';

$options = Array('http' => Array('method' => 'GET'));
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
/*$res = json_decode($response);
print_r($response);*//*
echo json_encode($res['jsonFlickrFeed']);*/
header('Content-Type: application/json');
echo $response;