$("img.lazy").not('.adaptative').each(function() {
	$(this).attr('src', $(this).data('original'));
});
$('.item .imagen img.lazy').css('width', '100%');

var jRes = jRespond([
	{
		label: 'mobile',
		enter: 0,
		exit: 480
	}, {
		label: 'tablet',
		enter: 481,
		exit: 979
	}, {
		label: 'desktop',
		enter: 980,
		exit: 10000
	}
]);


if (jRes.getBreakpoint() == 'desktop') {
	$(".item img.lazy").hover(function() {
		var img = $(this);
		var images = [];

		if (img.data('original') != '') {
			images[0] = img.data('original');
		}
		if (img.data('thumbnail') != '') {
			images[1] = img.data('thumbnail');
		}
		if (img.data('path') != '') {
			images[2] = img.data('path');
		}

		var count = parseInt(images.length);

		var i = 0;

		(function animateImage() {
			img.attr('src', images[i]);
			i = i + 1;
			if (i == count) { i = 0;}
			timer = setTimeout(function() {
				animateImage();
			}, 500);
		})();
	}, function() {
		if (timer) {
			clearTimeout(timer);
			timer = 0;
		}
	});
}

jRes.addFunc({
	breakpoint: 'mobile',
	enter: function() {
		generateTinyFilters();
		generateLangMenu();
		loadChicaMes()
		loadChicaPortada()

		$("#filtros-desktop").hide();
		$('#phone-bar').hide();

		$('#map-link').children('img').attr('src', $('#map-link').children('img').data(jRes.getBreakpoint()));
		$('.item .imagen img.lazy').css('height', 'auto');

		$('img.adaptative').attr('src', function() {
			return $(this).data('src-' + jRes.getBreakpoint());
		});
	}
});

jRes.addFunc({
	breakpoint: 'tablet',
	enter: function() {

		generateTinyFilters();
		generateLangMenu();
		loadChicaMes()
		loadChicaPortada()
		$("#filtros-desktop").hide();

		$('#map-link img').attr('src', $('#map-link img').data(jRes.getBreakpoint()));
		$('.item .imagen img.lazy').css('height', 'auto');

		$('#phone-bar').css('display', 'none');

		$('img.adaptative').attr('src', function() {
			return $(this).data('src-' + jRes.getBreakpoint());
		});

		load_lazy_video();
	}
});

jRes.addFunc({
	breakpoint: 'desktop',
	enter: function() {

		loadChicaMes();
		loadChicaPortada()

		if ($('#filtros-mobile').children().length > 0) {
			$('#filtros-mobile').html('');
		}
		$("#filtros-desktop").show();
		$('#map-link img').attr('src', $('#map-link img').data(jRes.getBreakpoint()));

		set_navigation_bar_style();
		show_phone_bar_if_needed();

		$(window).on('scroll', function(e) {
			set_navigation_bar_style();
			show_phone_bar_if_needed();
			$('.item .imagen img.lazy').css('height', 'auto');

		});

		$('img.adaptative').attr('src', function() {
			return $(this).data('src-' + jRes.getBreakpoint());
		});

		load_lazy_video();
	}
});

if ($('#slider-bannermes').length > 0) {
	$('#slider-bannermes').bxSlider({
		auto: true,
		controls: true,
		infiniteLoop: true,
		pager: false,
	});
}

function set_navigation_bar_style() {
	var y = $(window).scrollTop();
	if (y >= 500) {
		$('#navigation').css('position', 'fixed');
		$('#navigation').addClass('tiny');
		$('#dropdown-left div').hide();
	} else {
		$('#navigation').css('position', 'absolute');
		$('#navigation').removeClass('tiny');
	}
}

function show_phone_bar_if_needed() {
	var y = $(window).scrollTop();
	if ($('#ficha-section').length > 0 && $(window).width() >= 980) {
		if (y >= 1000) {
			$('#navigation').hide();
			$('#phone-bar').css('display', 'block');
			$('#phone-bar').css('position', 'fixed');
		} else {
			$('#navigation').show();
			$('#phone-bar').css('display', 'none');
		}
	}
}

function loadChicaMes() {
	$('.chica-mes').each(function() {
		var img = $(this).data(jRes.getBreakpoint());
		$(this).children('a').css('background-image', "url('" + img + "')");
		$(this).children('img').load(function() {
			$(this).removeClass('loading-mes');
		});
	});

}

function loadChicaPortada() {
	var imgSel = $('#chica_portada img');
	var img_src = imgSel.data(jRes.getBreakpoint());
	imgSel.attr("src", img_src);
}


function generateLangMenu() {
	$('#menu').append($('#lang-list'));
	$('#lang-menu').remove();
	$.each($('#lang-list').children('li').children('a'), function(key, value) {
		$(value).text($(value).data('abrev'));
	});
}

function generateTinyFilters() {

	if ($('#filtros-mobile').children().length > 0) {
		$('#filtros-mobile').html('');
	}

	$("<select />").appendTo("#filtros-mobile");
	$("<option />", {
		"value": "",
		"text": "Filtrar"
	}).appendTo("#filtros-mobile select");

	$.each($('.filtro'), function(key, value) {

		$("<optgroup />", {
			"label": $(value).children('a').html(),
			"class": 'opt' + key,
			"data-id": $('> a', value).attr('id')
		}).appendTo("#filtros-mobile select");

		if ($(value).children('ul').length == 1) {
			$.each($(value).children('ul').children('li'), function(key2, value2) {
				var link = $('a', value2);
				if (link.length) {
					$("<option />", {
						"value": link.attr('href'),
						"text": link.html()
					}).appendTo("#filtros-mobile select .opt" + key);
				} else {
					link = $('div.anchor', value2);
					$("<option />", {
						"value": link.data('svc'),
						"text": link.text()
					}).appendTo("#filtros-mobile select .opt" + key);
				}

			});
		} else {
			$("<option />", {
				"value": $(value).children('a').attr('href'),
				"text": $(value).children('a').html()
			}).appendTo("#filtros-mobile select .opt" + key);
		}
	});
}

$(document).on('change', '#filtros-mobile select', function() {
	var val = $(this).val();
	location.href = 'http://' + location.hostname + val;
});

/* Script del Menú Principal */

$('.banner a span').each(function() {
	var height = parseInt($(this).height());
	var margin = 0 - (height / 2);
	$(this).css('margin-top', margin + 'px');
});

$('#menu-link').click(function() {
	if ($('#dropdown-left').is(':visible')) {
		$('#dropdown-left').hide();
		$('#menu-escorts').hide();
		$('#menu-escorts div').hide();
		$('#menu-travestis').hide();
		$('#menu-travestis div').hide();
		$('#menu-agencias').hide();
		$('#menu-agencias div').hide();

	}
	if ($('#dropdown-right').is(':visible')) {
		$('#dropdown-right').hide();
		$('#lang-list').hide();
		$('a.logo').css('width', '70%');
		$('#menu').css('width', '30%');
	} else {
		$('a.logo').css('width', '30%');
		$('#menu').css('width', '70%');
		$('#lang-list').css('display', 'inline-block');
		$('#dropdown-right').slideDown();
	}
});


$('#menu-escorts-link').click(function() {
	if ($('#menu-escorts').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
	}
	$('#dropdown-left div').hide();
	$('#menu-escorts').show();
	$('#menu-escorts div').show();

});

$('#menu-travestis-link').click(function() {
	if ($('#menu-travestis').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
	}
	$('#dropdown-left div').hide();
	$('#menu-travestis').show();
	$('#menu-travestis div').show();

});

$('#menu-agencias-link').click(function() {
	if ($('#menu-agencias').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
	}
	$('#dropdown-left div').hide();
	$('#menu-agencias').show();
	$('#menu-agencias div').show();

});

$('#menu-masajes-link').click(function() {
	loadMenuMasajes();
});

$('#menu-webcams-link').click(function() {
	if ($('#menu-webcams').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
	}
	$('#dropdown-left div').hide();
	$('#menu-webcams').show();
	$('#menu-webcams div').show();

});


$('#menu-historico-link').click(function() {
	if ($('#menu-historico').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
		$('#menu-historico div').show();
		$('#menu-historico div.cartel').hide();
	}
	$('#dropdown-left div').hide();
	$('#menu-historico').show();
	$('#menu-historico div').show();
	$('#menu-historico div.cartel').hide();

});


$('#filtro-novedad').click(function() {
	if ($('#listado-novedad').is(':visible')) {
		$('.filtro ul').hide();
		$('.filtro-button').removeClass('open');
	} else {
		$('.filtro ul').hide();
		$('.filtro-button').removeClass('open');
		$(this).addClass('open')
		$('#listado-novedad').show();
	}
});

$('#filtro-servicios').click(function() {
	if ($('#listado-servicios').is(':visible')) {
		$('.filtro ul').hide();
		$('.filtro-button').removeClass('open');
	} else {
		$('.filtro ul').hide();
		$('.filtro-button').removeClass('open');
		$(this).addClass('open')
		$('#listado-servicios').show();
	}
});

$('#current-lang').click(function() {
	if ($('#lang-list').is(':visible')) {
		$('#lang-list').hide();
	} else {
		$('#lang-list').show();
	}
});

$('#home-current-lang').click(function() {
	if ($('#home-lang-list').is(':visible')) {
		$('#home-lang-list').hide();
	} else {
		$('#home-lang-list').show();
	}
});

$('#home-webcam').click(function() {
	if ($('#home-webcam-list').is(':visible')) {
		$('#home-webcam-list').hide();
	} else {
		$('#home-webcam-list').show();
	}
});

$('#home-menu-escort').click(function() {
	if (jRes.getBreakpoint() != 'desktop' || ( $(window).width() <= 880 && $("#home-main").hasClass('hascPortada')  )  ) {
		$('.home-main-menu ul li').removeClass('active');
		if (jRes.getBreakpoint() == 'mobile') {
			$('.home-main-header').slideUp();
		}
		if ($('#home-desplegable-escort').is(':hidden')) {
			$('.home-desplegable').hide();
			$('#home-desplegable-escort').fadeIn();
			$(this).addClass('active');
			$('#home-slider').hide();
		} else {
			$('.home-desplegable').hide();
			//$('#home-desplegable-selecciona').fadeIn();
			if (jRes.getBreakpoint() == 'mobile') {
				$('.home-main-header').slideDown();
			}
			$('#home-slider').fadeIn();
		}
	} else {
		$('#home-slider').fadeIn();
	}
});

$('#home-menu-travesti').click(function() {

	if (jRes.getBreakpoint() != 'desktop' || ( $(window).width() <= 880 && $("#home-main").hasClass('hascPortada') ) ) {
		$('.home-main-menu ul li').removeClass('active');
		if (jRes.getBreakpoint() == 'mobile') {
			$('.home-main-header').slideUp();
		}
		if ($('#home-desplegable-travesti').is(':hidden')) {
			$('.home-desplegable').hide();
			$('#home-desplegable-travesti').fadeIn();
			$(this).addClass('active');
			$('#home-slider').hide();
		} else {
			$('.home-desplegable').hide();
			//$('#home-desplegable-selecciona').fadeIn();
			if (jRes.getBreakpoint() == 'mobile') {
				$('.home-main-header').slideDown();
			}
			$('#home-slider').fadeIn();
		}
	} else {
		$('#home-slider').fadeIn();
	}
});

$('#home-menu-agencia').click(function() {
	if (jRes.getBreakpoint() != 'desktop' || ( $(window).width() <= 880 && $("#home-main").hasClass('hascPortada') ) ) {
		$('.home-main-menu ul li').removeClass('active');
		if (jRes.getBreakpoint() == 'mobile') {
			$('.home-main-header').slideUp();
		}
		if ($('#home-desplegable-agencia').is(':hidden')) {
			$('.home-desplegable').hide();
			$('#home-desplegable-agencia').fadeIn();
			$(this).addClass('active');
			$('#home-slider').hide();
		} else {
			$('.home-desplegable').hide();
			//$('#home-desplegable-selecciona').fadeIn();
			if (jRes.getBreakpoint() == 'mobile') {
				$('.home-main-header').slideDown();
			}
			$('#home-slider').fadeIn();
		}
	} else {
		$('#home-slider').fadeIn();
	}

});

$('#home-menu-masaje').click(function() {
	if (jRes.getBreakpoint() != 'desktop' || ( $(window).width() <= 880 && $("#home-main").hasClass('hascPortada') ) ) {
		$('.home-main-menu ul li').removeClass('active');
		if (jRes.getBreakpoint() == 'mobile') {
			$('.home-main-header').slideUp();
		}
		if ($('#home-desplegable-masaje').is(':hidden')) {
			$('.home-desplegable').hide();
			$('#home-desplegable-masaje').fadeIn();
			$(this).addClass('active');
			$('#home-slider').hide();
		} else {
			$('.home-desplegable').hide();
			//$('#home-desplegable-selecciona').fadeIn();
			if (jRes.getBreakpoint() == 'mobile') {
				$('.home-main-header').slideDown();
			}
			$('#home-slider').fadeIn();
		}
	} else {
		$('#home-slider').fadeIn();
	}
});


var serveis = $('#listado-servicios').length;
var ultim = serveis - 1;
var penultim = serveis - 2;
var antepenultim = serveis - 3;
$("#listado-servicios li:nth-child(" + penultim + ")").css('border', 'none');


function createMenuMsj() {
	if(masajeSection=='index')
		return true;
	if(masajeSection != 'barcelona' && masajeSection != 'madrid')
		return true;

	$.ajax({
		type: "GET",
		dataType: "html",
		url: "http://" + location.hostname + "/masajes/getmenu"+masajeSection,
		success: function(data) {
			$("#dropdown .esquerra ul").append(data);
		}
	});
	return false;
}

function loadMenuMasajes() {
	
	if(!loadedMenuMasajes)
	{
		$.ajax({
			type: "GET",
			dataType: "html",
			async: false,
			url: "http://" + location.hostname + "/masajes/getmenuheader",
			success: function(data) {
				var object = jQuery.parseJSON(data);
				$("#menu-masajes").html(object.menu_content);
				loadedMenuMasajes = true;
			}
		});
	}

	if ($('#menu-masajes').is(':visible')) {
		$('#dropdown-left').hide();
	} else {
		$('#dropdown-left').show();
	}
	$('#dropdown-left div').hide();
	$('#menu-masajes').show();
	$('#menu-masajes div').show();

	return false;
}

function historyClear() {
	$.ajax({
		type: "POST",
		dataType: "html",
		url: "http://" + location.hostname + "/galeta/clearhistory",
		success: function() {
			$('.historico-ficha').remove();
			$('.historico-send').css('display', 'none');
			$('.historico-vacio').css('display', 'inline-block');
			$('#menu-historico-link span').text('0');
		}
	});
	return false;
}

function historyOff() {
	historyClear();
	$.ajax({
		type: "POST",
		dataType: "html",
		url: "http://" + location.hostname + "/galeta/nocookie",
		success: function() {
			location.reload();
		}
	});
	return false;
}

function historyOn() {
	$.ajax({
		type: "POST",
		dataType: "html",
		url: "http://" + location.hostname + "/galeta/yescookie",
		success: function() {
			location.reload();
		}
	});
	return false;
}

function historyRemove(val) {
	$.ajax({
		type: "POST",
		dataType: "html",
		url: "http://" + location.hostname + "/galeta/removeitem/" + val,
		success: function() {
			$('#historico-' + val).remove();
			var count = parseInt($('#menu-historico-link span').text());
			$('#menu-historico-link span').text(count - 1);
			if ((count - 1) < 1) {
				$('.historico-send').css('display', 'none');
				$('.historico-vacio').css('display', 'inline-block');
				$('#menu-historico-link span').text('0');
			}
		}
	});
	return false;
}

function getPhoneHistory(id, lang) {

	$.ajax({
		type: "POST",
		dataType: "html",
		url: 'http://' + location.hostname + '/ficha-telefono-' + id,
		success: function(val) {
			$('#telefono-historial-' + id).hide().text(val).fadeIn();
			_gaq.push(['_trackEvent', 'clickTelefono', lang, id]);
		}
	});
	return false;
}

function refreshHistory() {

	// $.ajax({
	//  dataType: "html",
	//  url: 'http://'+location.hostname+'/galeta/refreshcookie',
	//  success: function(val){
	//   $('.historial').html(val);
	//   $('#dropdown-left').show();
	//    	  $('#menu-historico div').show();
	//   $('#menu-historico div.cartel').hide();
	//   $(".historico-ficha img.lazy").each(function(){
	//      $(this).attr('src',$(this).data('original'));
	//   });
	//  }
	// });

	// $.ajax({
	//  dataType: "html",
	//  url: 'http://'+location.hostname+'/galeta/counthistory',
	//  success: function(val){
	//   $('#menu-historico-link').children('span').text(val);
	//  }
	// });

	// setTimeout('refreshHistory()',15000);

}

$('.more').on('click', function() {
	$('.tag-text').css('height', 'auto');
	$(this).remove();
});
/*
 $('.tag-list-inactivas-title').on("click",function(){
 if($('.tag-list-inactivas').is(':visible')) {
 $('.tag-list-inactivas').slideUp('slow');
 } else {
 $('.tag-list-inactivas').slideDown('slow');
 }
 });
 */
$(document).mouseup(function(e) {
	var container = $("#menu-historico");

	if (!container.is(e.target) // if the target of the click isn't the container...
		&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.hide();
	}
});

if($("#menu-masajes").length>0)
{
	var loadedMenuMasajes=false;
}


if ($('#bottom-phone-bar').length) {
	$(window).scroll(toggle_bottom_phone_bar);

	function toggle_bottom_phone_bar() {
		var phoneBar = $('#bottom-phone-bar');
		var default_mobile_layer = $('.ficha-informacion .telefono-box');
		if (isScrolledIntoView(default_mobile_layer)) {
			phoneBar.hide();
		} else {
			phoneBar.show();
		}

	}

	function isScrolledIntoView(elem) {
		var $elem = $(elem);
		var $window = $(window);

		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();
		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	$(document).ready(function() {
		$('#bottom-phone-bar').hide();
		setTimeout('toggle_bottom_phone_bar()', 250);
	});
}

if(window.masajeSection )
{
	$(document).ready(function() {
		createMenuMsj();
	});

	$(".menu_toplink").live('click', function() {
		window.open($(this).data('cl'), '_blank');
	});

}

function load_lazy_video() {
	$('video.lazy_video.not_loaded').each(function() {
		var $video = $(this);
		$.each($video.data(), function(k, v) {
			if (k.substr(0, 3) == 'src') {
				$source = $('<source />').attr('src', v);
				if (k.length > 3) {
					var type = k.substr(3);
					$source.attr('type', 'video/' + type.toLowerCase());
				}
				$video.append($source);
			}
		});
		$video.removeClass('not_loaded lazy_video');
	});
}
