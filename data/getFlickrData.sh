#!/bin/sh
wget "https://www.flickr.com/services/feeds/photos_public.gne?id=127084029@N05&lang=it-it&format=json" -O - | sed "s/\\\'/'/g" | sed "s/jsonFlickrFeed(//g" | sed "s/})/}/g" > /home/italiasicura/web/data/flickr.json
