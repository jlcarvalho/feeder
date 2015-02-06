angular.module('starter.controllers', [])

	.controller('AppCtrl', ['$scope',function ($scope) {
			$scope.colorClass = colorClass;
	}])

	.controller('NewsCtrl', ['pouchDB', '$scope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicLoading',
		function (pouchDB, $scope, $state, $stateParams, $ionicSideMenuDelegate, $ionicLoading) {
			$ionicLoading.show({
				template: 'Carregando tirinhas...'
			});

			$scope.$on('insertComplete', function(){
				getAll(0);
			});

			var pag = 0, limit = 10, db = pouchDB('feeds');

			$scope.news = [];

			$scope.loadMore = loadMore;
			$scope.canLoad = canLoad;
			$scope.firstLoad = firstLoad;
			$scope.toggleLeft = toggleLeft;

			function getAll(p){
				p = p || pag;
				db.query('feeds', {include_docs: true, skip: p*limit, limit : limit, descending : true}).then(function (data) {
					$ionicLoading.hide();
					$scope.news = $scope.news.concat(_.pluck(data.rows, 'doc'));
					pag++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
			}

			function loadMore(){
				getAll(pag);
			}

			function canLoad(){
				return pag < 5;
			}

			function firstLoad(){
				return pag > 0;
			}

			function toggleLeft() {
				$ionicSideMenuDelegate.toggleLeft();
			};
	}])

	.controller('FavoritesCtrl', ['Feeder', 'pouchDB', '$scope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicLoading',
		function (Feeder, pouchDB, $scope, $state, $stateParams, $ionicSideMenuDelegate, $ionicLoading) {
			$ionicLoading.show({
				template: 'Carregando...'
			});

			var pag = 0, limit = 10, db = pouchDB('feeds');

			$scope.news = [];
			$scope.stop = false;

			$scope.loadMore = loadMore;
			$scope.canLoad = canLoad;
			$scope.noMore = noMore;
			$scope.toggleLeft = toggleLeft;

			function getAll(p){
				p = p || pag;
				db.query('favorites', {key: true, include_docs: true, skip: p*limit, limit : limit, descending : true}).then(function (data) {
					$ionicLoading.hide();
					if(data.rows.length === 0) {
						$scope.stop = true;
					} else {
						$scope.news = $scope.news.concat(_.pluck(data.rows, 'doc'));
					}
					pag++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
			}

			function loadMore(){
				getAll(pag);
			}

			function canLoad(){
				return pag < 5;
			}

			function noMore(){
				return $scope.news.length === 0;
			}

			function toggleLeft() {
				$ionicSideMenuDelegate.toggleLeft();
			};
	}])

	.controller('NewCtrl', ['Feeder', '$scope', '$timeout', '$stateParams', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaNetwork', '$cordovaInAppBrowser', 'pouchDB', '$ionicLoading',
		function (Feed, $scope, $timeout, $stateParams, $ionicPlatform, $cordovaSocialSharing, $cordovaNetwork, $cordovaInAppBrowser, pouchDB, $ionicLoading) {
			$scope.colorClass = colorClass;
			$ionicLoading.show({
				template: 'Carregando...'
			});

			var db = pouchDB('feeds');

			$scope.item = {};
			$scope.favorite = false;

			$scope.addToFavorites = addToFavorites;
			$scope.share = share;
			$scope.formatDate = formatDate;
			$scope.openInBrowser = openInBrowser;
			$scope.showImage = true /*$cordovaNetwork.getNetwork() === 'wifi' ? true : false*/;

			(function(){
				$ionicPlatform.ready(function() {
					db.get($stateParams.id).then(function(item){
						$scope.item = item;
						$scope.favorite = angular.isDefined(item.favorite) ? item.favorite : $scope.favorite ;

						// Find all YouTube videos
						var $allVideos = angular.element("iframe[src^='http://www.youtube.com'], iframe[src^='https://www.youtube.com']"),

						// The element that is fluid width
						$fluidEl = angular.element("#content");

						// Figure out and save aspect ratio for each video
						$allVideos.each(function() {

							angular.element(this)
								.data('aspectRatio', this.height / this.width)

								// and remove the hard coded width/height
								.removeAttr('height')
								.removeAttr('width');

						});

						// When the window is resized
						angular.element(window).resize(function() {

							var newWidth = $fluidEl.width();

							// Resize all videos according to their own aspect ratio
							$allVideos.each(function() {

								var $el = angular.element(this);
								$el
									.width(newWidth)
									.height(newWidth * $el.data('aspectRatio'));

							});

							// Kick off one resize to fix all videos on page load
						}).resize();

						$ionicLoading.hide();
					});

					angular.element('#content').on('click', 'a', function(event){
						event.stopPropagation();
						event.preventDefault();
						if(event.handled !== true) {
							$cordovaInAppBrowser.open(angular.element(this).attr("href"), '_system');
							event.handled = true;
							return false;
				        } else {
				        	return false;
				        }
					});

				});
			}());

			function addToFavorites (itemId) {
				db.get(itemId).then(function(doc) {
					var updatedItem = doc;
					updatedItem.favorite = updatedItem.favorite ? false : true;
					return db.put(updatedItem).then(function(item){
						$scope.favorite = updatedItem.favorite;
					});
				});
			}

			function share (item) {
				$ionicPlatform.ready(function() {
					$cordovaSocialSharing.share(item.title, item.content, item.image, item.link); // Share via native share sheet
				});
			}

			function formatDate (date) {
				return moment(date).format('DD/MM/YYYY');
			}

			function openInBrowser (url) {
				$cordovaInAppBrowser.open(url, '_system');
			}
		}
	]);