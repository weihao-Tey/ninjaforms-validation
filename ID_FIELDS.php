<?php
/**
 * Plugin Name: NRIC/FIN/UEN Ninjaform Validator
 * Description: Adds custom External Identifier Fields Validation to Ninja Forms.
 * Version: 1.0.2
 * Author: Wei Hao
 */

defined( 'ABSPATH' ) or exit;

// Hook into Ninja Forms to register the custom field
add_action('wp_enqueue_scripts', 'enqueue_external_id_script');

function enqueue_external_id_script() {
    // Only enqueue the script if Ninja Forms is being used on the page
    if (function_exists('Ninja_Forms')) {
        wp_enqueue_script( 'nric-script', plugin_dir_url(__FILE__) . 'assets/js/NRIC.js', array( 'nf-front-end' ) );
        wp_enqueue_script( 'uen-script', plugin_dir_url(__FILE__) . 'assets/js/UEN.js', array( 'nf-front-end' ) );
    }
}
