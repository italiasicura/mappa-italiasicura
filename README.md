<img style="align:center;" src="http://mappa.italiasicura.gov.it/img/logo-big.png">
==================
The application mappa.italiasicura.gov.it and the presented data give a complete framework for understanding flood prone areas of Italy, and proposes a number of risk indicators across the national territory. The government spending in public works for flood prevention, emergencies and damages is also presented. The application, aiming to increase social engagement and consciousness on natural disasters, is itself an instrument to improve community resiliency 

![#italiasicura screenshoot](http://mappa.italiasicura.gov.it/img/italiasicura_scr01.png)


Technology
------------
The application is written using different technologies and has been composed thanks to several different tools and pre-existing libraries
here below an extract of the core compnents used in both the backend:

* Backend & tools
  * GNU/Linux [Ubuntu Server](http://www.ubuntu.com/server)
  * [PostgreSQL](http://www.postgresql.org/)  Open Source Database / [PostGIS](http://postgis.net/)  GeoSpatial database
  * [Boundless GeoServer](http://boundlessgeo.com/solutions/solutions-software/geoserver/)  Spatial Geoserver that provide map tiles and vectorial features to the application
  * [WEKA 3](http://www.cs.waikato.ac.nz/~ml/weka/index.html)  Java data analysis and data mining library 
  * [QGIS](http://www.qgis.org/en/site/)  GeoSpatial data management desktop tool
  * [Apache Jena](https://jena.apache.org/)  Java library for RDF serialization and SPARQL processors
  * [OpenRefine](http://openrefine.org/)  Desktop tool to manage complex and messy tabular data
  * [Apache Tomcat](http://tomcat.apache.org/)  The Apache Java web-application Container
  * [Jersey](http://jersey.java.net/)  Java library for the management of RESTful services
  * [Apache HTTPD Server](http://httpd.apache.org/) Apache HTTP Server
  * [PHP](http://php.net/)  PHP scripting language
  * [Twitter-API-PHP](https://github.com/J7mbo/twitter-api-php)  PHP wrapper for Twitter API
  * [OpenStreetMap](http://openstreetmap.it) providing comunity based tiles and base map elements

* Frontend & Software Libraries
  * [AngularJS](https://angularjs.org/)  Modern Javascript web-application MVC framework
  * [OpenLayers 3](http://openlayers.org/)  high-end Javascript Mapping library
  * [Twitter Bootstrap](http://getbootstrap.com/)  Twitter HTLM/CSS template library for responsive web-applications
  * [jQuery](https://jquery.com/) Javascript library
  * [UI Boostrap](https://angular-ui.github.io/bootstrap/)  AngularJS Bootstrap components
  * [ng-twitter](http://darul75.github.io/ng-twitter/)  AngularJS directive for rendering Twitter messages
  * [bxSlider](http://bxslider.com/)  jQuery components to create responsive sliders
  * [Numeral.js](http://adamwdraper.github.io/Numeral-js/) Javascript library to manage numerical values
  * [Chart.js](http://www.chartjs.org/)  Javascript HTML5 chart library 
  * [FontAwesome](http://fortawesome.github.io/Font-Awesome/)  HTML5 Icon library
  * [jQuery.NiceScroll](https://github.com/inuyaksa/jquery.nicescroll) jQury plugin to beutify the default browser scrollbars


Releases
--------------
Current development version is 3.0

Release versions history is available on [Releases](https://github.com/italiasicura/mappa-italiasicura/releases)


Get involved
--------------
you are welcome to contribute adding comments, suggestions or issues or following the traditional GitHub flow to sumbit changes


License
------------
The source code is released under the GNU Affero General Public License v.3
for further information please read the [LICENSE](https://raw.githubusercontent.com/italiasicura/mappa-italiasicura/master/LICENSE) file
for 3rd party libraries and licenses please read the [LICENSES-3RD-PARTIES](https://raw.githubusercontent.com/italiasicura/mappa-italiasicura/master/licenses/LICENSES-3RD-PARTIES)
