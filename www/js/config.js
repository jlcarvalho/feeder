var feeds = [
    { name: 'Experiências Empreendedoras', url: 'https://medium.com/feed/minhas-experiencias'},
    { name: 'Brasil Empreendedor', url: 'https://medium.com/feed/brasil-empreendedor'},
    { name: 'Empreendedorismo: Primeiros Passos' , url: 'https://medium.com/feed/empreendedorismo-primeiros-passos'},
    { name: 'Histórias de Empreendedorismo', url: 'https://medium.com/feed/historias-de-empreendedorismo'},
    { name: 'AppTicket Team', url: 'https://medium.com/feed/appticket-team'},
    { name: 'Info Money - Startup', url: 'http://www.infomoney.com.br/negocios/startups/rss'},
    { name: 'Catraca Livre - Negócios', url: 'https://catracalivre.com.br/brasil/editoria/negocio-urbanidade/feed/'},
    { name: 'Startupi', url: 'http://startupi.com.br/feed/'},
    { name: 'Endeavor', url: 'https://endeavor.org.br/?feed=/feed/endeavor-portal'},
    { name: 'Bizstart', url: 'http://bizstart.com.br/feed/'},
    { name: 'Administradores', url: 'http://www.administradores.com.br/rss/artigos/'},
    { name: 'Pensando Grande', url: 'http://www.pensandogrande.com.br/feed/'},
    { name: 'Empreendedores Criativos', url: 'http://www.empreendedorescriativos.com.br/feed/'},
    { name: 'Empreendedor Digital', url: 'http://www.empreendedor-digital.com/feed'},
    { name: 'Blog da Anjos do Brasil', url: 'http://blog.anjosdobrasil.net/feeds/posts/default'},
    { name: 'Jornal do Empreendedor', url: 'http://feeds.feedburner.com/jornalempreendedor'},
    { name: 'Saia do Lugar', url: 'http://feeds.feedburner.com/SaiaDoLugar'},
    { name: 'Guia da Startup', url: 'http://www.guiadastartup.com.br/feed/'},
    { name: 'Startup SC', url: 'http://www.startupsc.com.br/feed/'},
    { name: 'Marcelo Toledo', url: 'http://feeds.feedburner.com/marcelotoledo'},
    { name: 'Startupenado', url: 'http://feeds.feedburner.com/com/aqsv'},
    { name: 'Blog Geração de Valor', url: 'http://geracaodevalor.com/blog/feed/'},
    { name: 'Estadão - Blog do Empreendedor', url: 'http://blogs.pme.estadao.com.br/blog-do-empreendedor/feed/'}
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

var colorClass = 'balanced';