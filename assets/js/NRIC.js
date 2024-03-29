var myNRICController = Marionette.Object.extend({
    initialize: function() {
        // On the Form Submission's field validation...
        var submitChannel = Backbone.Radio.channel('submit');
        this.listenTo(submitChannel, 'validate:field', this.validateNRIC);

        // On the Field's model value change...
        var fieldsChannel = Backbone.Radio.channel('fields');
        this.listenTo(fieldsChannel, 'change:modelValue', this.validateNRIC);
    },

    validateNRIC: function(model) {
        // Only validate a specific field type.
        if ('nric' != model.get('type')) return;

        // Get the input value for the NRIC Field
        var nricValue = model.get('value');

        if (nricValue) {
            // Remove Error Messages if blank
            Backbone.Radio.channel('fields').request('remove:error', model.get('id'), 'NRIC-error');
            Backbone.Radio.channel('fields').request('remove:error', model.get('id'), 'NRIC-Length-error');
            model.removeWrapperClass('nf-pass');

            if (nricValue.length !== 9) {
                // Add custom error for incorrect length
                Backbone.Radio.channel('fields').request('add:error', model.get('id'), 'NRIC-Length-error', 'NRIC should be 9 characters long, please amend.');
                return; // Stop further validation since length is incorrect
            }

            if (this.isValidNRIC(nricValue)) {
                // Add the green check to show successful validation
                model.addWrapperClass('nf-pass');
            } else {
                // Add Error to Model
                Backbone.Radio.channel('fields').request('add:error', model.get('id'), 'NRIC-error', 'NRIC is not valid, please amend.');
            }
        } else {
            // Add Error to Model if NRIC field is empty
            Backbone.Radio.channel('fields').request('add:error', model.get('id'), 'NRIC-error', 'NRIC field is empty, please enter a value.');
        }
    },

    isValidNRIC: function(nric) {
        var icArray = [];
        nric = nric.toUpperCase();
        
        if (!/^[STFGM]\d{7}[A-Z]$/i.test(nric)) {
            return false; // Does not follow the pattern
        }
    
        for (var i = 0; i < 9; i++) {
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
        for (var j = 1; j < 8; j++) {
            weight += icArray[j];
        }
    
        var offset = 0;
        
        if (icArray[0] == "T" || icArray[0] == "G") {
            offset += 4;
        } else if (icArray[0] == "M") {
            offset += 3;
        }
        
        var temp = (offset + weight) % 11;
    
        var st = ["J","Z","I","H","G","F","E","D","C","B","A"];
        var fgm = ["X","W","U","T","R","Q","P","N","M","L","K"];
    
        var theAlpha;
        if (icArray[0] == "S" || icArray[0] == "T") { 
            theAlpha = st[temp]; 
        } else if (icArray[0] == "F" || icArray[0] == "G" || icArray[0] == "M") { 
            theAlpha = fgm[temp]; 
        }
    
        return (icArray[8] === theAlpha);
    }
});

// On Document Ready...
jQuery(document).ready(function($) {
    // Instantiate our custom field's controller, defined above.
    new myNRICController();
});