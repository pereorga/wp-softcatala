/** JS functions related to pages from the post_type 'Programa' **/

jQuery( document ).ready(function() {
    if (jQuery('.baixada_boto').length > 0) {
        var operatingSystem = getOperatingSystem();

        var cpuArchitecture = getCpuArchitecture();

        show_download_version(operatingSystem, cpuArchitecture);

        var numItems = jQuery('.baixada_boto').length;
        if ( numItems <= 2 ) {
            jQuery("#show_more_versions").hide();
        }
    }
});

function getOperatingSystem() {
    if (jQuery.browser.android) { return 'android'; }
    if (jQuery.browser.ipad || jQuery.browser.iphone) { return 'ios'; }
    if (jQuery.browser.mac) { return 'osx'; }
    if (jQuery.browser.linux) { return 'linux'; }
    if (jQuery.browser.win) { return 'windows' }

    return 'Unknown OS';
}

function getCpuArchitecture() {
    if((navigator.userAgent.indexOf("WOW64") != -1)
        || (navigator.userAgent.indexOf("Win64") != -1)
        || (navigator.userAgent.indexOf("x86_64") != -1)) {
       return 'x86_64';
    } else {
       return 'x86';
    }
}

function show_download_version(operatingSystem, cpuArchitecture) {
    if((jQuery('#baixada_' + operatingSystem + '_' + cpuArchitecture).length)) {
        jQuery('#baixada_' + operatingSystem + '_' + cpuArchitecture).show();
    } else if(jQuery('#baixada_' + operatingSystem+"_x86").length) {
        jQuery('#baixada_'+operatingSystem+"_x86").show();
    } else if(jQuery('#baixada_' + operatingSystem+"_x86_64").length) {
        jQuery('#baixada_'+operatingSystem+"_x86_64").show();
    } else if(jQuery('#baixada_'+operatingSystem+"_generic").length) {
        jQuery('#baixada_'+operatingSystem+"_generic").show();
    } else {
        jQuery('.baixada_boto').first().show();
    }
}

/** Cerca **/
var $cerca_form = jQuery('#cerca_programes');
$cerca_form.on('submit', function(){
    disable_empty_fields();
    return true;
});

function disable_empty_fields() {
    jQuery('#cerca_programes').find('input, select').each(function(_, inp) {
        if (jQuery(inp).val() === '' || jQuery(inp).val() === null || jQuery(inp).val() === '0')
            inp.disabled = true;
    });
}

jQuery(".selectpicker").on('change', function() {
    if(!jQuery('.bs-afegeixprograma-modal-lg').is(":visible")) {
        jQuery( "#cerca_programes" ).submit();
    }
});

/** Rating **/
jQuery('#input_rating').on('change', function () {
    var complexname = jQuery(this).attr('name');
    var name = complexname.split('_');
    var cookie_id = "sc_"+complexname;
    if(document.cookie.indexOf(cookie_id) < 0) {
        //Data
        var post_data = new FormData();
        post_data.append('post_id', name[2]);
        post_data.append('rate', jQuery("#input_rating").val());
        post_data.append('cookie_id', cookie_id);
        post_data.append('action', 'send_vote');
        post_data.append('_wpnonce', jQuery('input[name=_wpnonce_program_vote]').val());

        jQuery.ajax({
            type: 'POST',
            url: scajax.ajax_url,
            data: post_data,
            dataType: 'json',
            contentType: false,
            processData: false,
            success : vote_sent_ok,
            error : vote_sent_ko
        });
    } else {
        var message_text = 'Sembla que ja havies votat abans...';
        show_message(message_text);
    }
});

function vote_sent_ok(result) {

    show_message(result.text);

    if (result.status == 1) {
        update_votes(result);
    }

    var CookieDate = new Date;
    CookieDate.setFullYear(CookieDate.getFullYear( ) +10);
    document.cookie = result.cookie_id+'=1; expires=' + CookieDate.toGMTString( ) + ';';
}

function update_votes(result) {
    jQuery('.cont-rating span.numero').html(result.valoracio);
    jQuery('.cont-rating em').html( "(" + result.vots + " vots)");
}

function vote_sent_ko(result) {
    show_message("S'ha produït un error en enviar les dades. Proveu una altra vegada més tard.");
}

function show_message(text) {
    jQuery("#message_text").html(text);
    jQuery('.bs-messages-modal-lg').modal('show');
}

/** Formulari comprova si programa existeix **/
jQuery(".next_step").on('click', function() {
    var button_id = jQuery(this).attr('id').split('_');
    step = button_id[1];
    jQuery("#form_"+step).hide();
    step++;
    if(step == 3) {
        jQuery("#form_3").addClass('actiu');
    } else {
        jQuery("#form_3").removeClass('actiu');
    }
    jQuery("#form_"+step).show();
});

var $search_program_form = jQuery('#second_step');

$search_program_form.on('submit', function(ev){
    ev.preventDefault();

    jQuery("#loading").fadeIn();
    var nom_programa = jQuery("#nom_programa").val();

    //Data
    var post_data = new FormData();
    post_data.append('nom_programa', nom_programa);
    post_data.append('action', 'search_program');
    post_data.append('_wpnonce', jQuery('input[name=_wpnonce_program_search]').val());

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_search_ok,
        error : form_sent_ko
    });
});

function form_search_ok(result) {
    jQuery("#loading").hide();
    if(result.programs) {
        var response = result.text+result.programs;
    } else {
        var response = result.text;
    }
    jQuery("#text_response").html(response);
    jQuery("#pas_1").show();
}

function form_sent_ko(result) {
    jQuery("#loading").hide();
    jQuery("#text_response").html('Proveu més tard');
}

/** Formulari afegeix programa **/
var $add_program_form = jQuery('#programa_form');

$add_program_form.on('submit', function(ev) {
    ev.preventDefault();

    jQuery("#loading_program").fadeIn();

    //Data
    var post_data = new FormData();
    post_data.append('email_usuari', jQuery('input[name=email_usuari]').val());
    post_data.append('comentari_usuari', jQuery('textarea[name=comentari_usuari]').val());
    post_data.append('nom', jQuery('input[name=nom]').val());
    post_data.append('autor_programa', jQuery('input[name=autor]').val());
    post_data.append('lloc_web_programa', jQuery('input[name=lloc_web]').val());
    post_data.append('descripcio', jQuery('textarea[name=descripcio]').val());
    post_data.append('tipus', jQuery('#llicencia option:selected').val());
    post_data.append('categoria_programa', jQuery('input[name=categoria_programa]:checked').val());
    post_data.append('autor_traduccio', jQuery('input[name=autor_traduccio]').val());

    post_data.append('action', 'add_new_program');
    post_data.append('_wpnonce', jQuery('input[name=_wpnonce_program]').val());

    var logo = jQuery(document).find('input[name="logo"]');
    var logo_file = logo[0].files[0];
    post_data.append("logo", logo_file);

    var captura = jQuery(document).find('input[name="captura"]');
    var captura_file = captura[0].files[0];
    post_data.append("captura", captura_file);

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_add_ok,
        error : form_sent_ko
    });
});

function form_add_ok(result) {
    jQuery("#loading_program").hide();
    jQuery("#form_2").hide();
    jQuery("#form_3").fadeIn();
    jQuery("#form_3").addClass('actiu');
    jQuery("#form_2").removeClass('actiu');
    jQuery("#programa_id").val(result.post_id);
}

jQuery('#add_new_baixada').on('click', function () {
    var content = jQuery('#baixada_fields').prop('outerHTML');
    current_baixada_id = baixada_id;
    baixada_id = baixada_id + 1;
    pattern = "[1]";
    re = new RegExp(pattern, "g");
    res2 = content.replace(re, baixada_id);
    jQuery( "#baixada_group").append(res2);
});

/** Formulari afegeix baixada **/
var $add_baixades_form = jQuery('#baixades_form');

$add_baixades_form.on('submit', function(ev) {
    ev.preventDefault();
    jQuery("#loading_program").fadeIn();

    //Data
    var post_data = new FormData();
    post_data.append('programa_id', jQuery('input[name=programa_id]').val());
    post_data.append('nom', jQuery('input[name=nom]').val());

    //Programes
    var urls_baixada = [];
    jQuery(".url_baixada").each(function() {
        urls_baixada.push(jQuery(this).val());
    });

    var versions = [];
    jQuery(".versio").each(function() {
        versions.push(jQuery(this).val());
    });

    var sistemes_operatius = [];
    jQuery(".sistema_operatiu").each(function() {
        if(jQuery(this).is(':checked')) {
            sistemes_operatius.push(jQuery(this).val());
        }
    });

    var arquitectures = [];
    jQuery(".arquitectura").each(function() {
        if(jQuery(this).is(':checked')) {
            arquitectures.push(jQuery(this).val());
        }
    });

    var baixades = {};
    urls_baixada.forEach(function (value, i) {
        var values = {};
        values.url = urls_baixada[i];
        values.versio = versions[i];
        values.sistema_operatiu = sistemes_operatius[i];
        values.arquitectura = arquitectures[i];
        baixades[i] = values;
    });

    baixadesjson = JSON.stringify(baixades);
    post_data.append('baixades', baixadesjson);
    post_data.append('action', 'add_new_baixada');
    post_data.append('_wpnonce', jQuery('input[name=_wpnonce_baixada]').val());

    jQuery.ajax({
        type: 'POST',
        url: scajax.ajax_url,
        data: post_data,
        dataType: 'json',
        contentType: false,
        processData: false,
        success : form_baixada_add_ok,
        error : form_baixada_add_ko
    });
});

function form_baixada_add_ok() {
    jQuery("#loading_program").hide();
    jQuery("#form_3").hide();
    jQuery("#form_4").fadeIn();
    jQuery("#form_4").addClass('actiu');
    jQuery("#form_3").removeClass('actiu');
}

function form_baixada_add_ko() {

}

jQuery('#afegeix_programa_button').on('click', function () {
    if (!jQuery('#form_3').hasClass('actiu')) {
        jQuery('#form_4').hide();
        jQuery('#form_2').hide();
        jQuery('#form_1').show();
    }
});
