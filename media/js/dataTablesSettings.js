(function($) {
    $.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
        // check that we have a column id
        if ( typeof iColumn == "undefined" ) return new Array();
                    
        // by default we only wany unique data
        if ( typeof bUnique == "undefined" ) bUnique = true;
                    
        // by default we do want to only look at filtered data
        if ( typeof bFiltered == "undefined" ) bFiltered = true;
                    
        // by default we do not wany to include empty values
        if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
                    
        // list of rows which we're going to loop through
        var aiRows;
                    
        // use only filtered rows
        if (bFiltered == true) aiRows = oSettings.aiDisplay; 
        // use all rows
        else aiRows = oSettings.aiDisplayMaster; // all row numbers
                    
        // set up data array	
        var asResultData = new Array();
                    
        for (var i=0,c=aiRows.length; i<c; i++) {
            iRow = aiRows[i];
            var aData = this.fnGetData(iRow);
            var sValue = aData[iColumn];
                        
            // ignore empty values?
            if (bIgnoreEmpty == true && sValue.length == 0) continue;
                        
            // ignore unique values?
            else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
                        
            // else push the value onto the result data array
            else asResultData.push(sValue);
        }
                    
        return asResultData;
    }
}(jQuery));
            
            
function fnCreateSelect( aData )
{
    var r='<select><option value=""></option>', i, iLen=aData.length;
    for ( i=0 ; i<iLen ; i++ )
    {
        r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
    }
    return r+'</select>';
}

/* Formating function for row details */
function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" id="detailsTable" >';
    sOut += '<tr><td>Package:</td><td>'+aData[5]+'</td></tr>';
    sOut += '<tr><td>Stack Trace:</td><td>'+aData[6]+'</td></tr>';
    sOut += '</table>';
				
    return sOut;
}
			
$(document).ready(function() {
    /*
                 * Insert a 'details' column to the table
                 */
    var nCloneTh = document.createElement( 'th' );
    var nCloneTd = document.createElement( 'td' );
    nCloneTd.innerHTML = '<img src="../media/images/details_open.png">';
    nCloneTd.className = "center";
				
    $('#crashTable thead tr').each( function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );
				
    $('#crashTable tbody tr').each( function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );
				
    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
    var oTable = $('#crashTable').dataTable( {
        "bJQueryUI": true,

        "aoColumnDefs": [
        {
            "bSortable": false, 
            "aTargets": [ 0 ]
        },
        {
            "bVisible": false, 
            "aTargets": [ 5 ]
        },
        {
            "bVisible": false, 
            "aTargets": [ 6 ]
        }
        ],
        "aaSorting": [[1, 'asc']]
    });

    /* Add a select menu for each TH element in the table footer */
    $("tfoot th").each( function ( i ) {
        this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i) );
        $('select', this).change( function () {
            oTable.fnFilter( $(this).val(), i );
        } );
    } );	
                
    /* Add event listener for opening and closing details
     * Note that the indicator for showing which row is open is not controlled by DataTables,
     * rather it is done here
     */
    $('#crashTable tbody td img').live('click', function () {
        var nTr = this.parentNode.parentNode;
        if ( this.src.match('details_close') )
        {
            /* This row is already open - close it */
            this.src = "../media/images/details_open.png";
            oTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */
            this.src = "../media/images/details_close.png";
            oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
        }
    } );
} );