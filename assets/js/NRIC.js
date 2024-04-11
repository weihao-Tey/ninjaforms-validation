var myNRICController = Marionette.Object.extend( {
    initialize: function() {

        // On the Form Submission's field validaiton...
        // var submitChannel = Backbone.Radio.channel( 'submit' );
        // this.listenTo( submitChannel, 'validate:field', this.validateRequired );

        // on the Field's model value change...
        // var fieldsChannel = Backbone.Radio.channel( 'fields' );
        // this.listenTo( fieldsChannel, 'change:modelValue', this.validateRequired );

        // On the Form Submission's field validaiton...
        var submitChannel = Backbone.Radio.channel( 'submit' );
        this.listenTo( submitChannel, 'validate:field', this.validateNRIC );

        // on the Field's model value change...
        var fieldsChannel = Backbone.Radio.channel( 'fields' );
        this.listenTo( fieldsChannel, 'change:modelValue', this.validateNRIC );
        
    },

    // validateRequired: function( model ) {

    //     // Only validate a specific fields type.
    //     if( 'nric' != model.get( 'type' ) ) return;

    // Validate all field_key that contains 'nric'.
    // if (!model.get('key').includes('nric')) return;

    // Only validate one field_key that is equals to 'nric'.
    // if ('nric' != model.get('key')) return;

    //     // Check if Model has a value
    //     if( model.get( 'value' ) && 1 == model.get( 'required' )) {
    //         // Remove Error from Model
    //         Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Empty-error' );
    //     } else if (!model.get( 'value' ) && 1 == model.get( 'required' )){
    //         // Add Error to Model
    //         Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'NRIC-Empty-error', 'NRIC field is empty, please enter a value.' );
    //     }
    // },


    validateNRIC: function( model ) {

        // Only validate a specific fields type.
        if( 'nric' != model.get( 'type' ) ) return;
        // Get the input value for the NRIC Field
        var nricValue = model.get('value');

        if(nricValue) {
            // Remove Error from Model
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Empty-error' );

            if (nricValue.length !== 9) {
                // Add custom error for incorrect length
                Backbone.Radio.channel('fields').request('add:error', model.get('id'), 'NRIC-Length-error', 'NRIC should be 9 characters long, please amend.');
                // remove the green check to show unsuccessful validation
                model.removeWrapperClass('nf-pass');

                return; // Stop further validation since length is incorrect
            } 
            else{
                // Remove Error from Model
                Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Length-error' );
                // Add the green check to show successful validation
                model.addWrapperClass('nf-pass');
            }

            if(this.isValidNRIC(nricValue)){
                // Remove Error from Model
                Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-error' );
                // Add the green check to show successful validation
                model.addWrapperClass('nf-pass');
            }
            else{
                // Add Error to Model
                Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'NRIC-error', 'NRIC is not valid, please amend.' );
                // remove the green check to show unsuccessful validation
                model.removeWrapperClass('nf-pass');
            }
        }
        else {
            // Add Error to Model
            // Backbone.Radio.channel( 'fields' ).request( 'add:error', model.get( 'id' ), 'NRIC-Empty-error', 'NRIC field is empty, please enter a value.' );
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Empty-error' );
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-Length-error' );
            Backbone.Radio.channel( 'fields' ).request( 'remove:error', model.get( 'id' ), 'NRIC-error' );
        }
    },

    isValidNRIC: function(nric) {

        var i, 
        icArray = [];
        nric = nric.toUpperCase();
        
        if (!/^[STFGM]\d{7}[A-Z]$/i.test(nric)) {
            return false; // Does not follow the pattern
        }
    
        for(i = 0; i < 9; i++) {
            icArray[i] = nric.charAt(i);
        }

        icArray[1] = parseInt(icArray[1], 10) * 2;
        icArray[2] = parseInt(icArray[2], 10) * 7;
        icArray[3] = parseInt(icArray[3], 10) * 6;
        icArray[4] = parseInt(icArray[4], 10) * 5;
        icArray[5] = parseInt(icArray[5], 10) * 4;
        icArray[6] = parseInt(icArray[6], 10) * 3;
        icArray[7] = parseInt(icArray[7], 10) * 2;

        var weight = 0;
        for(i = 1; i < 8; i++) {
            weight += icArray[i];
        }
    
        // var offset = (icArray[0] == "T" || icArray[0] == "G") ? 4:0;
        var offset = 0;
        
        if(icArray[0] == "T" || icArray[0] == "G"){
            offset += 4;
        }
        else if(icArray[0] == "M"){
            offset += 3;
        }
        
        var temp = (offset + weight) % 11;
    
        var st = ["J","Z","I","H","G","F","E","D","C","B","A"];
        var fgm = ["X","W","U","T","R","Q","P","N","M","L","K"];
    
        var theAlpha;
        if (icArray[0] == "S" || icArray[0] == "T") { theAlpha = st[temp]; }
        else if (icArray[0] == "F" || icArray[0] == "G" || icArray[0] == "M") { theAlpha = fgm[temp]; }
    
        return (icArray[8] === theAlpha);
    }
        
    
});

// On Document Ready...
jQuery( document ).ready( function( $ ) {

    // Instantiate our custom field's controller, defined above.
    new myNRICController();
});
