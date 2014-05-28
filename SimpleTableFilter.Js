(function($){
	$.fn.filterTable = function () {
        var table = $(this);
        var trRowArray = tableValuesInArray(table);
        table.find('thead tr:last th').each(function (trhindex) {
            var sel = $('<select class="TableFilterSelect" style="width:' + $(this).width() + 'px;text-align:center;background-color:' + $(this).prop("background-color") + ';"/>');
            $("</br>").appendTo($(this));
            sel.appendTo($(this));
            sel.change(function () { assignChange(table,1) });
        });
		tableSelectValues(table);		
    };
})(jQuery);
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})();

function assignChange(table,changeSelect) {
    $("tr:hidden").show();
    table.find('thead tr th select').each(function (selectindex) {
        var selectedVal = $.trim($(this).val());
        if (selectedVal == "<Blank>" ){
			selectedVal="";
		};
        if (selectedVal != "<All>" && selectedVal != "<null>") {
            var thIndex = $(this).parent().index() + 1;
            table.find('tbody tr td:nth-child(' + thIndex + ')').each(function (trindex1) {
                var trEle = $(this).parent()
                if (selectedVal != $.trim($(this).text())) {
                    trEle.hide();
                };
            });
        }
    });
	if(changeSelect==1)
	{
		tableSelectValues(table);
	}
};
function tableValuesInArray(table) {
    var trRowArray = new Array;
    var trCount = 0;
    table.find('tbody tr:visible').each(function (trindex) {
        var isExist = false;
        var tdCount = 0;
        $(this).find('td').each(function (tdindex) {
            if (trRowArray.length <= tdindex) {
                trRowArray[tdindex] = new Array;
            }
            if ($.inArray($.trim($(this).text()), trRowArray[tdindex]) < 0) {
                trRowArray[tdindex][trCount] = $.trim($(this).text());
                isExist = true;
            }
        });
        if (isExist == true) { trCount++; }
    });
    return trRowArray;
};

function tableSelectValues(table) {    
    table.find('thead tr:last th select').each(function (trhindex) {	
        var tdselIndex = $(this).parent().index() + 1;
        var selVal = $(this).val();	
		if(selVal!="<All>" && selVal!=null){
			$(this).val("<All>");
			assignChange(table,0);
		};
        var sel = $(this);
        var trsArray = new Array;
        var trsArrayNo = 0;
        table.find('tbody tr:visible td:nth-child(' + tdselIndex + ')').each(function (tdsindex) {
			var tdVal=$.trim($(this).text());
			if(tdVal=="" || tdVal==null){
				tdVal="<Blank>";
			}
            if ($.inArray(tdVal, trsArray) < 0) {
                trsArray[trsArrayNo] = tdVal;
                trsArrayNo++;
            }
        });
        sel.empty();
        $('<option />', { value: "<All>", text: "<All>" }).appendTo(sel);
        $.each(trsArray, function (key, value) {
            $('<option />', { value: value, text: value }).appendTo(sel);
        });
		if(selVal!="<All>" && selVal!=null){
			$(this).val(selVal);
			assignChange(table,0);
		};
    });
	$("#TableLabel").text("selected rows: " + table.find('tbody tr:visible').length);
};
