<?php
/**
 * Plugin Name: NRIC/FIN/UEN Ninjaform Validator
 * Description: Adds custom External Identifier Fields Validation to Ninja Forms.
 * Version: 1.0.2
 * Author: Wei Hao
 */

defined( 'ABSPATH' ) or exit;

// Hook into Ninja Forms to register the custom field
add_action( 'ninja_forms_register_fields', 'register_my_custom_field_type' );
add_action('wp_enqueue_scripts', 'enqueue_external_id_script');

function register_my_custom_field_type($actions) {
    require_once plugin_dir_path( __FILE__ ) . 'includes/Fields/NRIC.php';
    require_once plugin_dir_path( __FILE__ ) . 'includes/Fields/UEN.php';

    $actions['nric'] = new NF_Field_NRIC(); 
    $actions['uen'] = new NF_Field_UEN(); 

    return $actions;
}

function enqueue_external_id_script() {
    // Only enqueue the script if Ninja Forms is being used on the page
    if (function_exists('Ninja_Forms')) {
        wp_enqueue_script( 'nric-script', plugin_dir_url(__FILE__) . 'assets/js/NRIC.js', array( 'nf-front-end' ) );
        wp_enqueue_script( 'uen-script', plugin_dir_url(__FILE__) . 'assets/js/UEN.js', array( 'nf-front-end' ) );
    }
}