<?php
defined( 'ABSPATH' ) or exit;

class NF_Field_UEN extends NF_Fields_Textbox {
    protected $_name = 'uen';

    protected $_nicename = 'UEN';

    protected $_type = 'uen';

    protected $_section = 'userinfo';

    protected $_icon = 'file-text';

    protected $_templates = 'uen';

    protected  $_test_value = '202412345A';

    protected $_settings = array(
        'disable_browser_autocomplete',
	    'mask',
	    'custom_mask',
	    'custom_name_attribute',
	    'personally_identifiable'   
    );

    public function __construct()
    {
        parent::__construct();

        $this->_nicename = esc_html__( 'UEN', 'ninja-forms' );
        $this->_settings[ 'custom_name_attribute' ][ 'value' ] = 'UEN';
        $this->_settings[ 'personally_identifiable' ][ 'value' ] = '1';

    }


    public function filter_default_value( $default_value, $field_class, $settings )
    {
        if( ! isset( $settings[ 'default_type' ] ) ||
            'user-meta' != $settings[ 'default_type' ] ||
            $this->_name != $field_class->get_name()) return $default_value;

        $current_user = wp_get_current_user();

        if( $current_user ){
            $default_value = $current_user->NULL;
        }

        return $default_value;
    }
}

