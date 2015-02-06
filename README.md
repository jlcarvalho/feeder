Feeder Base
=====================

Projeto de consumo de feeds usando o Ionic Framework, Google Feeds e PouchDB.

##Para trabalhar no app base
Clone o repositório com:
```bash
$ git clone https://github.com/jlcarvalho/feeder.git
```
Adicione os arquivos ao commit com
```bash
$ git add --all
```
Para commitar para o master faça
```bash
$ git push -u origin master
```

## Para criar uma nova branch
Clone o repositório com:
```bash
$ git clone https://github.com/jlcarvalho/feeder.git
```
Crie uma branch com:
```bash
$ git checkout -b [nome_da_branch]
```
Faça o push da branch para o repositório
```bash
$ git push origin [nome_da_branch]
```
Verifique se a branch foi criada com
```bash
$ git branch
```

##Para clonar uma branch existente
Clone a branch com:
```bash
$ git clone [url_do_repo] --branch [nome_do_branch] [pasta_no_seu_pc]
```

##Para commitar
Adicione os arquivos ao commit com
```bash
$ git add --all
```
Para commitar para a branch faça
```bash
$ git push -u origin [nome_da_branch]
```

##Após criar/clonar branch
- No diretório do projeto rode
```bash
$ ionic platform add android
```
- No diretório do projeto rode
```bash
$ bower install
```
- Conecte o device no PC
- No diretório do projeto rode
```bash
$ ionic run android
```

##Possíveis erros
- O bower não baixou o arquivo `angular-pouchdb.js`. Pegue o arquivo em `https://raw.githubusercontent.com/angular-pouchdb/angular-pouchdb/master/angular-pouchdb.js` e coleque no diretório `[dir_do_projeto]/www/lib/angular-pouchdb/dist/`
- O AdMob do ngCordova não executa. Abra o arquivo `[dir_do_projeto]/www/lib/ngCordova/dist/ng-cordova.js` e altere todas as ocorrências de `plugins.AdMob` para `AdMob`. Altere também `AdMob.createBannerView` para `AdMob.createBanner` e `AdMob.createInterstitialView` para `AdMob.createInterstitial`.

