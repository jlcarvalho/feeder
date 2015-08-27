angular.module('starter.controllers', [])

	.controller('AppCtrl', ['$scope', function ($scope) {
		$scope.colorClass = colorClass;
	}])

	.controller('NewsCtrl', ['Timeline', '$scope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicLoading',
		function (Timeline, $scope, $state, $stateParams, $ionicSideMenuDelegate, $ionicLoading) {
			var feeds = new Timeline();
			$scope.news = feeds.data;

			$scope.loadMore = loadMore;
			$scope.canLoad = feeds.canLoad;
			$scope.toggleLeft = toggleLeft;

			function loadMore(){
				feeds.loadMore().then(function(){
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
			}

			function toggleLeft() {
				$ionicSideMenuDelegate.toggleLeft();
			}
	}])

	.controller('FavoritesCtrl', ['Timeline', '$scope', '$state', '$stateParams', '$ionicSideMenuDelegate', '$ionicLoading',
		function (Timeline, $scope, $state, $stateParams, $ionicSideMenuDelegate, $ionicLoading) {
			var feeds = new Timeline({
				favorites: true
			});
			$scope.news = feeds.data;
			$scope.stop = false;

			$scope.loadMore = loadMore;
			$scope.canLoad = feeds.canLoad;
			$scope.noMore = noMore;
			$scope.toggleLeft = toggleLeft;

			function loadMore(){
				feeds.loadMore().then(function(docs){
					if(docs.length < 10){
						$scope.stop = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
			}
			function noMore(){
				return $scope.news.length === 0;
			}

			function toggleLeft() {
				$ionicSideMenuDelegate.toggleLeft();
			}

	}])

	.controller('NewCtrl', ['FeederService', '$scope', '$timeout', '$stateParams', '$cordovaSocialSharing', '$cordovaNetwork', '$cordovaInAppBrowser', '$ionicLoading',
		function (FeederService, $scope, $timeout, $stateParams, $cordovaSocialSharing, $cordovaNetwork, $cordovaInAppBrowser, $ionicLoading) {
			$scope.colorClass = colorClass;

			$scope.item = {};
			$scope.favorite = false;

			$scope.addToFavorites = addToFavorites;
			$scope.share = share;
			$scope.formatDate = formatDate;
			$scope.openInBrowser = openInBrowser;
			$scope.showImage = true /*$cordovaNetwork.getNetwork() === 'wifi' ? true : false*/;

			$ionicLoading.show({
				template: 'Carregando...'
			});

			(function(){
				ionic.Platform.ready(function() {
					FeederService.getFeed($stateParams.id).then(function(item){
						item.content = item.content.replace(/src/gi, 'image-lazy-src');

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
					}).on('click', 'img', function(event){
						if(window.plugins && window.plugins.webintent){
							event.stopPropagation();
							event.preventDefault();
							if(event.handled !== true) {
								window.plugins.webintent.startActivity({
									action: window.plugins.webintent.ACTION_VIEW,
									url: angular.element(this).attr("src"),
									type: 'image/*'
								});
								event.handled = true;
								return false;
							} else {
								return false;
							}
						}
					});
				});
			}());

			function addToFavorites (itemId) {
				FeederService.getFeed(itemId).then(function(doc) {
					var updatedItem = doc;
					updatedItem.favorite = updatedItem.favorite ? false : true;
					return FeederService.updateFeed(updatedItem).then(function(item){
						$scope.favorite = updatedItem.favorite;
					});
				});
			}

			function share (item) {
				ionic.Platform.ready(function() {
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