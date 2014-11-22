function recursivelyUpdateData ( source, destination ) {
    var toString = Object.prototype.toString,
        isArray = function( target ){ return toString.call(target) === '[object Array]' },
        isPlainObject = function( target ){ return toString.call(target) === '[object Object]' };

    function DU ( source, destination ) {

        if ( isPlainObject(source) ) {
            var sourceKeys = Object.keys(source),
                destinationKeys = Object.keys(destination),
                key;

            // Update matches & Add keys not in destination

            for ( var n = 0, len = sourceKeys.length; n < len; n++ ) {
                key = sourceKeys[n];

                if( typeof destination[key] === 'undefined' || ( !isPlainObject(destination[key]) && !isArray(destination[key]) ) ) {
                    destination[key] = source[key];
                }

                else DU ( source[key], destination[key] );

            }

            // Remove keys not in source (but only if a subobject or subarray)

            for ( var c = 0, len = destinationKeys.length; c < len; c++ ) {
                key = destinationKeys[c];

                if( !source[key] && ( isArray(destination[key]) || isPlainObject(destination[key]) ) ) {
                    destination[key] = null;
                }

            }

        }

        else if ( isArray(source) ) {

            // Discover the full name of the '_id' key
            // Assumes source is an array of objects, and not nested.

            var primaryKey;

            if ( ( primaryKey = Object.keys(source[0]).filter(function(key){ return key.indexOf('_id') !== -1 })[0] ) ) {

                // Reduces the iteration count in the removal loop

                var leftToProcess = destination.slice(0),
                    match, sItem;

                // Update matches & Add items not in destination

                for ( var n = 0, len = source.length; n < len; n++ ) {
                    sItem = source[n];

                    if ( ( match = destination.filter(function(dItem){ return sItem[primaryKey] === dItem[primaryKey]; })[0] ) ) {
                            DU ( sItem, destination[destination.indexOf(match)] );
                            leftToProcess.splice( leftToProcess.indexOf(match), 1 );
                    }

                    else    destination.push(sItem);

                }

                // Remove array items not in source

                if ( source.length !== destination.length ) {
                    var dItem;

                    for ( var c = 0, len = leftToProcess.length; c < len; c++ ) {
                        dItem = leftToProcess[c];

                        if ( !( match = source.filter(function(sItem){ return dItem[primaryKey] === sItem[primaryKey]; })[0] ) ) {
                            destination.splice( destination.indexOf(dItem), 1 );
                        }
                    }
                }
            }
        }
    }

    // Kick it off.
    DU ( source, destination );
}
