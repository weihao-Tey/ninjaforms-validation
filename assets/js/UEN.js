var myUENController = Marionette.Object.extend( {
    initialize: function() {

        // On the Form Submission's field validaiton...
        // var submitChannel = Backbone.Radio.channel( 'submit' );
        // this.listenTo( submitChannel, 'validate:field', this.validateRequired );

        // on the Field's model value change...
        // var fieldsChannel = Backbone.Radio.channel( 'fields' );
        // this.listenTo( fieldsChannel, 'change:modelValue', this.validateRequired );

        // On the Form Submission's field validaiton...
        var submitChannel = Backbone.Radio.channel( 'submit' );
        this.listenTo( submitChannel, 'validate:field', this.validateUEN );

        // on the Field's model value change...
        var fieldsChannel = Backbone.Radio.channel( 'fields' );
        this.listenTo( fieldsChannel, 'change:modelValue', this.validateUEN );
        
    },

    // validateRequired: function( model ) {

    //     // Only validate a specific fields type.
    //     if( 'nric' != model.get( 'type' ) ) return;

    //     // Check if Model has a value
    //     if( model.get( 'value' ) && 1 == model.get( 'required' )) {
    //         // Remove Error from Model
    //         Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Empty-error' );
    //     } else if (!model.get( 'value' ) && 1 == model.get( 'required' )){
    //         // Add Error to Model
    //         Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'NRIC-Empty-error', 'NRIC field is empty, please enter a value.' );
    //     }
    // },


    validateUEN: function( model ) {

        // Only validate a specific fields type.
        if( 'uen' != model.get( 'type' ) ) return;
        // Get the input value for the UEN Field
        var uenValue = model.get('value');

        if(uenValue) {
            // Remove Error from Model
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'UEN-Empty-error' );

            // LENGTH VALIDATION --> Check if UEN is 9 or 10 characters long, if not return error.
            if (uenValue.length == 9 || uenValue.length == 10){
                // Remove Error from Model
                Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'UEN-Length-error' );
                // Add the green check to show successful validation
                model.addWrapperClass('nf-pass');
            }
            else{
                // Add custom error for incorrect length
                Backbone.Radio.channel('fields').request('add:error', model.get('id'), 'UEN-Length-error', 'UEN should be 9 or 10 characters long, please amend.');

                // remove the green check to show unsuccessful validation
                model.removeWrapperClass('nf-pass');

                return; // Stop further validation since length is incorrect
            }

            if(this.isValidUEN(uenValue)){
                // Remove Error from Model
                Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'UEN-error' );
                // Add the green check to show successful validation
                model.addWrapperClass('nf-pass');
            }
            else{
                // Add Error to Model
                Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'UEN-error', 'UEN is not valid, please amend.' );
                // remove the green check to show unsuccessful validation
                model.removeWrapperClass('nf-pass');
            }



        }
        else {
            // Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'UEN-Empty-error', 'UEN field is empty, please enter a value.' );
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'UEN-error' );
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'UEN-Length-error' );
            model.removeWrapperClass('nf-pass');

        }
    },

    isValidUEN: function(uen) {

        //UEN documentation: https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx 

        // Businesses Registered with ACRA:
        // Format: NNNNNNNNX - 9 Characters long
        // Example: 53109628M
        // Regrex: /\d{8}[A-Z]$/i
        // i in the regrex ensures case insensitivity

        //Local Companies Registered with ACRA:
        // Format: YYYYNNNNNX  - 10 characters long
        // Example: 201607416R
        // Regrex: /\d{9}[A-Z]$/i
        // i in the regrex ensures case insensitivity

        //All other entities which will be issued new UEN:
        // Format: TYYPQNNNNX - 10 characters long
        // Tyy - T can be either T (20), S(19) or R(18)
        // PQ - Entity Type - [ABCDFGHLMNPQRSTUVX]
        // Example: S88SS0102G
        // Regrex: /^[A-Z]\d{2}[ABCDFGHLMNPQRSTUVX]{2}\d{4}[A-Z]$/i
        // i in the regrex ensures case insensitivity

        var et; 
        const entity_types = ['LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX', 'HC', 'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM', 'GA', 'GB'];
        // const uen_regrex = /\d{8}[A-Z]$|\d{9}[A-Z]$|^[A-Z]\d{2}[ABCDFGHLMNPQRSTUVX]{2}\d{4}[A-Z]$/i;
        
        if (!/\d{8}[A-Z]$|\d{9}[A-Z]$|^[A-Z]\d{2}[ABCDFGHLMNPQRSTUVX]{2}\d{4}[A-Z]$/i.test(uen)){

            return false;
        }
        else if (/^[A-Z]\d{2}[ABCDFGHLMNPQRSTUVX]{2}\d{4}[A-Z]$/i.test(uen)){
            // Get the entity type and assign to et
            uen = uen.toUpperCase();
            et = uen.substr(3,2);
            return entity_types.includes(et);
        }
        else {
            return true;
        }
    }
        
    
});

// On Document Ready...
jQuery( document ).ready( function( $ ) {

    // Instantiate our custom field's controller, defined above.
    new myUENController();
});