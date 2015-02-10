// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
moment.locale('pt_BR');

angular.module('starter', ['ionic', 'ionicLazyLoad', 'starter.controllers', 'ngCordova', 'pouchdb'])
	.run(function ($ionicPlatform, $cordovaAdMob, $rootScope, $ionicHistory, $ionicSideMenuDelegate, pouchDB, Feeder) {
		$ionicPlatform.ready(function () {
			var isOnline = true;

			if(typeof AdMob !== 'undefined' && isOnline){
				$cordovaAdMob.createBannerView( {
					adId: admobid.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true
				});
			}
			var db = pouchDB('feeds');

			if (window.StatusBar) { // org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			var favoritesView = {
				_id: '_design/favorites',
				views: {
					'favorites': {
						map: function (doc) { emit(doc.favorite); }.toString()
			 		}
				}
			};

			var feedsView = {
				_id: '_design/feeds',
				views: {
					'feeds': {
						map: function (doc) { emit(doc._id); }.toString()
			 		}
				}
			}

			db.put(favoritesView);
			db.put(feedsView);

			if(isOnline){
				Feeder.insert(feeds).then(function(data){
					$rootScope.$broadcast('insertComplete', true);
					if(navigator.splashscreen) {
						navigator.splashscreen.hide();
					}
				});
			} else {
				$rootScope.$broadcast('insertComplete', true);
				if(navigator.splashscreen) {
					navigator.splashscreen.hide();
				}
			}

			$rootScope.$on('$stateChangeSuccess',
				function(){
					if($ionicSideMenuDelegate.isOpen()){
						$ionicSideMenuDelegate.toggleLeft();
					}
				})
		});
	})

	.factory('Feeder', ['pouchDB', '$q', '$http', function(pouchDB, $q, $http){
		return {
			insert: insert,
			parseFeed: parseFeed
		}

		function insert (feeds) {
			var deferred = $q.defer(), db = pouchDB('feeds');

			concatFeeds(feeds).then(function(data){
				db.bulkDocs(data).then(function(items) {
					deferred.resolve(items);
				});
			});

			return deferred.promise;
		}

		function concatFeeds(feeds) {
			var deferred = $q.defer(), items = [];

			for(var i = 0, len = feeds.length; i<len; i++){
				var j = 0;
				retrieveFeeds(feeds[i].url).then(function(data){
					j++;
					items = items.concat(data);

					if(j == len){
						deferred.resolve(items);
					}
				});
			}

			return deferred.promise;
		}

		function retrieveFeeds(feed){
			var deferred = $q.defer(), items = [];

			parseFeed(feed).then(function (res) {
				var tam = res.data.responseData.feed.entries.length;

				for(var j = 0; j < tam; j++){
					var e = res.data.responseData.feed.entries[j];
					var date = moment(new Date(e.publishedDate)).format();

					var imgSrc = searchXml('<div>'+e.content+'</div>', 'img').attr('src');
					var image = imgSrc ? (imgSrc.slice(0,2) == '//' || imgSrc.slice(0,7) == 'http://' || imgSrc.slice(0,8) == 'https://' ? (imgSrc.slice(0,2) == '//' ? 'http:'+imgSrc : imgSrc) : res.data.responseData.feed.link + '/' + imgSrc) : '';

					var feedItem = {
						_id: date,
						publisher: res.data.responseData.feed.title,
						link: e.link,
						content: e.content,
						description: e.contentSnippet,
						title: e.title,
						image: image,
						category: e.categories[0],
						date: date
					};

					items.push(feedItem);
				};

				if(items.length == tam){
					deferred.resolve(items);
				}
			});

			return deferred.promise;
		}

		function parseFeed(url) {
			return $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
		}

		function searchXml(xmlStr, selector) {
			var parser, xmlDoc;
			if(window.DOMParser) {
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlStr, "text/xml");
			} else {
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlStr);
			}
			return angular.element(xmlDoc).find(selector).eq(0);
			}
	}])

	.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);

		$stateProvider
			.state('news', {
				url: "/news",
				views: {
					'appContent': {
						templateUrl: "templates/news.html",
						controller: 'NewsCtrl'
					}
				}
			})

			.state('favorites', {
				url: "/favorites",
				views: {
					'appContent': {
						templateUrl: "templates/favorites.html",
						controller: 'FavoritesCtrl'
					}
				}
			})

			.state('new', {
				url: "/new/:id",
				views: {
					'appContent': {
						templateUrl: "templates/new.html",
						controller: 'NewCtrl'
					}
				}
			});

			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/news');
	})

	.directive('compile', ['$compile', function ($compile) {
		return function(scope, element, attrs) {
			scope.$watch(
				function(scope) {
					// watch the 'compile' expression for changes
					return scope.$eval(attrs.compile);
				},
				function(value) {
					// when the 'compile' expression changes
					// assign it into the current DOM
					element.html(value);

					// compile the new DOM and link it to the current
					// scope.
					// NOTE: we only compile .childNodes so that
					// we don't get into infinite loop compiling ourselves
					$compile(element.contents())(scope);
				}
			);
		};
	}])