var feeds = [
    { name: 'Dr. Pepper', url: 'http://feeds.feedburner.com/drpepper'},
    { name: 'Um Sábado Qualquer', url: 'http://feeds.feedburner.com/umsabadoqualquer/olOP'},
    { name: 'Will Tirando' , url: 'http://www.willtirando.com.br/rss/'},
    { name: 'Mentirinhas', url: 'http://feeds.feedburner.com/mentirinhas'},
    { name: 'Gi & Kim', url: 'http://www.giekim.com/feeds/posts/default?alt=rss'},
    { name: 'Vida de Suporte', url: 'http://feeds.feedburner.com/vidasuporte'},
    { name: 'Digo Freitas', url: 'http://digofreitas.com/feed/'},
    { name: 'Depósito de Tirinhas', url: 'http://deposito-de-tirinhas.tumblr.com/rss'}
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