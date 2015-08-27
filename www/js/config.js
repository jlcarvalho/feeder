var feeds = [
    { name: 'Dr. Pepper', url: 'http://feeds.feedburner.com/drpepper'},
    { name: 'Um Sábado Qualquer', url: 'http://feeds.feedburner.com/umsabadoqualquer/olOP'},
    { name: 'Will Tirando' , url: 'http://www.willtirando.com.br/rss/'},
    { name: 'Mentirinhas', url: 'http://feeds.feedburner.com/mentirinhas'},
    { name: 'Gi & Kim', url: 'http://www.giekim.com/feeds/posts/default?alt=rss'},
    { name: 'Vida de Suporte', url: 'http://feeds.feedburner.com/vidasuporte'},
    { name: 'Digo Freitas', url: 'http://digofreitas.com/feed/'},
    { name: 'Depósito de Tirinhas', url: 'http://deposito-de-tirinhas.tumblr.com/rss'}
    /*
    { name: 'Catraca Livre - Negócios', url: 'https://catracalivre.com.br/brasil/editoria/negocio-urbanidade/feed/'},
    { name: 'Startupi', url: 'http://startupi.com.br/feed/'},
    { name: 'Endeavor', url: 'https://endeavor.org.br/?feed=/feed/endeavor-portal'},
    { name: 'Administradores', url: 'http://www.administradores.com.br/rss/artigos/'},
    { name: 'Pensando Grande', url: 'http://www.pensandogrande.com.br/feed/'},
    { name: 'Empreendedores Criativos', url: 'http://www.empreendedorescriativos.com.br/feed/'},
    { name: 'Empreendedor Digital', url: 'http://www.empreendedor-digital.com/feed'},
    { name: 'Jornal do Empreendedor', url: 'http://feeds.feedburner.com/jornalempreendedor'},
    { name: 'Saia do Lugar', url: 'http://feeds.feedburner.com/SaiaDoLugar'},
    { name: 'Guia da Startup', url: 'http://www.guiadastartup.com.br/feed/'},
    { name: 'Marcelo Toledo', url: 'http://feeds.feedburner.com/marcelotoledo'},
    { name: 'Blog Geração de Valor', url: 'http://geracaodevalor.com/blog/feed/'},
    { name: 'Estadão - Blog do Empreendedor', url: 'http://blogs.pme.estadao.com.br/blog-do-empreendedor/feed/'}
    */
];

var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { // for android
    admobid = {
        banner: 'ca-app-pub-2064449198452613/6497350907', // or DFP format "/6253334/dfp_example_ad"
        // interstitial: 'ca-app-pub-xxx/yyy'
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
        banner: 'ca-app-pub-2064449198452613/6497350907', // or DFP format "/6253334/dfp_example_ad"
        // interstitial: 'ca-app-pub-xxx/kkk'
    };
} else { // for windows phone
    admobid = {
        banner: 'ca-app-pub-2064449198452613/6497350907', // or DFP format "/6253334/dfp_example_ad"
        // interstitial: 'ca-app-pub-xxx/kkk'
    };
}

var colorClass = 'royal';

/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 */

angular.module('ionicLazyLoad', []);

angular.module('ionicLazyLoad')

    .directive('lazyScroll', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element) {

                    var scrollTimeoutId = 0;

                    $scope.invoke = function () {
                        $rootScope.$broadcast('lazyScrollEvent');
                    };

                    $element.bind('scroll', function () {

                        $timeout.cancel(scrollTimeoutId);

                        // wait and then invoke listeners (simulates stop event)
                        scrollTimeoutId = $timeout($scope.invoke, 0);

                    });


                }
            };
        }])

    .directive('imageLazySrc', ['$document', '$timeout',
        function ($document, $timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attributes) {

                    var deregistration = $scope.$on('lazyScrollEvent', function () {
                            //console.log('scroll');
                            if (isInView()) {
                                $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                                deregistration();
                            }
                        }
                    );

                    function isInView() {
                        var clientHeight = $document[0].documentElement.clientHeight;
                        var clientWidth = $document[0].documentElement.clientWidth;
                        var imageRect = $element[0].getBoundingClientRect();
                        return  (imageRect.top >= 0 && imageRect.bottom <= clientHeight) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
                    }

                    // bind listener
                    // listenerRemover = scrollAndResizeListener.bindListener(isInView);

                    // unbind event listeners if element was destroyed
                    // it happens when you change view, etc
                    $element.on('$destroy', function () {
                        deregistration();
                    });

                    // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                    $timeout(function() {
                        if (isInView()) {
                            $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                            deregistration();
                        }
                    }, 500);
                }
            };
        }]);