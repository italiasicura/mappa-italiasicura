(function (angular) {
'use strict';	

	angular.module('ngTwitter', ['ngSanitize'])	
		// TWEET LINKIFIER
		.service('linkify', function() {
 
			function escapeHTML(text) {
				return angular.element('<div/>').text(text).html();
			}
 
			return {
				linkify_entities: function(tweet) {
					if (!(tweet.entities)) {
						return escapeHTML(tweet.text);
					}
					// This is very naive, should find a better way to parse this
					var index_map = {};
					angular.forEach(tweet.entities.urls, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='"+escapeHTML(entry.url)+"' class='link' target='_blank'>"+escapeHTML(entry.display_url)+"</a>";}];
					});
					angular.forEach(tweet.entities.hashtags, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='http://twitter.com/search?q=%23"+escapeHTML(entry.text)+"' class='hash' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					angular.forEach(tweet.entities.user_mentions, function(entry,i) {
						index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a title='"+escapeHTML(entry.name)+"' href='http://twitter.com/"+escapeHTML(entry.screen_name)+"' class='mention' target='_blank'>"+escapeHTML(text)+"</a>";}];
					});
					var result = "";
					var last_i = 0;
					var i = 0;
					// iterate through the string looking for matches in the index_map
					for (i=0; i < tweet.text.length; ++i) {
						var ind = index_map[i];
						if (ind) {
							var end = ind[0];
							var func = ind[1];
							if (i > last_i) {
								result += escapeHTML(tweet.text.substring(last_i, i));
							}
							result += func(tweet.text.substring(i, end));
							i = end - 1;
							last_i = end;
						}
					}
					if (i > last_i) {
						result += escapeHTML(tweet.text.substring(last_i, i));
					}
					return result;
				}
			};
		})
		// TWEETER PROXY SERVICE
		.service('twitter', ['$http', function (http) {			
			return {
				asyncSearch: function(hashtag, since) {	
					var cfg = {	};				
					var paramSince = since ? '&since_id='+ since : '';					
					// should add 'since' but not there because of mock					
					//var queryUrl = '/search?hashtag='+hashtag+paramSince;

					// YOUR SERVICE CALL : manage auth and search on server side
					/*var queryUrl = '/search?hashtag='+hashtag;*/
					var queryUrl = '/data/twittersearch.php';
					var promise = http.get(queryUrl, cfg).then(function (response) {
						return response;
					});
					return promise;
				}				
			};
        }])
		// DIRECTIVE
		.directive('tweets', ['$timeout', 'twitter', 'linkify', function(timeout, twitter, linkify) {
			return {
				restrict : 'AE',
				scope: { hashtag: '=', refresh:'@', button:'@', hash:'@', count:'@'},
				template:
					/*'<div class="panel" ng-show="button">' +
						'<button name="start" ng-click="startTimeout()" ng-show="stop">start</button>' +
						'<button name="stop" ng-click="stopTimeout()" ng-show="!stop">stop</button>' +
						' Refreshing in {{counter}}' +
					'</div>' +
					'<div class="panel" ng-show="hash">' +
						'<input type="text" name="input" ng-model="hashtag">' +
					'</div>' +*/
					'<ul class="tweetFavList">'+ 
						'<li ng-repeat="tweet in tweets" on-finish-render="sliderstart">' +
                            '<i class="fa fa-twitter fa-2x"></i><span class="username"><a href="https://twitter.com/italia_sicura" target="_blank">{{tweet.user.screen_name}}</a></span>' +
                            /*'<p>' +

							'{{tweet.text}}' +
                            '<p>' +*/
                    '<p ng-bind-html="prettyDisplay(tweet)"><p>' +
					'</li></ul>',
				link : function(scope, element, attrs) {
					var service = twitter;
					var since_id;
					var init = false;
					var bearer;
					var refresh = scope.refresh ? scope.refresh : 60;
					var count = scope.count ? scope.count : undefined;
					scope.counter = refresh;
					scope.stop = false;
					scope.tweets = [];	

					scope.init = function() {
						// HANDLE SERVER SIDE
						init = true;
						scope.search();
					};

					scope.onTimeout = function() {
						scope.search();
						mytimeout = timeout(scope.onTimeout,refresh*1000);
					};

					scope.onTimeoutCounter = function() {
						scope.counter--;						
						mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);
					};

					var mytimeout = timeout(scope.onTimeout,refresh*1000);
					var mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);

					scope.stopTimeout = function() {
						scope.counter = refresh;
						scope.stop = true;
						timeout.cancel(mytimeout);
						timeout.cancel(mytimeoutcounter);
					};

					scope.startTimeout = function() {
						scope.stop = false;
						mytimeout = timeout(scope.onTimeout,refresh*1000);
						mytimeoutcounter = timeout(scope.onTimeoutCounter,1000);
					};


					scope.search = function() {
						service.asyncSearch(scope.hashtag, since_id).then(function(d) {
							scope.counter = refresh;
							if (d.data.errors)
							{
								//console.log(d.data.errors[0]);
								return;
							}								
							if (d && d.data && d.data.statuses) {
								scope.tweets = d.data.statuses;
								if (count)
									scope.tweets = scope.tweets.slice(0, count);
								since_id = d.data.search_metadata.since_id;
							}
						});
					};

					scope.prettyDisplay = function(tweet) {
						return linkify.linkify_entities(tweet);
					};

					scope.init();
				}
			};
		}]);
})(angular);
