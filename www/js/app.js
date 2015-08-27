// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
moment.locale('pt_BR');

angular.module('starter', ['ionic', 'ionicLazyLoad', 'starter.controllers', 'ngCordova'])

	.run(function (FeederService, $ionicPlatform, $cordovaAdMob, $cordovaNetwork, $rootScope, $ionicHistory, $ionicSideMenuDelegate) {
        ionic.Platform.ready(function () {
			var isOnline = true /*$cordovaNetwork.isOnline()*/, isWifi = true/*$cordovaNetwork.getNetwork() === 'wifi' ? true : false*/ ;

			if(typeof AdMob !== 'undefined' && isOnline){
				$cordovaAdMob.createBannerView( {
					adId: admobid.banner, 
					position: AdMob.AD_POSITION.BOTTOM_CENTER, 
					autoShow: true
				});
			}

			if (window.StatusBar) { // org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			$rootScope.$on('$stateChangeSuccess',
				function(){
					if($ionicSideMenuDelegate.isOpen()){
						$ionicSideMenuDelegate.toggleLeft();
					}
				})
		});
	})

    .service('DB', ['$q', function($q){
        var deferred = $q.defer();
        var _db = new PouchDB('feeds', {adapter: 'websql'});
        var _remote = new PouchDB('https://feeeder.iriscouch.com/feeds');

        _db.updateRemote = updateRemote;
        _db.replicate.from(_remote).on('complete', function () {
            $q.all(_db.createIndex({
                index: {
                    fields: ['type']
                }
            }), _db.createIndex({
                index: {
                    fields: ['type', 'favorite']
                }
            })).then(function(){
                deferred.resolve(_db);
            }, function(){
                deferred.resolve(_db);
            });
        }).on('error', function(){
            deferred.resolve(_db);
        })

        return deferred.promise;

        function updateRemote(){
            var deferred = $q.defer();
            _db.replicate.to(_remote).on('complete', function (event) {
                console.dir(event);
            })
            return deferred.promise;
        }
    }])

    .factory('FeederService', ['$http', '$q', 'DB', function ($http, $q, DB) {
        var _feeds, _db = DB, ping = addFeeds(feeds);

        return {
            getFeed: getFeed,
            getFeeds: getFeeds,
            addFeeds: addFeeds,
            updateFeed: updateFeed,
            deleteFeed: deleteFeed
        };

        function whenUnblocked(){
            return ping;
        }

        function addFeeds(feeds) {
            return _db.then(function(db){
                return $q.when(concatFeeds(feeds).then(function(data){
                    return db.bulkDocs(data);
                }).then(function(items) {
                    db.updateRemote();
                    return items;
                }));
            })
        }

        function updateFeed(feed) {
            return whenUnblocked().then(function(){
                return _db;
            }).then(function(db){
                return $q.when(db.put(feed));
            });
        }

        function deleteFeed(feed) {
            return whenUnblocked().then(function(){
                return _db;
            }).then(function(db){
                return $q.when(db.remove(feed));
            });
        }

        function getFeed(id){
            return whenUnblocked().then(function(){
                return _db;
            }).then(function(db) {
               return $q.when(db.get(id));
            });
        }

        function getFeeds(opts) {
            var selector = {type: {$eq: 'feed'}, _id: {$exists: true}};
            if(opts.favorites) {
                selector.favorite = {$exists: true};
            }
            return whenUnblocked().then(function(){
                return _db;
            }).then(function(db) {
                return $q.when(db.find({
                    selector: selector,
                    skip: opts.skip,
                    limit: opts.limit,
                    sort: [{'_id': 'desc'}]
                })).then(function (res) {
                    if(!_feeds){
                        // Listen for changes on the database.
                        db.changes({live: true, since: 'now', include_docs: true})
                            .on('change', onDatabaseChange);
                    }

                    _feeds = res.docs;

                    return _feeds;
                });
            });
        };

        function onDatabaseChange(change) {
            var index = findIndex(_feeds, change.id);
            var feed = _feeds[index];

            if (change.deleted) {
                if (feed) {
                    _feeds.splice(index, 1); // delete
                }
            } else {
                if (feed && feed._id === change.id) {
                    _feeds[index] = change.doc; // update
                } else {
                    _feeds.splice(index, 0, change.doc) // insert
                }
            }
        }

        function findIndex(array, id) {
            var low = 0, high = array.length, mid;
            while (low < high) {
                mid = (low + high) >>> 1;
                array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
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
                        date: date,
                        type: 'feed'
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

    .service('Timeline', ['FeederService', '$ionicLoading', '$q', function(FeederService, $ionicLoading, $q){
        return function(opts) {
            var svc = {}, _feeds = [], pag = 0, limit = 15;
            opts = opts || {};

            $ionicLoading.show({
                template: 'Carregando tirinhas...'
            });

            svc.data = _feeds;
            svc.loadMore = loadMore;
            svc.canLoad = canLoad;

            function loadMore() {
                var pagination = {
                    skip: pag * limit,
                    limit: limit
                };
                return $q.when(FeederService.getFeeds(_.assign(pagination, opts)).then(function (docs) {
                    $ionicLoading.hide();
                    angular.copy(_.union(svc.data, docs), svc.data);
                    pag++;

                    return docs;
                }));
            }

            function canLoad() {
                return pag < 5;
            }

            return svc;
        }
    }])

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

	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        if(!ionic.Platform.isIOS()) $ionicConfigProvider.scrolling.jsScrolling(false);

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
                cache: false,
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
	});