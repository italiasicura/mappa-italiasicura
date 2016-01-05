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

	
	
/*
function setSidebarHeight(target, offset) {
	var offset = offset
	if (offset == undefined) { offset = 25 }
	var top = $(target).parent('aside').css('top')
	// console.log(top); 
	if (top == undefined || top == 'auto' ) { top = 65 }
	else { top = parseInt(top.replace("px", ""));  }
	var bottom = $('.bottom-box').outerHeight();
	console.log($(window).height(), offset, top, bottom); 
	if (bottom == undefined) { bottom = 0 }
	var h = $(window).height()  - offset - top - bottom; 
	$(target).css( { 'max-height' : h + 'px' }); 
	$(target).getNiceScroll().resize();
}
*/

angular.module('ItaliasicuraApp.controllers', [])
    .run(function($rootScope, $http) {
        $http.get('data/lastUpdateDate.txt').success(function (response) {
            $rootScope.dataUpdateDate = response;
        });
		$rootScope.setSidebarHeight = function(target, offset) {
			setTimeout(function(){ 
				var offset = offset
				if (offset == undefined) { offset = 25 }
				var top = $(target).parent('aside').css('top')
				if (top == undefined || top == 'auto' ) { top = 65 }
				else { top = parseInt(top.replace("px", ""));  }
				var bottom = $('.bottom-box').outerHeight();
				if (bottom == undefined) { bottom = 0 }
				var h = $(window).height()  - offset - top - bottom; 
				$(target).css( { 'height' : h + 'px' }); 
				$(target).css( { 'max-height' : h + 'px' }); 
				$(target).getNiceScroll().resize();
			}, 100);
		}

$rootScope.sizeOf = function(obj) {
    return Object.keys(obj).length;
};
    }).controller("homeController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location,$stateParams) {
        angular.extend($scope, {
            type:'home'

        });
        if (getCookie("cb-enabled")=="accepted") {
          ga('set','page', $location.path());
          ga('send', 'pageview');
        }

    }).controller("interventiController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location,$stateParams) {
        angular.extend($scope, {
            center: {
                lat: 42,
                lon: 12,
                zoom: 6,
                bbox:null
            },
            map:{},
            mousePosition: {coordinatesHDMS:'-'},
            mouseMoveEntity:{},
            mouseMoveIntervento:{},
            mouseMoveInterventoBDA:{},
            mouseMoveInterventoPN:{},
            projection: 'EPSG:4326',
            selection:false,
            selected:null,
            type:'interventi',
            typeSelection:null,
            loader: false,
            hashtag : 'italiasicura',
            firstLoad: true,
            slidertweet:false,
            sliderflickr:false,
            sliderInt:false,
			expanded:false,
            datagraph:{},
            graphlabel:{}
        });
        if (getCookie("cb-enabled")=="accepted"){
          ga('set','page', $location.path());
          ga('send', 'pageview');
        }
		
		$scope.createGraph=function(){
			numeral.language('it', {
				delimiters: {
					thousands: '.',
					decimal: ','
				},
				abbreviations: {
					thousand: 'k',
					million: 'm',
					billion: 'b',
					trillion: 't'
				},
				currency: {
					symbol: '€'
				}
		});
		numeral.language('it');
		var options = {
			tooltipFontSize: 10,
			//tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
			tooltipTemplate: "<%=label%>: <%= numeral(value).format('0,0') %> - <%= numeral(circumference / 6.283).format('(0[.]00%)') %>",
			percentageInnerCutout : 60
		};
		Chart.defaults.global.animation = true;
		Chart.defaults.global.tooltipFontSize = 10;
		isGEOservice.getInfoInterventiDashboard().success(function (response) {
				$scope.graphdata = response;
		var tipo_dis = new Chart(document.getElementById("tipo-dis").getContext("2d")).Doughnut($scope.graphdata.tipo_dissesto,
		$.extend({},options,{customTooltips: function(tooltip) {
			var tooltipEl = $('#tt-tipo-dis');
				if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
				tooltipEl.removeClass('above below');
				tooltipEl.addClass(tooltip.yAlign);
				tooltipEl.html(tooltip.text);
				var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
				tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
			}
		}));
		var fase = new Chart(document.getElementById("fase").getContext("2d")).Doughnut($scope.graphdata.fase_attuazione,
		$.extend({},options,{customTooltips: function(tooltip) {
			var tooltipEl = $('#tt-fase');
			if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
			tooltipEl.removeClass('above below');
			tooltipEl.addClass(tooltip.yAlign);
			tooltipEl.html(tooltip.text);
			var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
			tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
		}
	}));
var importo_fi_num = new Chart(document.getElementById("importo-fi-num").getContext("2d")).Doughnut($scope.graphdata.importo_finanziato_num,
$.extend({},options,{customTooltips: function(tooltip) {
	var tooltipEl = $('#tt-importo-fi-num');
        if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign);
        tooltipEl.html(tooltip.text);
        var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
        tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
    }
}));
var importo_fi_euro = new Chart(document.getElementById("importo-fi-euro").getContext("2d")).Doughnut($scope.graphdata.importo_finanziato_euro,
$.extend({},options,{tooltipTemplate: "<%=label%>: <%= numeral(value).format('0,0[.]00$') %> - <%= numeral(circumference / 6.283).format('(0[.][00]%)') %>",customTooltips: function(tooltip) {
	var tooltipEl = $('#tt-importo-fi-euro');
        if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign);
        tooltipEl.html(tooltip.text);
        var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
        tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
    }
}));
var ente_attuatore = new Chart(document.getElementById("ente-attuatore").getContext("2d")).Doughnut($scope.graphdata.ente_attuatore,
$.extend({},options,{customTooltips: function(tooltip) {
	var tooltipEl = $('#tt-ente-attuatore');
        if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign);
        tooltipEl.html(tooltip.text);
        var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
        tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
    }
}));
var anno_fi = new Chart(document.getElementById("anno-fi").getContext("2d")).Doughnut($scope.graphdata.anno_finanziamento,
$.extend({},options,{customTooltips: function(tooltip) {
	var tooltipEl = $('#tt-anno-fi');
        if (!tooltip) { tooltipEl.css({opacity: 0}); return; }
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign);
        tooltipEl.html(tooltip.text);
        var top = (tooltip.yAlign == 'above') ? tooltip.y - tooltip.caretHeight - tooltip.caretPadding : tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
        tooltipEl.css({opacity: 1, left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px', top: tooltip.chart.canvas.offsetTop + top + 'px', fontFamily: tooltip.fontFamily, fontSize: tooltip.fontSize, fontStyle: tooltip.fontStyle  });
    }
}));

                    });
                };
				
				// end create graph
		
		// nice and pretty scrollbar
		$("#info-main").niceScroll({
			// touchbehavior:true,
			cursorcolor:"#ccc",
			// cursoropacitymax:0.7,
			// cursorwidth:8,
			// background:"transparent",
			// autohidemode:false,
			horizrailenabled : false
		});
		
		
		

        var cc = $scope.center;
        if($location.search().zoom)
            cc.zoom = parseInt($location.search().zoom);
        if($location.search().lat)
            cc.lat = parseFloat($location.search().lat);
        if($location.search().lon)
            cc.lon = parseFloat($location.search().lon);
        $scope.center = cc;
        if($location.search().name && $location.search().type){
            $scope.selection=true;
            $scope.selected={name:$location.search().name,type:$location.search().type};
			// if ($location.search().exp) {
				// var charts = $('#charts');
					// var direction = (screen.width<768)?'up':'left';
							// if (!$scope.expanded) {
					// if(screen.width>=768){
						// charts.css('min-height',$('#info-main').height());
						// $('.info-interventi').css('min-height',charts.height()-24-23-28);
					// }
					// charts.show();
					// charts.show('slide',{direction:direction},2);
						// $location.search('exp',true);
						// $scope.expanded=true;
					// $scope.createGraph();
							// } else {
								// charts.hide();
								// charts.hide('slide',{direction:direction},2, function(){
									// $scope.expanded=false;
								// });
								// $location.search('exp',null);
							// }
			// }
        }

        isGEOservice.getInfoInterventi().success(function (response) {
            //Digging into the response to get the relevant data
            $scope.infoInterventi = response.features[0].properties;
            /*console.log( $scope.infoInterventi.title);*/
        });
		
		
		
		
		
		
		
		// Resize info window INTERVENTI
		$(function() {
			$rootScope.setSidebarHeight("#info-main");
		}); 
		$(window).resize(function() { 
			$rootScope.setSidebarHeight("#info-main");
		});

//	isGEOservice.getInfoInterventiDashboard().success(function (response) {
            //Digging into the response to get the relevant data
//            $scope.graphdata = response;
//        });

		


		
        isGEOservice.getFlickr().success(function (response) {
            $scope.fphoto = response.items;
			// $rootScope.setSidebarHeight("#info-main");
        });


        function updateMouseMoveEntity(feature){
            $scope.mouseMoveEntity.name = feature.get('nome');
            $scope.mouseMoveEntity.parent = feature.get('nome_sup');
            $scope.mouseMoveEntity.superfice = feature.get('areakmq');
            $scope.mouseMoveEntity.superficepc = feature.get('areakmq_pc');
            $scope.mouseMoveEntity.popolazione = feature.get('pop');
            $scope.mouseMoveEntity.popolazionepc = feature.get('pop_pc');
            $scope.mouseMoveEntity.iactive = feature.get('icorso');
            $scope.mouseMoveEntity.iactiveimp = feature.get('icorso_imp_fi');
            $scope.mouseMoveEntity.iclosed = feature.get('iconc');
            $scope.mouseMoveEntity.iclosedimp = feature.get('iconc_imp_fi');
            $scope.mouseMoveEntity.iother = feature.get('ialtr');
            $scope.mouseMoveEntity.iotherimp = feature.get('ialtr_imp_fi');
            $scope.mouseMoveEntity.itot = feature.get('itot');
            $scope.mouseMoveEntity.itotimp = feature.get('itot_imp_fi');
			// idraulica
            $scope.mouseMoveEntity.areatscarsatot = feature.get('ap1kmq');
            $scope.mouseMoveEntity.areatscarsapc = feature.get('ap1_pc');
            $scope.mouseMoveEntity.areatmediatot = feature.get('ap2kmq');
            $scope.mouseMoveEntity.areatmediapc = feature.get('ap2_pc');
            $scope.mouseMoveEntity.areatelevatatot = feature.get('ap3kmq');
            $scope.mouseMoveEntity.areatelevatapc = feature.get('ap3_pc');
            $scope.mouseMoveEntity.poptscarsatot = feature.get('popp1');
            $scope.mouseMoveEntity.poptscarsapc = feature.get('popp1_pc');
            $scope.mouseMoveEntity.poptmediatot = feature.get('popp2');
            $scope.mouseMoveEntity.poptmediapc = feature.get('popp2_pc');
            $scope.mouseMoveEntity.poptelevatatot = feature.get('popp3');
            $scope.mouseMoveEntity.poptelevatapc = feature.get('popp3_pc');
            $scope.mouseMoveEntity.scuolescarsatot = feature.get('scp1');
            $scope.mouseMoveEntity.scuolescarsapc = feature.get('scp1_pc');
            $scope.mouseMoveEntity.scuolemediatot = feature.get('scp2');
            $scope.mouseMoveEntity.scuolemediapc = feature.get('scp2_pc');
            $scope.mouseMoveEntity.scuoleelevatatot = feature.get('scp3');
            $scope.mouseMoveEntity.scuoleelevatapc = feature.get('scp3_pc');
            $scope.mouseMoveEntity.beniscarsatot = feature.get('benp1');
            $scope.mouseMoveEntity.beniscarsapc = feature.get('bcp1_pc');
            $scope.mouseMoveEntity.benimediatot = feature.get('benp2');
            $scope.mouseMoveEntity.benimediapc = feature.get('bcp2_pc');
            $scope.mouseMoveEntity.benielevatatot = feature.get('benp3');
            $scope.mouseMoveEntity.benielevatapc = feature.get('bcp3_pc');
			// frane
			var defString = "#########";
			var afr = feature.get('afr');
			if (afr == undefined ) 
				afr = defString;
			var afr = afr.split("#");
			var popfr = feature.get('popfr');
			if (popfr == undefined ) 
				popfr = defString;
			var popfr = popfr.split("#");
			var impfr = feature.get('impfr');
			if (impfr == undefined ) 
				impfr = defString;
			var impfr = impfr.split("#");
			var bcfr = feature.get('bcfr');
			if (bcfr == undefined ) 
				bcfr = defString;
			var bcfr = bcfr.split("#");
			// superfice
            $scope.mouseMoveEntity.frareat1tot = afr[0];
            $scope.mouseMoveEntity.frareat1pc = afr[1];
			$scope.mouseMoveEntity.frareat2tot = afr[2];
            $scope.mouseMoveEntity.frareat2pc = afr[3];
			$scope.mouseMoveEntity.frareat3tot = afr[4];
            $scope.mouseMoveEntity.frareat3pc = afr[5];
			$scope.mouseMoveEntity.frareat4tot = afr[6];
            $scope.mouseMoveEntity.frareat4pc = afr[7];
			$scope.mouseMoveEntity.frareat5tot = afr[8];
            $scope.mouseMoveEntity.frareat5pc = afr[9];
			// popolazione
            $scope.mouseMoveEntity.frpopt1tot = popfr[0];
            $scope.mouseMoveEntity.frpopt1pc = popfr[1];
			$scope.mouseMoveEntity.frpopt2tot = popfr[2];
            $scope.mouseMoveEntity.frpopt2pc = popfr[3];
			$scope.mouseMoveEntity.frpopt3tot = popfr[4];
            $scope.mouseMoveEntity.frpopt3pc = popfr[5];
			$scope.mouseMoveEntity.frpopt4tot = popfr[6];
            $scope.mouseMoveEntity.frpopt4pc = popfr[7];
			$scope.mouseMoveEntity.frpopt5tot = popfr[8];
            $scope.mouseMoveEntity.frpopt5pc = popfr[9];
			// imprese
			$scope.mouseMoveEntity.frimp1tot = impfr[0];
            $scope.mouseMoveEntity.frimp1pc = impfr[1];
			$scope.mouseMoveEntity.frimp2tot = impfr[2];
            $scope.mouseMoveEntity.frimp2pc = impfr[3];
			$scope.mouseMoveEntity.frimp3tot = impfr[4];
            $scope.mouseMoveEntity.frimp3pc = impfr[5];
			$scope.mouseMoveEntity.frimp4tot = impfr[6];
            $scope.mouseMoveEntity.frimp4pc = impfr[7];
			$scope.mouseMoveEntity.frimp5tot = impfr[8];
            $scope.mouseMoveEntity.frimp5pc = impfr[9];
			// beni
			$scope.mouseMoveEntity.frbeni1tot = bcfr[0];
            $scope.mouseMoveEntity.frbeni1pc = bcfr[1];
			$scope.mouseMoveEntity.frbeni2tot = bcfr[2];
            $scope.mouseMoveEntity.frbeni2pc = bcfr[3];
			$scope.mouseMoveEntity.frbeni3tot = bcfr[4];
            $scope.mouseMoveEntity.frbeni3pc = bcfr[5];
			$scope.mouseMoveEntity.frbeni4tot = bcfr[6];
            $scope.mouseMoveEntity.frbeni4pc = bcfr[7];
			$scope.mouseMoveEntity.frbeni5tot = bcfr[8];
            $scope.mouseMoveEntity.frbeni5pc = bcfr[9];
			
			$rootScope.setSidebarHeight("#info-main")
        }

        $scope.$on('openlayers.layers.shape', function(event, feature) {
            $scope.$apply(function(scope) {
                if (feature && !$scope.selection) {
                    $scope.typeSelection = "shape";
					var shapeType = '';
					if (feature.get("nome") == "Italia")
						shapeType = 'Italia';
					else if($scope.zoom<9)
						shapeType = 'regione';
					else if($scope.zoom<12)
						shapeType = 'provincia';
					else if($scope.zoom<15)
						shapeType = 'comune';
					else
						shapeType = 'localita';
					$scope.mouseMoveEntity.shapeType = shapeType;
                    updateMouseMoveEntity(feature);
                }else if($scope.selection){

                }else{
                    $scope.mouseMoveEntity= {};
                }
            });
        });

        $scope.$on('openlayers.layers.selectShape', function(event, feature) {
            $scope.$apply(function(scope) {
                $scope.selection = true;
                var shapeType = '';
				if (feature.get("nome") == "Italia")
					shapeType = 'Italia';
                else if($scope.zoom<9)
                    shapeType = 'regione';
                else if($scope.zoom<12)
                    shapeType = 'provincia';
                else if($scope.zoom<15)
                    shapeType = 'comune';
                else
                    shapeType = 'localita';
				$scope.mouseMoveEntity.shapeType = shapeType;
                $scope.selected = {name:feature.get('cod'),type:shapeType};
                $scope.typeSelection = "shape";
                updateMouseMoveEntity(feature);
                $location.search('name',$scope.selected.name);
                $location.search('type',$scope.selected.type);
                $location.search('zoom',$scope.zoom);
                var c = ol.proj.transform($scope.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                $location.search('lat',c[1]);
                $location.search('lon',c[0]);
               if($scope.slidertweet && $scope.sliderflickr){
                    scope.$emit('sliderstart');
                    scope.$emit('sliderfstart');
					// $rootScope.setSidebarHeight("#info-main", 140)
                }
                $location.search('exp',null);
                $scope.expanded = false;
            });
        });

        function updateMouseMoveIntervento(feature){
            $scope.mouseMoveIntervento.intervento = feature.get('int');
            $scope.mouseMoveIntervento.nr_lotti = feature.get('nr_lotti');
            $scope.mouseMoveIntervento.lotto = feature.get('lotto');
            $scope.mouseMoveIntervento.norma = feature.get('norma');
            $scope.mouseMoveIntervento.descrizione = feature.get('desc_int');
            $scope.mouseMoveIntervento.tipo_dissesto = feature.get('tipo_ds');
            $scope.mouseMoveIntervento.ente_prop = feature.get('ente_prop');
            $scope.mouseMoveIntervento.imp_finanziato = feature.get('importo_fi');
            $scope.mouseMoveIntervento.posizione = feature.get('posizione');
			// $rootScope.setSidebarHeight("#info-main");
        }

        $scope.$on('openlayers.layers.intervento', function(event, feature) {
            $scope.$apply(function(scope) {
                if (feature && !$scope.selection) {
                    $scope.typeSelection = "intervento";
                    //console.log(feature);
                    updateMouseMoveIntervento(feature);
                }else if($scope.selection){

                }else{
                    //console.log('vuoto');
                    $scope.mouseMoveIntervento= {};
                }
            });
        });

        $scope.$on('openlayers.layers.selectIntervento', function(event, feature) {
            if($scope.sliderInt){
                $scope.sliderInt.destroySlider();
            }
				
                $scope.selection = true;
                $scope.selected = {name:feature.get('int'),type:'intervento'};
                $scope.typeSelection = "intervento";
                updateMouseMoveIntervento(feature);
                $location.search('name',$scope.selected.name);
                $location.search('type',$scope.selected.type);
                $location.search('zoom',$scope.zoom);
                var c = ol.proj.transform($scope.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                $location.search('lat',c[1]);
                $location.search('lon',c[0]);
                if($scope.sliderInt){
                    $scope.sliderInt.destroySlider();
                    $scope.sliderInt=false;
                }
                isGEOservice.getLotti(feature.get('int')).success(function (response) {
		    //$scope.arrayLotti=response.lotti;
                    $scope.arrayLotti = $.map(response.lotti, function(el) { return el; });
                    $scope.updateSliderGraph($scope.arrayLotti,0);
                });
			$rootScope.setSidebarHeight("#info-main") 

        });

        function updateMouseMoveInterventoBDA(feature){
            $scope.mouseMoveInterventoBDA.intervento = feature.get('int');
            $scope.mouseMoveInterventoBDA.titolo_progettoestratto = feature.get('desc_int');
            $scope.mouseMoveInterventoBDA.programma = feature.get('norma');
            $scope.mouseMoveInterventoBDA.cup = feature.get('cup');
            $scope.mouseMoveInterventoBDA.fase_attuale_macro = feature.get('fase_attuale_macro');
            $scope.mouseMoveInterventoBDA.n_cig = feature.get('n_cig');
            $scope.mouseMoveInterventoBDA.codice_cig = feature.get('codice_cig');
            $scope.mouseMoveInterventoBDA.sogg_att = feature.get('ente_prop');
//            $scope.mouseMoveInterventoBDA.comune = feature.get('comune');
//            $scope.mouseMoveInterventoBDA.provincia = feature.get('provincia');
//            $scope.mouseMoveInterventoBDA.regione = feature.get('regione');
            $scope.mouseMoveInterventoBDA.valore = feature.get('importo_fi');
	}

        $scope.$on('openlayers.layers.intervento_bda', function(event, feature) {
            $scope.$apply(function(scope) {
                if (feature && !$scope.selection) {
                    $scope.typeSelection = "intervento_bda";
                    updateMouseMoveInterventoBDA(feature);
                }else if($scope.selection){

                }else{
                    //console.log('vuoto');
                    $scope.mouseMoveInterventoBDA= {};
                }
            });
        });

        $scope.$on('openlayers.layers.selectInterventoBDA', function(event, feature) {
            if($scope.sliderInt){
                $scope.sliderInt.destroySlider();
            }
				$scope.expanded = false;
                $scope.selection = true;
                $scope.selected = {name:feature.get('int'),type:'intervento_bda'};
                $scope.typeSelection = "intervento_bda";
                updateMouseMoveInterventoBDA(feature);
                $location.search('name',$scope.selected.name);
                $location.search('type',$scope.selected.type);
                $location.search('zoom',$scope.zoom);
                var c = ol.proj.transform($scope.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                $location.search('lat',c[1]);
                $location.search('lon',c[0]);
                if($scope.sliderInt){
                    $scope.sliderInt.destroySlider();
                    $scope.sliderInt=false;
                }
        });

        function updateMouseMoveInterventoPN(feature){
            $scope.mouseMoveInterventoPN.codice = feature.get('Codice');
            $scope.mouseMoveInterventoPN.citta = feature.get('citta');
            $scope.mouseMoveInterventoPN.prog = feature.get('prog');
            $scope.mouseMoveInterventoPN.titolo = feature.get('Titolo');
            $scope.mouseMoveInterventoPN.posizione = feature.get('Posizione');
            //$scope.mouseMoveInterventoPN.cod_istr = feature.get('cod_istr');
            $scope.mouseMoveInterventoPN.imptot = feature.get('imptot');
            //$scope.mouseMoveInterventoPN.impric = feature.get('impric');
        }

        $scope.$on('openlayers.layers.intervento_pn', function(event, feature) {
            $scope.$apply(function(scope) {
                if (feature && !$scope.selection) {
                    $scope.typeSelection = "intervento_pn";
                    updateMouseMoveInterventoPN(feature);
                }else if($scope.selection){
						
                }else{
                    //console.log('vuoto');
                    $scope.mouseMoveInterventoPN= {};
                }
            });
        });

        $scope.$on('openlayers.layers.selectInterventoPN', function(event, feature) {
            if($scope.sliderInt){
                $scope.sliderInt.destroySlider();
            }
				// $scope.resetSelection();
				$scope.expanded = false;
                $scope.selection = true;
                $scope.selected = {name:feature.get('Codice'),type:'intervento_pn'};
                $scope.typeSelection = "intervento_pn";
                updateMouseMoveInterventoPN(feature);
                $location.search('name',$scope.selected.name);
                $location.search('type',$scope.selected.type);
                $location.search('zoom',$scope.zoom);
                var c = ol.proj.transform($scope.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                $location.search('lat',c[1]);
                $location.search('lon',c[0]);
                if($scope.sliderInt){
                    $scope.sliderInt.destroySlider();
                    $scope.sliderInt=false;
                }
        });

        $scope.$on('openlayers.map.pointermove', function(event, coord) {
            $scope.$apply(function() {
                if ($scope.projection === coord.projection) {
                    $scope.mousePosition = coord;
                } else {
                    var p = ol.proj.transform([ coord.lon, coord.lat ], coord.projection, $scope.projection);
		    $scope.mousePosition = {
                        lat: p[1],
                        lon: p[0],
                        coordinatesHDMS: ol.coordinate.toStringHDMS(p)
                    }
                }
            });
        });
        $scope.$on('openlayers.map.zoom', function(event, type) {
            if(!$scope.firstLoad){
                $location.search('name',null);
                $location.search('type',null);
                $scope.resetSelection();
            }
            $scope.firstLoad=false;
            //$scope.selection=false;
            $location.search('zoom',$scope.zoom);
            var c = ol.proj.transform($scope.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
            $location.search('lat',c[1]);
            $location.search('lon',c[0]);
            // $rootScope.setSidebarHeight("#info-main");   
        });

        $scope.search = function(location){
		if(location == undefined)
			return;
	$scope.location = location;
		
            isGEOservice.searchLocation($scope.location).then(function(response){
                response=response.data;
                if(response.length>0){
                        $scope.center.lat=parseFloat(response[0].lat);
                        $scope.center.lon=parseFloat(response[0].lon);
                        $scope.center.zoom=12;
                        $scope.center.bbox=response[0].boundingbox;
                }else{
                    console.log('No result found for ['+$scope.location+']');
                }

            });
        };

        $scope.$watch("loader", function(loader) {
            if(loader){
                $('#map-loader').show();
            }else{
                $('#map-loader').hide();
            }
        });

        $scope.$watch("selection", function(select) {
            if(select){
                setTimeout(function(){
                    $scope.$emit('sliderstart');
                    $scope.$emit('sliderfstart');
                }, 500);
            }
        });

        $scope.$on('sliderstart', function() {

            if($scope.slidertweet){
                $scope.slidertweet.reloadSlider();
            }else{
                $scope.slidertweet=$('.tweetFavList').bxSlider({
                    mode: 'fade',
                    auto:true,
                    pager:false,
                    controls:false,
                    autoControls: true
                });
            }

        });


        $scope.$on('sliderfstart', function() {

            if($scope.sliderflickr){
                $scope.sliderflickr.reloadSlider();
            }else{
                $scope.sliderflickr=$('.photolist').bxSlider({
                    minSlides: 3,
                    maxSlides: 10,
                    moveSlides:1,
                    slideWidth: 100,
                    slideMargin: 10,
                    auto:true,
                    pager:false,
                    controls:false,
                    autoControls: true
                });
            }


        });

        function insertCount(cur,tot) {
            $('.box-lotti .title-lotti h4').html('Cantiere ' + ( cur+1) + ' di ' +  tot);
        };

        $scope.$on('slideristart', function() {

            if($scope.sliderInt){
               $scope.sliderInt.destroySlider();
            }

                $('.box-lotti').addClass('active');
                $scope.sliderInt=$('.sliderLotti');
                $scope.sliderInt.bxSlider({
                    startSlide: $scope.mouseMoveIntervento.lotto-1,
		            auto: false,
                    pager: false,
                    infiniteLoop:false,
                    nextSelector: $('#lnext'),
                    prevSelector: $('#lprev'),
                    prevText: '<i class="fa fa-angle-left fa-lg"></i>',
                    nextText: '<i class="fa fa-angle-right fa-lg"></i>',
                    onSliderLoad: function () {
                        insertCount($scope.sliderInt.getCurrentSlide(),$scope.sliderInt.getSlideCount());
                    },
                    onSlideAfter: function () {
                        insertCount($scope.sliderInt.getCurrentSlide(),$scope.sliderInt.getSlideCount());
                    	 $scope.updateSliderGraph($scope.arrayLotti,$scope.sliderInt.getCurrentSlide());
			}
                });



        });

        $(document).on('click','.navigation-addons a',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($scope.selection){
                $('#right-panel').toggleClass('active');
            }
        });


    } ).controller("entityController", function($scope, $http, isGEOservice, $routeParams,$rootScope) {



    }).controller("emergenzeController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location,$stateParams) {
        angular.extend($scope, {
            center: {
                lat: 42,
                lon: 12,
                zoom: 6,
                bbox:null
            },
            map:{},
            mousePosition: {coordinatesHDMS:'-'},
            mouseMoveEntity:{},
            projection: 'EPSG:4326',
            selection:false,
            selected:null,
            type:'emergenze',
            typeSelection:null,
            loader: false,
            hashtag : 'italiasicura',
            firstLoad: true,
            slidertweet:false,
            sliderflickr:false,
            sliderEm:false
        });
        if (getCookie("cb-enabled")=="accepted"){
          ga('set','page', $location.path());
          ga('send', 'pageview');
        }
		
		
		// Resize info window EMERGENZE
		// nice and pretty scrollbar
		$("#emergenze-main").niceScroll({
			// touchbehavior:true,
			cursorcolor:"#ccc",
			// cursoropacitymax:0.7,
			// cursorwidth:8,
			// background:"transparent",
			// autohidemode:false,
			horizrailenabled : false
		});
		$( document ).ready(function() {
			$rootScope.setSidebarHeight("#emergenze-main", -65);
		}); 
		$(window).resize(function() {
			$rootScope.setSidebarHeight("#emergenze-main", 25);
			if ($(window).height() < 600) {
				$('#info-main').css('min-height', '378px!important');
			}
			else {
				// $('#info-main').css('min-height' : '310px!important');
			}
		});
		
		

        if($location.search().name){
            $scope.selection=true;
            $scope.selected={name:$location.search().name};
        }

        isGEOservice.getInfoEmergenze().success(function (response) {
            //Digging into the response to get the relevant data
            $scope.infoEmergenze = response.features[0].properties;
        });

        isGEOservice.getFlickr().success(function (response) {

            $scope.fphoto = response.items;
        });


        function updateMouseMoveEmergenza(feature){
            $scope.mouseMoveEntity.name = feature.get('nome');
            $scope.mouseMoveEntity.parent = feature.get('nome_sup');
            $scope.mouseMoveEntity.emergenzetot = feature.get('etot');
            $scope.mouseMoveEntity.emergenzeatt = feature.get('eatt');
            $scope.mouseMoveEntity.importoreg = feature.get('eiseg');
            $scope.mouseMoveEntity.importocm = feature.get('eistanz');
            $scope.mouseMoveEntity.importoerog = feature.get('eierog');
            $scope.mouseMoveEntity.importostim = feature.get('eistim');
            $scope.mouseMoveEntity.importostim_a = feature.get('eistim_a');
            $scope.mouseMoveEntity.importostim_b = feature.get('eistim_b');
            $scope.mouseMoveEntity.importostim_c = feature.get('eistim_c');
			$rootScope.setSidebarHeight("#emergenze-main")
        }

        $scope.$on('openlayers.layers.shape', function(event, feature) {
            $scope.$apply(function(scope) {
                if (feature && !$scope.selection) {
                    updateMouseMoveEmergenza(feature);
                }else if($scope.selection){
		
                }else{
                    $scope.mouseMoveEntity= {};
                }
            });
			// $rootScope.setSidebarHeight("#emergenze-main")
        });
        $scope.$on('openlayers.map.pointermove', function(event, coord) {
            $scope.$apply(function(scope) {
                if ($scope.projection === coord.projection) {
                    $scope.mousePosition = coord;
                } else {
                    var p = ol.proj.transform([ coord.lon, coord.lat ], coord.projection, $scope.projection);
                    $scope.mousePosition = {
                        lat: p[1],
                        lon: p[0],
			            coordinatesHDMS: ol.coordinate.toStringHDMS(p)
                    }
                }
            });
        });

        $scope.$on('openlayers.map.zoom', function(type) {
            if(!$scope.firstLoad){
                $scope.resetSelection();
            }
            $scope.firstLoad=false;
            //$scope.selection=false;
        });

        $scope.$on('openlayers.layers.selectShape', function(event, feature) {
            $scope.$apply(function(scope) {
                $scope.selection = true;
                $scope.selected = {name:feature.get('cod')};
                $scope.typeSelection = "shape";
                updateMouseMoveEmergenza(feature);
                $location.search('name',$scope.selected.name);
                if($scope.sliderEm){
                    $scope.sliderEm.destroySlider();
                    $scope.sliderEm=false;
				}
                isGEOservice.getEmergenze(feature.get('cod')).success(function (response) {
                    $scope.arrayEmergenze=response.emergenze;
                });
            });
        });

        $scope.$watch("selection", function(select) {
            if(select){
				$scope.$emit('sliderstart');
				$scope.$emit('sliderfstart');
            }
        });

        $scope.$watch("loader", function(loader) {
            $('#map-loader').hide();
        });

        $scope.$on('sliderstart', function() {

            if($scope.slidertweet){
                $scope.slidertweet.reloadSlider();
            }else{
                $scope.slidertweet=$('.tweetFavList').bxSlider({
                    mode: 'fade',
                    auto:true,
                    pager:false,
                    controls:false,
                    autoControls: true
                });
            }


        });
        $scope.$on('sliderfstart', function() {

            if($scope.sliderflickr){
                $scope.sliderflickr.reloadSlider();
            }else{
                $scope.sliderflickr=$('.photolist').bxSlider({
                    minSlides: 3,
                    maxSlides: 10,
                    moveSlides:1,
                    slideWidth: 100,
                    slideMargin: 10,
                    auto:true,
                    pager:false,
                    controls:false,
                    autoControls: true
                });
            }
        });

        function insertCount(cur,tot) {
            $('.eactive h4').html('Emergenza ' + ( cur+1) + ' di ' +  tot);
        };

        $scope.$on('sliderestart', function() {

            if($scope.sliderEm){
                $scope.sliderEm.reloadSlider();
            }else{
                $('.box-emergenze').addClass('active');
                $scope.sliderEm=$('.sliderEmergenze');
                $scope.sliderEm.bxSlider({
                    auto: false,
                    pager: false,
                    nextSelector: $('#lnext'),
                    prevSelector: $('#lprev'),
                    prevText: '<i class="fa fa-angle-left fa-lg"></i>',
                    nextText: '<i class="fa fa-angle-right fa-lg"></i>',
                    onSliderLoad: function () {
                        insertCount($scope.sliderEm.getCurrentSlide(),$scope.sliderEm.getSlideCount());
                    },
                    onSlideAfter: function () {
                        insertCount($scope.sliderEm.getCurrentSlide(),$scope.sliderEm.getSlideCount());
                    }
                });
            }


        });

        $(document).on('click','.navigation-addons a',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($scope.selection){
                $('#right-panel').toggleClass('active');
            }
        });

    }).controller("dashboardController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$route,$location,$stateParams,$state) {
        angular.extend($scope, {
            type:'dashboard'
        });
        if (getCookie("cb-enabled")=="accepted"){
          ga('set','page', $location.path());
          ga('send', 'pageview');
        }

//        console.log('controller root');
//        console.log($stateParams);

        $scope.ambiti_promise = isGEOservice.getAmbiti();

        $scope.ambiti_promise.then(function(result) {
            $scope.ambiti = result.data.values;
            if($location.path() === '/sintesi'){
                $scope.current_ambito =  $scope.ambiti[0];
                $state.go('sintesi.ambito', {ambito:$scope.current_ambito.name});
            }
        });

    }).controller("dashboardControllerAmbito", function($scope, $http, isGEOservice, $routeParams,$rootScope,$route,$location,$stateParams,$state,$q) {
//        console.log('controller ambito');
//        console.log($stateParams);

        $scope.current_ambito_promise = $scope.ambiti_promise.then(function(result) {
            var deferred = $q.defer();
            /*if($stateParams.ambito === '') {
             $scope.current_ambito =  $scope.ambiti[0];
             }else{*/
            for(var i=0 ; i< $scope.ambiti.length ; i++){
                if($scope.ambiti[i].name === $stateParams.ambito){
                    $scope.current_ambito =  $scope.ambiti[i];
                    break;
                }
            }
            //}
            deferred.resolve($scope.current_ambito);
            return deferred.promise;
        });

        $scope.temi_promise = $scope.current_ambito_promise.then(function(result) {
            return isGEOservice.getTemi($scope.current_ambito.name);
        });

        $scope.temi_promise.then(function(result) {
            $scope.temi = result.data.values;
            $scope.tema_label = result.data.label_tema;
	    $scope.warning = result.data.warning;
            if($location.path() === '/sintesi/'+$scope.current_ambito.name){
                $scope.current_tema =  $scope.temi[0];
                $state.go('sintesi.ambito.tema', {ambito:$scope.current_ambito.name,tema:$scope.current_tema.name});
            }
        });

    }).controller("dashboardControllerTema", function($scope, $http, isGEOservice, $routeParams,$rootScope,$route,$location,$stateParams,$state,$q) {
//        console.log('controller tema');
//        console.log($stateParams);

        $scope.current_tema_promise = $scope.temi_promise.then(function(result) {
            var deferred = $q.defer();
            /*if($stateParams.tema === '') {
             $scope.current_tema = $scope.temi[0];
             }else{*/
            for(var i=0 ; i< $scope.temi.length ; i++){
                if($scope.temi[i].name === $stateParams.tema){
                    $scope.current_tema = $scope.temi[i];
                    break;
                }
            }
            //}
            deferred.resolve($scope.current_tema);
            return deferred.promise;
        });

        $scope.formati_promise = $scope.current_tema_promise.then(function(result) {
            return isGEOservice.getFormati($scope.current_ambito.name,$scope.current_tema.name);
        });

        $scope.formati_promise.then(function(result) {
            $scope.formati = result.data.values;
	    $scope.formato_label = result.data.label_formato;
            if($location.path() === '/sintesi/'+$scope.current_ambito.name+'/'+$scope.current_tema.name){
                $scope.current_formato =  $scope.formati[0];
                $state.go('sintesi.ambito.tema.formato', {ambito:$scope.current_ambito.name,tema:$scope.current_tema.name,formato:$scope.current_formato.name});
            }
        });

    }).controller("dashboardControllerFormato", function($scope, $http, isGEOservice, $routeParams,$rootScope,$route,$location,$stateParams,$state,$q) {
//        console.log('controller formato');
//        console.log($stateParams);

        $scope.current_formato_promise = $scope.formati_promise.then(function(result) {
            $scope.formati = result.data.values;
            var deferred = $q.defer();
            /*if($stateParams.formato === '') {
             $scope.current_formato = $scope.formati[0];
             }else{*/
            for(var i=0 ; i< $scope.formati.length ; i++){
                if($scope.formati[i].name === $stateParams.formato){
                    $scope.current_formato = $scope.formati[i];
                    break;
                }
            }
            //}
            deferred.resolve($scope.current_formato);
            return deferred.promise;
        });

        $scope.risultati_promise = $scope.current_formato_promise.then(function(result) {
            return isGEOservice.getResults($scope.current_ambito.name,$scope.current_tema.name,$scope.current_formato.name);
        });

        var asArray = function(json){
            var array = [];
            for(var i=0 ; i<Object.keys(json).length ; i++){
                array[i] = json[i+1];
            }
            return array;
        }

        $scope.risultati_promise.then(function(result) {
	    $scope.num_dash = 0;
	    if(result.data.results.regioni){
	        $scope.regioni = asArray(result.data.results.regioni.top);
        	$scope.regioni_highest = $scope.regioni[0].valore;
		$scope.num_dash++;
	    }
            if(result.data.results.province){
		$scope.province = asArray(result.data.results.province.top);
            	$scope.province_highest = $scope.province[0].valore;
		$scope.num_dash++;
	    }
	    if(result.data.results.comuni){
	        $scope.comuni = asArray(result.data.results.comuni.top);
		$scope.comuni_highest = $scope.comuni[0].valore;
		$scope.num_dash++;
	    }
        });

        $('.navigation-addons a').on('click',function(e){
            e.preventDefault();
            if($(this).parent().hasClass('active')===$('#right-panel').hasClass('active')){
                $('#right-panel').toggleClass('active');
                if(!$('#right-panel').hasClass('active')){
                    e.stopPropagation();
                    $(this).parent().removeClass('active');
                }
            }

        });

    }).controller("pageController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
console.log('pageController');
        $scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'page',
            feedback:{}
        });

        if (getCookie("cb-enabled")=="accepted") {
          ga('set','page', $location.path());
          ga('send', 'pageview');
        }

    }).controller("guidaController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'guida'
        });
	}).controller("opendataController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'opendata'
        });
	}).controller("notelegaliController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'notelegali'
        });
	}).controller("progettoController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'progetto'
        });
	}).controller("creditiController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'crediti'
        });
	}).controller("opensourceController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'opensource'
        });
	}).controller("feedbackController", function($scope, $http, isGEOservice, $routeParams,$rootScope,$location) {
		$scope.statusfaq1 = true;
        angular.extend($scope, {
            type:'feedback',
			feedback:{}
        });
        $scope.sendComment = function(feedback) {
//		console.log(feedback);
                post_data = {'userName':feedback.nome, 'userEmail':feedback.email, 'userMessage':feedback.commento};

                //Ajax post data to server
                $.post('templates/sendmail.php', post_data, function(response){
                    $("#result").removeClass().addClass(response.type).html(response.text).slideDown().delay('4000').slideUp();
                    if(response.type=="success"){
			$scope.feedback = {};
                    }

                }, 'json');
        }


	});
	
