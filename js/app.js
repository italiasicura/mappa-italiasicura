/**
*
* mappa.italiasicura.gov.it
* ==========================
*  [ENG]
*  The application mappa.italiasicura.gov.it and the presented data give a
*  complete framework for understanding flood prone areas of Italy, and
*  proposes a number of risk indicators across the national territory. The
*  government spending in public works for flood prevention, emergencies
*  and damages is also presented. The application, aiming to increase
*  social engagement and consciousness on natural disasters, is itself an
*  instrument to improve community resiliency
*
*  [ITA]
*  L'applicazione e i dati sulla mappa forniscono un quadro completo sulla
*  aree soggette ad alluvione in Italia, anche attraverso una serie di 
*  indici di rischio. Presenta inoltre la spesa pubblica per la prevenzione
*  e la riparazione dei danni provocati dal dissesto idrogeologico. 
*  L'applicazione, pensata per attivare il coinvolgimento e la partecipazione
*  dei cittadini, è un importante strumento per aumentare la resilienza territoriale
*
*  ----------------------------------------------------------------------------
*  This content is released under the GNU Affero General Public License v.3
*
*  Copyright (c) 2015, Sciamlab s.r.l., Giovanni Menduni, Tommaso Biondo, Fabrizio Verrocchi
*
*  This program is free software: you can redistribute it and/or modify
*  it under the terms of the GNU Affero General Public License as
*  published by the Free Software Foundation, either version 3 of the
*  License, or (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU Affero General Public License for more details.
*
*  You should have received a copy of the GNU Affero General Public License
*  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*  ----------------------------------------------------------------------------
*  Can you explain briefly what the GNU Affero GPL is? We offer the
*  source code of our websites to our users. The GNU Affero GPL has the
*  requirement that anyone else using that code for their own websites
*  also does the courtesy of offering the source code to their users.
* 
*  Why not use the GPL? The GPL guarantees that anyone who gets a binary
*  version of the software also gets the source code so they can modify
*  it. Since users of websites never get the binary, just HTML pages, it
*  is no better a license than a BSD style license would be for them.
*  For this reason, we use the GNU Affero GPL.
*
* @package      mappa.italiasicura.gov.it
*
* @author       Luca Tamburrano (Data Scientist @ SciamLab)
* @author       Paolo Starace (Data API and Dashboard @ SciamLab)
* @author       Tommaso Biondo (Web Application and UX @ SciamLab)
* @author       Fabrizio Verrocchi (Graphics)
* @author       Alessio Dragoni (Software Architect and Project Chef @ SciamLab)
* @author       Giovanni Menduni (Chief Scientist and Project Manager)
*
* @license      https://gnu.org/licenses/agpl.html
* @link         http://mappa.italiasicura.gov.it
* @since        Version 1.1.0
* @filesource   http://github.com/italiasicura/mappa.italiasicura
*
*/

angular.module('ItaliasicuraApp', [
    'ItaliasicuraApp.directive',
    'ItaliasicuraApp.services',
    'ItaliasicuraApp.controllers',
    'ItaliasicuraApp.filters',
    'angular-bootstrap-select.extra',
    'angular-bootstrap-select',
    'ngRoute',
    'ngTwitter',
    'door3.css',
    'ui.router',
    'ui.bootstrap'
]).config(['$urlRouterProvider','$httpProvider','$stateProvider', function($urlRouterProvider,$httpProvider,$stateProvider,$stateHelperProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/home');
    $stateProvider
    .state('home',{url: "/home", templateUrl: "templates/home.html", controller: "homeController", css:"css/home.css"})
    .state('interventi',{url: "/interventi", templateUrl: "templates/interventi.html", controller: "interventiController", css:"css/interventi.css", reloadOnSearch: false})
    .state('interventiSelected',{url: "/interventi/:type/:name", templateUrl: "templates/interventi.html", controller: "interventiController", css:"css/interventi.css", reloadOnSearch: false})
    .state('emergenze',{url: "/emergenze", templateUrl: "templates/emergenze.html", controller: "emergenzeController",css:"css/emergenze.css"})
    .state('page',{url: "/page", abstract: true, templateUrl: "templates/page.html", controller: "pageController"})
    .state('page.guida',{url: "^/guida", templateUrl: "templates/guida.html",css:"css/page.css"})
    .state('page.sviluppatori',{url: "^/sviluppatori", templateUrl: "templates/opendata.html",css:"css/page.css"})
    .state('page.notelegali',{url: "^/notelegali", templateUrl: "templates/notelegali.html",css:"css/page.css"})
    .state('page.progetto',{url: "^/progetto", templateUrl: "templates/progetto.html",css:"css/page.css"})
    .state('page.crediti',{url: "^/crediti", templateUrl: "templates/crediti.html",css:"css/page.css"})
    .state('page.opensource',{url: "^/opensource", templateUrl: "templates/opensource.html",css:"css/page.css"})
    .state('page.opendata',{url: "^/opendata", templateUrl: "templates/opendata.html",css:"css/page.css"})
    .state('page.feedback',{url: "^/feedback", templateUrl: "templates/feedback.html",css:["css/page.css","css/mail.css"]})
    .state('sintesi',
           {url: "/sintesi",
            templateUrl: "templates/dashboard.html",
            controller: "dashboardController",
            css:"css/dashboard.css"})
    .state('sintesi.ambito',
           {url: "/:ambito",
            templateUrl: "templates/dashboard.ambito.html",
            controller: "dashboardControllerAmbito",
            css:"css/dashboard.css"})
    .state('sintesi.ambito.tema',
           {url: "/:tema",
            templateUrl: "templates/dashboard.tema.html",
            controller: "dashboardControllerTema",
            css:"css/dashboard.css"})
    .state('sintesi.ambito.tema.formato',
           {url: "/:formato",
            templateUrl: "templates/dashboard.formato.html",
            controller: "dashboardControllerFormato",
            css:"css/dashboard.css"})
    ;
}]);
