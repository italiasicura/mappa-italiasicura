![#italiasicura](http://mappa.italiasicura.gov.it/img/logo-big.png)
==================
The application mappa.italiasicura.gov.it and the presented data give a complete framework for understanding flood prone areas of Italy, and proposes a number of risk indicators across the national territory. The government spending in public works for flood prevention, emergencies and damages is also presented. The application, aiming to increase social engagement and consciousness on natural disasters, is itself an instrument to improve community resiliency 

Technology
------------
The application is written using different technologies and has been composed thanks to several different tools and pre-existing libraries
here below an extract of the core compnents used in both the backend:

* Backend & tools
  * GNU/Linux [Ubuntu Server](http://www.ubuntu.com/server)
  * [PostgreSQL](http://www.postgresql.org/)  Open Source Database / [PostGIS](http://postgis.net/)  GeoSpatial database
  * [Boundless GeoServer](http://boundlessgeo.com/solutions/solutions-software/geoserver/)  Server Geografico che serve all'applicazione Mappe, Tiles e Features Vettoriali
  * [WEKA 3](http://www.cs.waikato.ac.nz/~ml/weka/index.html)  libreria Java e tool per l'analisi dati
  * [QGIS](http://www.qgis.org/en/site/)  tool per la gestione ed il processamento di file e formati dati geospaziali
  * [Apache Jena](https://jena.apache.org/)  libreria Java per gestire serializzazione in formato RDF e processore SPARQL
  * [OpenRefine](http://openrefine.org/)  tool per l'esplorazione ed il processamento di dati tabulari complessi
  * [Apache Tomcat](http://tomcat.apache.org/)  application server container per java web-application
  * [Jersey](http://jersey.java.net/)  Libreria Java per gestire Web Services RESTful
  * [Apache HTTPD Server](http://httpd.apache.org/)  server HTTP
  * [PHP](http://php.net/)  PHP scripting language
  * [Twitter-API-PHP](https://github.com/J7mbo/twitter-api-php)  PHP wrapper della API Twitter
  * [OpenStreetMap](http://openstreetmap.it) tiles ed elementi della mappa di base

* Frontend & Software Libraries
  * [AngularJS](https://angularjs.org/)  framework javascript per la creazione di web application dinamiche
  * [OpenLayers 3](http://openlayers.org/)  libreria per la gestione della mappa
  * [Twitter Bootstrap](http://getbootstrap.com/)  framework e componenti HTLM/CSS per web-applications responsive
  * [jQuery](https://jquery.com/) Libreria Javascript
  * [UI Boostrap](https://angular-ui.github.io/bootstrap/)  componenti bootstrap per AngularJS
  * [ng-twitter](http://darul75.github.io/ng-twitter/)  direttiva Angular per la visualizzazione di messaggi Twitter
  * [bxSlider](http://bxslider.com/)  componente jQuery per la creazione di slider responsive
  * [Numeral.js](http://adamwdraper.github.io/Numeral-js/)  libreria Javascript per la formattazione e manipolazione di dati numerici
  * [Chart.js](http://www.chartjs.org/)  libreria Javascript per la gestione di grafici HTML5
  * [FontAwesome](http://fortawesome.github.io/Font-Awesome/)  libreria di icone per HTML5

Get involved
--------------
you are welcome to contribute adding comments, suggestions or issues or following the traditional GitHub flow to sumbit changes


License
------------
The source code is released under the GNU Affero General Public License v.3
for further information please read the [LICENSE](https://raw.githubusercontent.com/italiasicura/LICENSE) file
for 3rd party libraries and licenses please read the [LICENSES-3RD-PARTIES](http://raw.githubusercontent.com/italiasicura/licenses/LICENSES-3RD-PARTIES)
