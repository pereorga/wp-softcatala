<?php
/**
 * Template Name: Traductor Softcatala
 *
 * @package wp-softcatala
 */

if($_POST) {
    sendContactForm();
} else {
    wp_enqueue_script( 'sc-js-traductor', get_template_directory_uri() . '/static/js/traductor.js', array(), '1.0.0', true );
    $context = Timber::get_context();
    $post = new TimberPost();
    $context['post'] = $post;
    $context['links'] = $post->get_field( 'link' );
    $context['sidebar_top'] = Timber::get_widgets('sidebar_top');
    $context['sidebar_bottom'] = Timber::get_widgets('sidebar_bottom');
    Timber::render( array( 'traductor.twig' ), $context );
}
    
/**
 * If a POST is received, that means that someone is contacting us.
 *
 * @param $_POST
 * @return string
 */
function sendContactForm() {
    $to_email       = "traductor@softcatala.org";
    $nom_from       = "Traductor de Softcatalà";
    $assumpte       = "[Traductor] Contacte des del formulari";
    
    //check if its an ajax request, exit if not
    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        $output = json_encode(array( //create JSON data
            'type'=>'error',
            'text' => 'Sorry Request must be Ajax POST'
        ));
        die($output); //exit script outputting json data
    }
    
    //Sanitize input data using PHP filter_var().
    $nom      = sanitize_text_field( $_POST["nom"] );
    $correu     = sanitize_email( $_POST["correu"] );
    $tipus   = sanitize_text_field( $_POST["tipus"] );
    $comentari   = stripslashes($_POST["comentari"]);
    
    //email body
    $message_body = "Tipus: ".$tipus."\r\n\rComentari: ".$comentari."\r\n\rNom: ".$nom."\r\nCorreu electrònic: ".$correu;
    
    //proceed with PHP email.
    $headers = 'From: '.$nom_from.' <'.$to_email. ">\r\n" .
    'Reply-To: '.$correu.'' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

    $send_mail = wp_mail($to_email, $assumpte, $message_body, $headers);
    
    if(!$send_mail) {
        //If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
        $output = json_encode(array('type'=>'error', 'text' => 'S\'ha produït un error en enviar el formulari.'));
        die($output);
    } else {
        $output = json_encode(array('type'=>'message', 'text' => $nom .', et donem les gràcies per ajudar-nos a millorar el traductor.'));
        die($output);
    }
}