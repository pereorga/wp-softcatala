<?php
/**
 * Template Name: Transcribe
 *
 * @package wp-softcatala
 */
wp_enqueue_script( 'sc-js-transcribe', get_template_directory_uri() . '/static/js/transcribe.js', array('sc-js-main'), WP_SOFTCATALA_VERSION, true );

$context = Timber::get_context();
$context['ads_container'] = true;
$context['sidebar_top'] = Timber::get_widgets('sidebar_top_recursos');
$context['sidebar_elements'] = array( 'static/ajudeu.twig', 'static/dubte_forum.twig', 'baixades.twig', 'links.twig' );
$context['sidebar_bottom'] = Timber::get_widgets('sidebar_bottom_recursos');
$context['post'] = new TimberPost();
Timber::render( array( 'transcribe.twig' ), $context );

