jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
		jQuery('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });
	

	$( "#run" ).click(function() {
	  var suite = $("#suite").val();	
	  var rules = JSON.stringify({rules : editor.getValue()});
	  $("#result").html('');
	  post('http://localhost:8010/'+suite+'/rules', rules); 
	});
	
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/chrome");
	editor.getSession().setMode("ace/mode/logiql");
	editor.setShowPrintMargin(false);
	
	$('.spin').spin('show');
	$('.spin').hide();

	
});



var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

function get(url){
	$('.spin').show();
	$.get( url, function( data ) {
		if(typeof data === 'object') {
			$("#result").html('<pre>'+escapeHtml(JSON.stringify(data, undefined, 2) )+'</pre>');
		} else {
			$("#result").html(data);	
			$('#result').format({method: 'xml'});
		}	  
		$('.spin').hide();		
	});	
}	
function post(url, body){
	$.ajax({
 	  url:url,
 	  type:"POST",
 	  data: body,
 	  contentType:"application/json; charset=utf-8",
  	  dataType:"json",
  	  success: function( data ) {  
		  if(data['result']=='success'){
	  		var suite = $("#suite").val();
		  	get('http://localhost:8010/'+suite+'/runResultsXML'); 
		  } else {
			 $( "#result" ).html(JSON.stringify(data, undefined, 2)); 
		  }
	  	}
	});		
}	