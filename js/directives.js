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
var api_endpoint = 'http://mappa.italiasicura.gov.it';

angular.module('ItaliasicuraApp.directive', [])
    .directive('mapObject',  ['$location', function($location){
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: false,
            replace:true,
            transclude: false,
            compile:function (element,attrs){
               element.replaceWith('<div id="olmap"></div><div id="map-loader"><div class="progress"><span class="progress-bar progress-bar-striped active"></span></div></div><div id="info"></div>');

            return function ($scope, element, attrs) {

                /*
                 * ==========================
                 *  SHAPES STYLES
                 * ==========================
                 */

                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.1)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(55, 55, 55, 1)',
                        width: 1
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({
                            color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 3
                        })
                    })
                });
                var styles = [style];

                var stylee = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.1)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 96, 0, 1)',
                        width: 1
                    })
                });
                var stylese = [stylee];

                var selectedInterventistyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                       color: 'rgba(49,176,35,0.4)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(55, 55, 55, 2)',
                        width: 1
                    })
                });
                var styleSelectI = [selectedInterventistyle];

                var selectedEmergenzestyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 96, 0, 0.5)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 96, 0, 1)',
                        width: 1
                    })
                });
                var styleSelectE = [selectedEmergenzestyle];

                /*
                 * ============================================
                 * (1)  BASE MAP PURE OSM
                 * ============================================
                 */
                var osmLayer = new ol.layer.Tile({
                    source: new ol.source.OSM({'url': '//{a-c}.tile.opencyclemap.org/landscape/{z}/{x}/{y}.png'})
                });

                /*
                 * ============================================
                 * (2) PERICOLOSITA' LAYER // TILED WMS
                 * ============================================
                 */
                var pericolositaLayers = new ol.layer.Tile({
                    source: new ol.source.TileWMS(({
                        url: api_endpoint + '/geoserver/italiasicura/wms',
                        params: {
                            'LAYERS': 'italiasicura:pericolositaitalia',
                            'tiled': true,
                            'format': 'image/png8'
                        },
                        serverType: 'geoserver'
                    }))
                });

                var italiaSource;
                if($scope.type=="interventi"){
                    italiaSource = new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
			            url: api_endpoint + '/italiasicura/italia/interventi'
                    });
                }else{
                    italiaSource = new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
			            url: api_endpoint + '/italiasicura/italia/emergenze'
                    });
                }

                /*
                 * ============================================
                 * (3) LAYER REGIONI (SIMPLIFIED)
                 * ============================================
                 */
                var regioniLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
url: '/geoserver/italiasicura/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=italiasicura%3Aregioni_i_web&maxFeatures=50&outputformat=application%2Fjson'
                    }),
                    minResolution: 600,
                    maxResolution: 10000,
                    style: function(feature, resolution) {
                        return styles;
                    }
                });

                var regionieLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
url: '/geoserver/italiasicura/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=italiasicura%3Aregioni_e_web&maxFeatures=50&outputformat=application%2Fjson'	
                    }),
                    minResolution: 600,
                    maxResolution: 10000,
                    style: function(feature, resolution) {
                        return stylese;
                    }
                });

                /*
                 * ============================================
                 * (4) LAYER PROVINCE (SLIGHTLY SIMPLIFIED)
                 * ============================================
                 */
                var provinceLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
                        url: '/geoserver/italiasicura/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=italiasicura%3Aprovince_i_web&maxFeatures=200&outputformat=json'
                    }),
                    minResolution: 70,
                    maxResolution: 500,
                    style: function(feature, resolution) {
                        return styles;
                    }
                });
                
                
                regioniLayer.getSource().on('change', function(){
                    if($scope.type=="interventi" && $scope.selection && $scope.selected.type=='regione'){
                        var feats = regioniLayer.getSource().getFeatures();
                        for(var i=0 ; i<feats.length ; i++){
                            if(feats[i].get('cod') == $scope.selected.name){
                                select.getFeatures().push(feats[i]);   
                                break;
                            }
                        }
                    }
                });

                regionieLayer.getSource().on('change', function(){
                    if($scope.type=="emergenze" && $scope.selection){
                        var feats = regionieLayer.getSource().getFeatures();
                        for(var i=0 ; i<feats.length ; i++){
                            if(feats[i].get('cod') == $scope.selected.name){
                                select.getFeatures().push(feats[i]);
                                break;
                            }
                        }
                    }
                });

                provinceLayer.getSource().on('change', function(){
                    if($scope.selection && $scope.selected.type=='provincia'){
                        var feats = provinceLayer.getSource().getFeatures();
                        for(var i=0 ; i<feats.length ; i++){
                            if(feats[i].get('cod') === $scope.selected.name){
                                select.getFeatures().push(feats[i]);   
                                break;
                            }
                        }
                    }
                });


                /*
                 * ============================================
                 * (5) COMUNI VECTOR LAYER
                 * ============================================
                 */

                var comuniLoader = function(extent, resolution, projection) {
                    var url = api_endpoint + '/geoserver/italiasicura/ows?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=italiasicura:comuni&' +
                        'outputFormat=text/javascript' +
                        '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
                    $.ajax({
                        url: url,
                        jsonpCallback: "parseResponse",
                        contentType: "application/json",
                        dataType: 'jsonp',
                        beforeSend: function() {
                            comuniSource.clear();
                            $scope.loader=true;

                        },
                        success: function(json) {
                            loadFeatures(json);
                        }
                    });
                };

                var comuniSource = new ol.source.ServerVector({
                    format: new ol.format.GeoJSON(),
                    loader: comuniLoader,
                    strategy: ol.loadingstrategy.bbox
                });

                var comuniVectorLayer = new ol.layer.Vector({
                    source: comuniSource,
                    style: function(feature, resolution) {
                        return styles;
                    },
                    minResolution: 9,
                    maxResolution: 40
                });
                var loadFeatures = function(response) {
                    var features = comuniSource.readFeatures(response);
                    $scope.loader.num=$scope.loader.counter=features.length;
                    comuniSource.addFeatures(features);
                    
                    if($scope.selection && $scope.selected.type=='comune'){
                        for(var i=0 ; i<features.length ; i++){
                            if(features[i].get('cod') === $scope.selected.name){
                                select.getFeatures().push(features[i]);   
                                break;
                            }
                        }
                    }
                    $scope.loader=false;

                };

                /*
                 * ============================================
                 * (5) LOCALITA VECTOR LAYER
                 * ============================================
                 */
                var localitaLoader = function(extent, resolution, projection) {
                    var url = api_endpoint + '/geoserver/italiasicura/ows?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=italiasicura:localita_i_web&' +
                        'outputFormat=text/javascript' +
                        '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
                    $.ajax({
                        url: url,
                        jsonpCallback: "parseResponse",
                        contentType: "application/json",
                        dataType: 'jsonp',
                        beforeSend: function() {
                            localitaSource.clear();
                            $scope.loader=true;
                        },
                        success: function(json) {
                            loadFeaturesLoc(json);
                        }
                    });
                };
                var localitaSource = new ol.source.ServerVector({
                    format: new ol.format.GeoJSON(),
                    loader: localitaLoader,
                    strategy: ol.loadingstrategy.bbox
                });
                var localitaVectorLayer = new ol.layer.Vector({
                    source: localitaSource,
                    style: function(feature, resolution) {
                        return styles;
                    },
                    minResolution: 1,
                    maxResolution: 5
                });
                var loadFeaturesLoc = function(response) {
                    var features = localitaSource.readFeatures(response);
                    localitaSource.addFeatures(features);
                    if($scope.selection && $scope.selected.type=='localita'){
                        for(var i=0 ; i<features.length ; i++){
                            if(features[i].get('cod') === $scope.selected.name){
                                select.getFeatures().push(features[i]);
                                break;
                            }
                        }
                    }
                    $scope.loader=false;
                };

                /*
                 * ============================================
                 * (6) LOTTI VECTOR LAYER
                 * ============================================
                 */
                var lottiStaticSource = new ol.source.GeoJSON({
                    projection: 'EPSG:3857',
                    url: '/geoserver/italiasicura/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=italiasicura%3Ascheda_interventi&maxFeatures=10000&outputformat=json'
                });

                lottiVectorLayer=false;
                updateCluster = function(zoom){
                    if(zoom==='undefined'){
                        zoom=6;
                    }
                    var dist=0;
                    if(zoom<12){
                        dist=99-((zoom-6)*11);
                    }
                    if(lottiVectorLayer){
                        map.removeLayer(lottiVectorLayer);
                    }
		    if(pianoNazionaleVectorLayer){
                        map.removeLayer(pianoNazionaleVectorLayer);
                    }
                    lottiCluster=new ol.source.Cluster({
                        source: lottiStaticSource,
                        distance: dist
                    });

                    console.log('Distance: '+dist);
                    lottiVectorLayer = new ol.layer.Vector({
                        source: lottiCluster,
                        style: clusterStyleFunction,
                        minResolution: 1,
                        maxResolution: 1000000
                    });
                    if($scope.type=='interventi') {
                        map.addLayer(lottiVectorLayer);
			map.addLayer(pianoNazionaleVectorLayer);
	            }
                };


                /*
                 * ============================================
                 * (6A) INTERVENTI PIANO NAZIONALE
                 * ============================================
                 */
                 var pnStyle = new ol.style.Style({
                    image: new ol.style.Icon( ({
                            anchor: [0.5, 0.85],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 0.8,
                       src: 'img/marker-intervento-pn-small.png'
                    }))
                 });
                 var lottiPianoNazionaleSource = new ol.source.GeoJSON({
                    projection: 'EPSG:3857',
                    url: 'data/piano_nazionale.geojson'
                 });

                 var pianoNazionaleVectorLayer = new ol.layer.Vector({
                   source: lottiPianoNazionaleSource
                   ,style: pnStyle 
                 });

                /*
                 * ============================================
                 * (7) INTERVENTI MARKER
                 * ============================================
                 */

                var earthquakeFill = new ol.style.Fill({
                    color: 'rgba(50, 225, 0, 0.6)'
                });
                var earthquakeStroke = new ol.style.Stroke({
                    color: 'rgba(15, 60, 0, 1)',
                    width: 1
                });
                var textFill = new ol.style.Fill({
                    color: '#fff'
                });
                var textStroke = new ol.style.Stroke({
                    color: 'rgba(20, 60, 5, 1)',
                    width: 3
                });

                function createInterventoStyle(feature) {
                    var radius = 15;
                    var src;
                    var stato=feature.get('posizione');
                    if(stato=='c'){
                        src='img/marker-intervento-c.png'
                    }else{
                        src='img/marker-intervento.png'
                    }
                    return new ol.style.Style({
                        geometry: feature.getGeometry(),
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            anchor: [0.5, 0.85],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 1,
                            src: src
                        }))
                    });
                }

                var maxFeatureCount;
                function calculateClusterInfo(resolution) {

                    if (resolution != currentResolution) {
                        maxFeatureCount = 0;
                        var radius_max = 60;
                        var radius_min = 10;
                        var features = lottiVectorLayer.getSource().getFeatures();

                        for (var i = 0 ; i<features.length ; i++) {
                            var feature = features[i];
                            var size = feature.get('features').length;
                            maxFeatureCount = Math.max(maxFeatureCount, size);
                        }
                        for (var i = 0 ; i<features.length ; i++) {
                            var feature = features[i];
                            var size = feature.get('features').length;
                            var radius = ((radius_max-radius_min)*size/maxFeatureCount)+radius_min;
                            feature.set('radius', radius);
                        }
                        currentResolution = resolution;
                    }
                }

                var currentResolution;
                function clusterStyleFunction(feature, resolution) {
                    if (resolution != currentResolution) {
                        calculateClusterInfo(resolution);
                        currentResolution = resolution;
                    }
                    var style;
                    var size = feature.get('features').length;
                    if (size > 1) {
                        style = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: feature.get('radius'),
                                fill: new ol.style.Fill({
                                    color: [90, 240, 15, 0.5]
                                })
                            }),
                            text: new ol.style.Text({
                                font: 'bold 16px Helvetica Neue,Helvetica,Arial,sans-serif',
                                text: size.toString(),
                                fill: textFill,
                                stroke: textStroke
                            })
                        })];
                    } else {
                        var originalFeature = feature.get('features')[0];
                        style = [createInterventoStyle(originalFeature)];
                        if($scope.selection && $scope.selected.type=='intervento' && originalFeature.get('int') === $scope.selected.name){
                            select.getFeatures().push(originalFeature);   
                        }
                    }
                    return style;
                 }



                /*
                 * ============================================
                 * (8) GEOLOCATION & LOADER
                 * ============================================
                 */
                var geolocVectorSource = new ol.source.Vector({
                   projection: 'EPSG:3857'
                });

                var geolocStyle = new ol.style.Style({
                   image: new ol.style.Icon( ({
                           anchor: [0.5, 0.85],
                           anchorXUnits: 'fraction',
                           anchorYUnits: 'fraction',
                           opacity: 1,
                        src: 'img/marker-geoloc.png'
                   }))
                });

                var geolocVectorLayer = new ol.layer.Vector({
                  source: geolocVectorSource,
                  style: geolocStyle
                });

                var geolocate = new ol.Geolocation({
                    projection: ol.proj.get($scope.projection)
                });

                geolocate.once('change', function(event) {
                    var c=geolocate.getPosition();

                    $scope.center.lat=c[1];
                    $scope.center.lon=c[0];
                    $scope.center.zoom=17;
                    $scope.center.bbox=null;
		    $scope.addLocationMarker($scope.center.lat, $scope.center.lon,"La mia posizione","Lon:"+$scope.center.lon+ ", Lat: "+$scope.center.lat);
                });
		
		$scope.addLocationMarker = function(lat, lon, title, name){
                    var iconGeoLoc = new ol.Feature({
                         geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
                         t: "geoloc",
                         title: title,
                         addr: name  
                    });
                    iconGeoLoc.setStyle(geolocStyle);
                    geolocVectorSource.clear();
                    geolocVectorSource.addFeature(iconGeoLoc);
		}

                GeolocationControl = function($scope) {

                    var options = {};

                    var button = document.createElement('button');
                    button.innerHTML = '<i class="icon-icon-geo"></i>';

                    var this_ = this;
                    var geolocating = function(e) {
                        geolocate.setTracking(true);
                    };

                    button.addEventListener('click', geolocating, false);
                    button.addEventListener('touchstart', geolocating, false);

                    var element = document.createElement('div');
                    element.className = 'geolocating ol-unselectable ol-control';
                    element.appendChild(button);

                    ol.control.Control.call(this, {
                        element: element,
                        target: document.getElementById('right-addons')
                    });
                };
                ol.inherits(GeolocationControl, ol.control.Control);


                /*
                 * ============================================
                 * (9) OPENLAYERS MAP
                 * ============================================
                 */
                var interactions = ol.interaction.defaults({pinchRotate:false});


                if($scope.type=="interventi"){
                    var map = new ol.Map({
                        controls: ol.control.defaults({attribution:false , rotate:false,zoomOptions:{target: document.getElementById('right-addons')}}).extend(
                            [ new GeolocationControl($scope),
                              new ol.control.ZoomSlider({target: document.getElementById('right-addons'),
                                  maxResolution: 2444.98490512564,
                                  minResolution: 1.194328566955879
                              })
                            ]),
                        interactions: interactions,
                        target: 'olmap',
                        layers: [
                            osmLayer,
                            pericolositaLayers,
                            regioniLayer,
                            provinceLayer,
                            comuniVectorLayer,
                            localitaVectorLayer,
                            geolocVectorLayer
                        ],
                        view: new ol.View({
                            center: [$scope.center.lat,$scope.center.lon],
                            zoom: $scope.center.zoom,
                            minZoom: 6,
                            maxZoom: 17
                        })
                    });
                    updateCluster(6);
                    var mcontrols = map.getControls();
                    mcontrols.forEach(function (el) {
                        if (el instanceof ol.control.ZoomSlider) {
                            $('#right-addons .ol-zoom-in').after(el.element);
                        }

                    });
                }else{
                    var map = new ol.Map({
                        controls: [],
                        interactions: interactions,
                        target: 'olmap',
                        layers: [
                            osmLayer,
                            regionieLayer
                        ],
                        view: new ol.View({
                            center: [$scope.center.lat,$scope.center.lon],
                            zoom: $scope.center.zoom,
                            minZoom: 6,
                            maxZoom: 6
                        })
                    });
                }


                /*
                 * ============================================
                 * (11) SELECT EVENT
                 * ============================================
                 */
                if($scope.type=='interventi'){
                    select = new ol.interaction.Select({style:styleSelectI});
                }else{
                    select = new ol.interaction.Select({style:styleSelectE});
                }

                map.addInteraction(select);
                
                select.getFeatures().on('add', function (e) {
                    if (e.element) {
                        var type = e.element.get('t');
                        if(type === 'r' || type === 'p' || type === 'c' || type === 'l'){
                            t='shape';
                            $scope.$emit('openlayers.layers.selectShape', e.element);
                        }else if(type === 'i'){
                            t='intevento';
                            //avoid to apply style
                            select.getFeatures().remove(e.element);
                            $scope.$emit('openlayers.layers.selectIntervento', e.element);
                        }else if(type === 'pn'){
                            t='intevento_pn';
                            //avoid to apply style
                            select.getFeatures().remove(e.element);
			    $scope.$emit('openlayers.layers.selectInterventoPN', e.element);
			}else if(e.element.get('features').length==1){
                            t='intevento';
                            //avoid to apply style
                            select.getFeatures().remove(e.element);
                            $scope.$emit('openlayers.layers.selectIntervento', e.element.get('features')[0]);
                        }else{
                            t=false;
                            //avoid to apply style
                            select.getFeatures().remove(e.element);
                        }

                    }
                });

                $scope.resetSelection= deselectAllFeatures = function(){
                    var feats = select.getFeatures();
                    if(feats.getLength()>0){
                        var l = feats.getLength();
                        for(var i=feats.getLength() ; i>0 ; i--){
                            feats.removeAt(i-1);
                        }
                    }
                    $scope.selection = false;
                    $scope.selected = null;
                    $location.search('name',null);
                    $location.search('type',null);
		    $location.search('exp',null);
                    $('.box-lotti').removeClass('active');
                    $('#right-panel').removeClass('active');
                };



                /*
                 * ============================================
                 * (12) INTERACTIONS
                 * ============================================
                 */
                var info = $('#info');
                info.popover({
                    animation: false,
                    trigger: 'manual',
                    placement: 'top',
                    html: true
                });
                
                var target = map.getTarget();
                var jTarget = typeof target === "string" ? $("#" + target) : $(target);

                var displayFeatureInfo = function(pixel,evt) {
                    info.css({
                        left: pixel[0] + 'px',
                        top: (pixel[1] - 15) + 'px'
                    });
                    var t;
                    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                        info.tooltip('hide');
                        type = feature.get('t');
                        f=feature.get('features');
                        if(typeof f === 'undefined'){
                            if(type === 'r' || type === 'p' || type === 'c' || type === 'l'){
                                t='shape';
                                //info.tooltip('hide');
                            }else if (type === 'e') {
                                t = 'emergenza';
                                //info.tooltip('hide')
                                //    .attr('data-original-title', '<strong>testo da sostituire</strong>')
                                //    .tooltip('fixTitle')
                                //    .tooltip('show');
                            }else if (type === 'pn') {
                                t = 'intervento_pn';
                                /*info.popover('hide')
                                   .attr('data-original-title', '<strong>Intervento Piano Nazionale</strong>')
                                   .attr('data-content', '<strong>Codice istruttoria: </strong><span class="istruttoria">'+feature.get('Codice')+'</span><br><strong>Descrizione: </strong>'+feature.get('Titolo')+'<br><strong>Area di riferimento: </strong>'+feature.get('citta')+'<br><strong>Livello progettazione: </strong>'+feature.get('prog')+'<br><strong>Importo totale: </strong>'+feature.get('imptot'))
                                   .popover('fixTitle')
                                   .popover('toggle');*/
                            } else if (type === 'geoloc') {
                                t = 'geoloc';
                                info.popover('hide')
                                    .attr('data-original-title','<strong>'+feature.get('title')+'</strong>')
                                    .attr('data-content',feature.get('addr'))
                                    .popover('fixTitle')
                                    .popover('toggle');          
                            } else{
                                info.popover('hide');
                                t=false;
                            }
                            return feature;
                        }else{
                            //info.tooltip('hide')
                            //    .attr('data-original-title', 'testo da sostituire')
                            //    .tooltip('fixTitle')
                            //    .tooltip('show');
                            if(f.length>1){
                                t = false;
                                return false;
                            }else{
                                t = 'intervento';
                                return f[0];
                            }

                        }
                    });
                    if (feature && t) {
                        $scope.$emit('openlayers.layers.'+t, feature);
                        jTarget.css("cursor", "pointer");
                    }else{
                        //feat=italiaSource.getFeatures();
                        $scope.$emit('openlayers.layers.shape', italiaSource.getFeatures()[0]);
                        jTarget.css("cursor", "default");
                    }


                };

                //load italia shape on start
                italiaSource.on('change', function() {
                  if (italiaSource.getState() == 'ready' && !$scope.selection) {
                    $scope.$emit('openlayers.layers.shape', italiaSource.getFeatures()[0]);
                  }
                });

		//load interventi pn shape on start if selected from url
                lottiPianoNazionaleSource.on('change', function() {
                  if (lottiPianoNazionaleSource.getState() == 'ready' && $scope.selection && $scope.selected.type=='intervento_pn') {
                       var features = lottiPianoNazionaleSource.getFeatures();
                        for(var i=0 ; i<features.length ; i++){
                            if(features[i].get('Codice') === $scope.selected.name){
                                select.getFeatures().push(features[i]);
                                break;
                            }
                        }
                  }
                });

                map.on('pointermove', function(e) {
                    var coord = e.coordinate;
                    var proj = map.getView().getProjection().getCode();
                    info.popover('hide');
                    if (proj === 'pixel') {
                        coord = coord.map(function(v) {
                            return parseInt(v, 10);
                        });
                        $scope.$emit('openlayers.map.pointermove', {
                            coord: coord,
                            projection: proj
                        });
                    } else {
                        $scope.$emit('openlayers.map.pointermove', {
                            lat: coord[1],
                            lon: coord[0],
                            projection: proj
                        });
                    }
                });

                $(map.getViewport()).on('mousemove', function(evt) {
                    //console.log(evt);
                    var pixel = map.getEventPixel(evt.originalEvent);
                    displayFeatureInfo(pixel,evt);
                });

                /*map.on('dblclick', function(evt) {
                    evt.preventDefault();
                    var pixel = map.getEventPixel(evt.originalEvent);
                    map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                        console.log(feature);
                        $scope.center.bbox = (feature.getGeometry().getExtent());
                    });
                });*/

                map.getView().on('change:resolution', function(evt) {
                    var type;
                    if($scope.zoom>map.getView().getZoom()){
                        type= 'out';
                    }else{
                        type= 'in';
                    }
                    if(map.getView().getZoom()){
                        updateCluster(map.getView().getZoom());
                    }else{
                        updateCluster(6);
                    }

                    $scope.zoom=map.getView().getZoom();
                    console.log('ZOOM LEVEL/RESOLUTION: ' + map.getView().getZoom()+' / '+map.getView().getResolution() );
                    //console.log('MAP OPTIONS: ' + map.getView().getProjection().getCode() );
                    $scope.$emit('openlayers.map.zoom',type);
                        
                });

                $scope.map=map;

                $scope.$watchCollection("center", function(center) {
                    console.log($scope.center);
                    /*if($scope.center.bbox){
                        $scope.map.getView().fitExtent($scope.center.bbox,$scope.map.getSize());
                        console.log($scope.map.getSize());
                        console.log($scope.center.bbox);
                    }else{*/
                        $scope.map.getView().setCenter(ol.proj.transform([center.lon, center.lat], 'EPSG:4326', 'EPSG:3857'));
                        $scope.map.getView().setZoom(center.zoom);
                    /*}*/

                });


            } //DOM manipulation
        }}
    }]).directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    }).directive('shareLinks', ['$location', function ($location) {
        return {
            link: function (scope, elem, attrs) {

                var i,
                    sites = ['twitter', 'facebook', 'linkedin', 'google-plus', 'whatsapp', 'envelope'],
                    theLink,
                    links = attrs.shareLinks.toLowerCase().split(','),
                    pageLink = encodeURIComponent($location.absUrl()),
                    pageTitle = attrs.shareTitle,
                    pageTitleUri = encodeURIComponent(pageTitle),
                    shareLinks = [];
                    elem.addClass('td-easy-social-share');
                // assign share link for each network
                angular.forEach(links, function (key) {
                    key = key.trim();
                    switch (key) {
                        case 'twitter':
                            theLink = 'http://twitter.com/intent/tweet?text=' + pageTitleUri + '%20' + pageLink;
                            break;
                        case 'facebook':
                            theLink = 'http://facebook.com/sharer.php?u=' + pageLink;
                            break;
                        case 'linkedin':
                            theLink = 'http://www.linkedin.com/shareArticle?mini=true&url=' + pageLink + '&title=' + pageTitleUri;
                            break;
                        case 'google-plus':
                            theLink = 'https://plus.google.com/share?url=' + pageLink;
                            break;
                        case 'whatsapp':
                            theLink = 'whatsapp://send?text='+ pageTitleUri + '%20' + pageLink;
                            break;
                        case 'envelope':
                            theLink = 'mailto:?subject=Visita '+pageTitleUri+'&body=Visita '+ pageTitleUri+' su '+pageLink;
                            break;
                    }
                    if (sites.indexOf(key) > -1) {
                        shareLinks.push({network: key, url: theLink});
                    }
                });
                for (i = 0; i < shareLinks.length; i++) {
                    var anchor = '';
                    anchor += '<a href="'+ shareLinks[i].url + '" class="link-'+shareLinks[i].network+'"';
                    if(shareLinks[i].network=='whatsapp'){
                        if(navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod|iPad/i)){
                            anchor +='>';
                        }else{
                            anchor +='style="display:none">';
                        }
                    }else{
                        anchor +='target="_blank">';
                    }
                    anchor += '<span class="fa-stack fa-lg">';
                    anchor += '<i class="fa fa-circle fa-stack-2x"></i>';
                    anchor += '<i class="fa fa-'+shareLinks[i].network +' fa-stack-1x fa-inverse"></i>';
                    anchor += '</span>';
                    anchor += '</a>';
                    elem.append(anchor);
                }

                scope.$on('$locationChangeSuccess',function(event){
                        pageLink = encodeURIComponent($location.absUrl());
                        pageTitle ='#italiasicura';
                        pageTitleUri = encodeURIComponent(pageTitle);
                    for (i = 0; i < shareLinks.length; i++) {
                        social = shareLinks[i].network;
                        switch (social) {
                            case 'twitter':
                                theLink = 'http://twitter.com/intent/tweet?text=' + pageTitleUri + '%20' + pageLink;
                                break;
                            case 'facebook':
                                theLink = 'http://facebook.com/sharer.php?u=' + pageLink;
                                break;
                            case 'linkedin':
                                theLink = 'http://www.linkedin.com/shareArticle?mini=true&url=' + pageLink + '&title=' + pageTitleUri;
                                break;
                            case 'google-plus':
                                theLink = 'https://plus.google.com/share?url=' + pageLink;
                                break;
                            case 'whatsapp':
                                theLink = 'whatsapp://send?text='+ pageTitleUri + '%20' + pageLink;
                                break;
                            case 'envelope':
                                theLink = 'mailto:?subject=Visita '+pageTitleUri+'&body=Visita '+ pageTitleUri+' su '+pageLink;
                                break;
                        }
                        shareLinks[i].url=theLink;
                        $('.link-'+shareLinks[i].network).attr('href',shareLinks[i].url);
                    }
                });


            }
        };
    }]).directive('photoflickr', [ function() {
        return {
            restrict : 'AE',
            scope: false,
            template:
            '<ul class="photolist">'+
            '<li ng-repeat="pics in fphoto" on-finish-render="sliderfstart">' +
            '<a target="_blank" href="{{pics.link}}"><img src="{{pics.media.m}}" title="{{pics.title}}"/></a>' +
            '</li></ul>',
            link : function(scope, element, attrs) {

            }
        };
    }]).directive('graphpanel',['$location','$interval', function ($location, $interval) {
        return {
            scope:false,
            restrict: 'A',
            //template:'ciao',
            templateUrl : 'templates/graphpanel.html',
            link: function ($scope, element, attr) {

                var charts = $('#charts');
                $scope.slide = function(){
		    var direction = (screen.width<768)?'up':'left';
                    if (!$scope.expanded) {
			if(screen.width>=768){
				charts.css('min-height',$('#info-main').height());
				$('.info-interventi').css('min-height',charts.height()-24-23-28);
			}
			charts.show('slide',{direction:direction},1000);
                        $location.search('exp',true);
                        $scope.expanded=true;
			$scope.createGraph();
                    } else {
                        charts.hide('slide',{direction:direction},1000,function(){
                            $scope.expanded=false;
                        });
                        $location.search('exp',null);
                    }
                };


		var polling = $interval(function() {
			try{
				//console.log(charts.is(':visible'));
				if(charts.is(':visible') && $('.overview-lotto').is(':visible')){
					$interval.cancel(polling);
					if(screen.width>=768){
						console.log(screen.width>=768);
						$('#charts').css('min-height',$('#info-main').height());
			                        $('.info-interventi').css('min-height',$('#charts').height()-24-23-28);
					}	
					$location.search('exp',true);
		                        $scope.expanded=true;
                		        $scope.createGraph();
				}
			}catch(error){
				console.error(error);
				$interval.cancel(polling);
			}
            	}, 35);

                // Extended Graph
                $scope.graphlabel.tipologia=['alluvione','incendio','valanga','frana','costiero','misto','non definito'];

                $scope.graphlabel.fase=['definanziati o sostitutivi','concluso','in esecuzione','in progettazione','da avviare','dati non comunicati'];
                $scope.graphlabel.ente=['comune','città metropolitana o provincia','regione','altro'];
                $scope.graphlabel.costi=['+25 Mln','5 Mln','1 Mln','500 mila','200 mila'];
                $scope.graphlabel.anno=['2015','2010','2005','2000'];

		$( ".bar_stato" ).slider({
                    orientation: "vertical",
                    range: "min",
                    min: 0,
                    max: 6,
                    disabled: true
                });

                $( ".bar_ente" ).slider({
                    orientation: "vertical",
                    range: "min",
                    min: 0,
                    max: 4,
                    disabled: true
                });

		$( ".bar_anno, .bar_annof" ).slider({
                    orientation: "vertical",
                    range: "min",
                    min: 1995,
                    max: 2015,
                    disabled: true
                });
                
		$( ".bar_costi" ).slider({
                    orientation: "vertical",
                    range: "min",
                    min: 0,
                    max: 25,
                    disabled: true
                });

                $scope.updateSliderGraph = function(lotti,indice){

                    lotto=lotti[indice];
                    //update tipo intervento
                    val=$.inArray(lotto.tipo_dis.toLowerCase(),$scope.graphlabel.tipologia);
                    $('.label_tipologia > span.active').removeClass('active');
                    $('.label_tipologia > span').eq(val).addClass('active');

                    //update fase
                    val=$.inArray(lotto.fase.toLowerCase(),$scope.graphlabel.fase);
                    $( ".bar_stato").slider("value",(6-val));

                    //update ente
                    ent=4;
                    $.each($scope.graphlabel.ente, function( index, value ) {
                        if(lotto.ente_attuatore.toLowerCase().search( value )>=0){
                            ent=index;
                        }

                    });
                    $( ".bar_ente").slider("value",(4-ent));

		    costo=lotto.importo_fi;
                    costotemp=costo;
                    val=0;

                    //routine per costi
                        costot=costo-200000;
                        if(costot<=0)
                            val+=parseInt(costo/40000);
                        else{
                            val+=5;
                            costotemp=costo-200000;
                            costot=costo-500000;
                            if(costot<=0)
                                val+=parseInt(costotemp/60000);
                            else{
                                val+=5;
                                costotemp=costo-500000;
                                costot=costo-1000000;
                                if(costot<=0)
                                    val+=parseInt(costotemp/100000);
                                else{
                                    val+=5;
                                    costotemp=costo-1000000;
                                    costot=costo-5000000;
                                    if(costot<=0)
                                        val+=parseInt(costotemp/1000000);
                                    else{
                                        val+=5;
                                        costot=costo-5000000;
                                        val+=Math.max(5,parseInt(costot/5000000));
                                    }
                                }
                            }

                        }			
			$( ".bar_costi").slider("value",val);

			//update anno
			val=lotto.data_norma.split('-');
			$('.bar_anno').slider("value",val[0]);
                };





            }
        }
    }]).directive('slider', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div><input class="slider-input" type="text" /></div>',
            require: 'ngModel',
            scope: {
                max: "=",
                min: "=",
                step: "=",
                value: "=",
                ngModel: '=',
                range:'=',
                sliderid: '=',
                formater: '&',
                onStartSlide: '&',
                onStopSlide: '&',
                onSlide: '&'
            },
            link: function ($scope, element, attrs, ngModelCtrl, $compile) {
                var ngModelDeregisterFn, ngDisabledDeregisterFn;

                initSlider();

                function initSlider() {
                    var options = {};

                    function setOption(key, value, defaultValue) {
                        options[key] = value || defaultValue;
                    }
                    function setFloatOption(key, value, defaultValue) {
                        options[key] = value ? parseFloat(value) : defaultValue;
                    }
                    function setBooleanOption(key, value, defaultValue) {
                        options[key] = value ? value + '' === 'true' : defaultValue;
                    }
                    function getArrayOrValue(value) {
                        return (angular.isString(value) && value.indexOf("[") === 0) ? angular.fromJson(value) : value;
                    }

                    setOption('id', $scope.sliderid);
                    setOption('orientation', attrs.orientation, 'horizontal');
                    setOption('selection', attrs.selection, 'before');
                    setOption('handle', attrs.handle, 'round');
                    setOption('tooltip', attrs.tooltip, 'show');
                    setOption('tooltipseparator', attrs.tooltipseparator, ':');

                    setFloatOption('min', $scope.min, 0);
                    setFloatOption('max', $scope.max, 10);
                    setFloatOption('step', $scope.step, 1);
                    var strNbr = options.step + '';
                    var decimals = strNbr.substring(strNbr.lastIndexOf('.') + 1);
                    setFloatOption('precision', attrs.precision, decimals);

                    setBooleanOption('tooltip_split', attrs.tooltipsplit, false);
                    setBooleanOption('enabled', attrs.enabled, true);
                    setBooleanOption('naturalarrowkeys', attrs.naturalarrowkeys, false);
                    setBooleanOption('reversed', attrs.reversed, false);

                    setBooleanOption('range', $scope.range, false);
                    if( options.range ) {
                        if( angular.isArray($scope.value) ) {
                            options.value = $scope.value;
                        }
                        else if (angular.isString($scope.value)) {
                            options.value = getArrayOrValue($scope.value);
                            if(!angular.isArray(options.value)) {
                                var value = parseFloat($scope.value);
                                if( isNaN(value) ) value = 5;

                                if( value < $scope.min ) {
                                    value = $scope.min;
                                    options.value = [value, options.max];
                                }
                                else if( value > $scope.max ) {
                                    value = $scope.max;
                                    options.value = [options.min, value];
                                }
                                else {
                                    options.value = [options.min, options.max];
                                }
                            }
                        }
                        else {
                            options.value = [options.min, options.max]; // This is needed, because of value defined at $.fn.slider.defaults - default value 5 prevents creating range slider
                        }
                        $scope.ngModel = options.value; // needed, otherwise turns value into [null, ##]
                    }
                    else {
                        setFloatOption('value', $scope.value, 5);
                    }

                    if ($scope.formater) options.formater = $scope.$eval($scope.formater);

                    var slider = $(element).find( ".slider-input" ).eq( 0 );

                    // check if slider jQuery plugin exists
                    if( $.fn.slider ) {
                        // adding methods to jQuery slider plugin prototype
                        $.fn.slider.Constructor.prototype.disable = function () {
                            this.picker.off();
                        };
                        $.fn.slider.Constructor.prototype.enable = function () {
                            this.picker.on();
                        };

                        // destroy previous slider to reset all options
                        slider.slider( options );
                        slider.slider( 'destroy' );
                        slider.slider( options );

                        // everything that needs slider element
                        var updateEvent = getArrayOrValue( attrs.updateevent );
                        if ( angular.isString( updateEvent ) ) {
                            // if only single event name in string
                            updateEvent = [updateEvent];
                        }
                        else {
                            // default to slide event
                            updateEvent = ['slide'];
                        }
                        angular.forEach( updateEvent, function ( sliderEvent ) {
                            slider.on( sliderEvent, function ( ev ) {
                                ngModelCtrl.$setViewValue( ev.value );
                                $timeout( function () {
                                    $scope.$apply();
                                } );
                            } );
                        } );
                        slider.on( 'change', function ( ev ) {
                            ngModelCtrl.$setViewValue( ev.value.newValue );
                            $timeout( function () {
                                $scope.$apply();
                            } );
                        } );

                        // Event listeners
                        var sliderEvents = {
                            slideStart: 'onStartSlide',
                            slide: 'onSlide',
                            slideStop: 'onStopSlide'
                        };
                        angular.forEach( sliderEvents, function ( sliderEventAttr, sliderEvent ) {
                            slider.on( sliderEvent, function ( ev ) {

                                if ( $scope[sliderEventAttr] ) {
                                    var invoker = $parse( attrs[sliderEventAttr] );
                                    invoker( $scope.$parent, {$event: ev, value: ev.value} );

                                    $timeout( function () {
                                        $scope.$apply();
                                    } );
                                }
                            } );
                        } );

                        // deregister ngDisabled watcher to prevent memory leaks
                        if ( angular.isFunction( ngDisabledDeregisterFn ) ) {
                            ngDisabledDeregisterFn();
                            ngDisabledDeregisterFn = null;
                        }
                        if ( angular.isDefined( attrs.ngDisabled ) ) {
                            ngDisabledDeregisterFn = $scope.$watch( attrs.ngDisabled, function ( value ) {
                                if ( value ) {
                                    slider.slider( 'disable' );
                                }
                                else {
                                    slider.slider( 'enable' );
                                }
                            } );
                        }
                        // deregister ngModel watcher to prevent memory leaks
                        if ( angular.isFunction( ngModelDeregisterFn ) ) ngModelDeregisterFn();
                        ngModelDeregisterFn = $scope.$watch( 'ngModel', function ( value ) {
                            slider.slider( 'setValue', value );
                        } );
                    }
                }

                var watchers = ['min', 'max', 'step', 'range'];
                angular.forEach(watchers, function(prop) {
                    $scope.$watch(prop, function(){
                        initSlider();
                    });
                });
            }
        };
    }]);
angular.module('angular-bootstrap-select.extra', [])
    .directive('dropdownToggle', [dropdownToggleDirective])
    .directive('dropdownClose', [dropdownCloseDirective]);
/**
 * @ngdoc directive
 * @name dropdownToggle
 * @restrict ACE
 *
 * @description
 * This extra directive provide dropdown toggle specifically to bootstrap-select without loading bootstrap.js.
 *
 */
function dropdownToggleDirective() {
    return {
        restrict: 'ACE',
        priority: 101,
        link: function (scope, element, attrs) {
            var toggleFn = function (e) {
                var parent = angular.element(this).parent();
                angular.element('.bootstrap-select.open', element)
                    .not(parent)
                    .removeClass('open');
                parent.toggleClass('open');
            };
            element.on('click.bootstrapSelect', '.dropdown-toggle', toggleFn);
            scope.$on('$destroy', function () {
                element.off('.bootstrapSelect');
            });
        }
    };
}
/**
 * @ngdoc directive
 * @name dropdownClear
 * @restrict ACE
 *
 * @description
 * This extra directive provide the closing of ALL open dropdowns clicking away
 *
 */
function dropdownCloseDirective() {
    return {
        restrict: 'ACE',
        priority: 101,
        link: function (scope, element, attrs) {
            var hideFn = function (e) {
                var parent = e.target.tagName !== 'A' && angular.element(e.target).parents('.bootstrap-select');
                angular.element('.bootstrap-select.open', element)
                    .not(parent)
                    .removeClass('open');
            };
            angular.element(document).on('click.bootstrapSelect', hideFn);
            scope.$on('$destroy', function () {
                angular.element(document).off('.bootstrapSelect');
            });
        }
    };
}
/**
 * @ngdoc module
 * @name angular-bootstrap-select
 * @description
 * Angular bootstrap-select.
 */
angular.module('angular-bootstrap-select', [])
    .directive('selectpicker', ['$parse', '$timeout', selectpickerDirective]);
/**
 * @ngdoc directive
 * @name selectpicker
 * @restrict A
 *
 * @param {object} selectpicker Directive attribute to configure bootstrap-select, full configurable params can be found in [bootstrap-select docs](http://silviomoreto.github.io/bootstrap-select/).
 * @param {string} ngModel Assignable angular expression to data-bind to.
 *
 * @description
 * The selectpicker directive is used to wrap bootstrap-select.
 */
function selectpickerDirective($parse, $timeout) {
    return {
        restrict: 'A',
        priority: 1000,
        link: function (scope, element, attrs) {
            function refresh(newVal) {
                scope.$applyAsync(function () {
                    if (attrs.ngOptions && /track by/.test(attrs.ngOptions)) element.val(newVal);
                    element.selectpicker('refresh');
                });
            }
            attrs.$observe('spTheme', function (val) {
                $timeout(function () {
                    element.data('selectpicker').$button.removeClass(function (i, c) {
                        return (c.match(/(^|\s)?btn-\S+/g) || []).join(' ');
                    });
                    element.selectpicker('setStyle', val);
                });
            });
            $timeout(function () {
                element.selectpicker($parse(attrs.selectpicker)());
                element.selectpicker('refresh');
            });
            if (attrs.ngModel) {
                scope.$watch(attrs.ngModel, refresh, true);
            }
            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, refresh, true);
            }
            scope.$on('$destroy', function () {
                $timeout(function () {
                    element.selectpicker('destroy');
                });
            });
        }
    };
}
