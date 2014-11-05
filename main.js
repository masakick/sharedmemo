/*!
 * sharedmemo
 * https://github.com/masakick/sharedmemo
 */

sharedtext = function(){
	
	//ミルクココアインスタンスを作成
    milkcocoa = new MilkCocoa("https://io-ri1inr81p.mlkcca.com");
    
	//"message"データストアを作成
    dsMessage = milkcocoa.DataStore("message");
    
    var models = {
	    message: {
			id:null,
			date:null,
			title:null,
			content:null,
			isSaved:null
		},
		
		init:function(){
			models.message.id = models.message.isSaved = models.message.date = models.message.title = models.message.text = null;
		},
		
		post:function() {
            dsMessage.push({
                	title: models.message.title,
					content: models.message.content,
					date: models.getUtcDateString()
            	}, 
            	function (e) {
	            	views.callbackPost(e);
	            });
	    },
	    
	    set:function() {
            dsMessage.set(models.message.id,{
                	title: models.message.title,
					content: models.message.content,
					date: models.getUtcDateString()
					}, 
					function(e){
						views.callbackSet(e);
					});
	    },
	    
	    remove:function(){
			if(models.message.id){
			  dsMessage.remove(models.message.id);
			}  
	    },
	    
	    getUtcDateString:function(){
		    var date = new Date();
		    var year = date.getUTCFullYear();
		    var month = date.getUTCMonth();
		    var day = date.getUTCDay();
		    var hour = date.getUTCHours();
		    var min = date.getUTCMinutes();
		    var sec = date.getUTCSeconds();
		    var utcString = year+','+month+','+day+','+hour+','+min+','+sec;
		    return utcString;
	    }
	    
	}
    , views = {
	    init: function(){
			models.init();
			/* events */	
			$(window).hashchange( function(){
		    	views.hashChange();
			});
			
		    
		    dsMessage.on('set', function(data) {
				
			});
	
			dsMessage.on('push', function(data) {
				
			});
			
			dsMessage.on('remove', function(data) {
				
				
				location.hash = "/messages";
			});
			
			views.load();
		},
		
		load: function(){
		     
			var hash = location.hash;
			var viewName = hash.split("/")[1];
			
			switch(viewName){
				case "messages":
				views.showMessages();
				break;
				
				case "new":
				views.showNew();
				break;
				
				case "message":
				models.message.id = hash.split("/")[2];
				views.showMessage();
				break;
				
				case "edit":
				models.message.id = hash.split("/")[2];
				views.showEdit();
				break;
				
				default:
				views.showMessages();
				break;
			}
		},
		
		hashChange: function(){
		      views.load(); 
		},
		
	    showMessages:function(){
	
			//"message"データストアからメッセージを取ってくる
			dsMessage.query({}).sort("desc").done(function(e) {
	        	e.forEach(function(message) {
	            	var message_html = '<div class="list-group"><a href="#/message/'+message.id+'" class="list-group-item">'
	            					+'<h4 class="list-group-item-heading">'+ escapeHTML(message.title)+'</h4>'
	            					+'<p class="list-group-item-text">'+ escapeHTML(message.content)
	            					+'<p class="list-group-item-text post-date">'+views.toLocaleString(message.date)+ '</p>'
	            					+'</p></div>';
			        $("#messages").append(message_html);
	        	});
	        	
	    	});
	    	
	    	$("#nav-all").addClass("active");
	    	$("#nav-new").removeClass("active");
	    	$("#message").empty();
			$('#postarea').empty();
	    	
		},
		
		showNew:function(){
			models.message.id = null;			
			var inner_html = '<p class="post-date"></p>' 
						+'<div class="postarea-text">'
						+'<input type="text" id="ms-title" class="form-control" placeholder="タイトル">'
						+'<textarea id="ms-text" class="form-control" rows="10"placeholder="何か書く"></textarea>'
						+'</div>'
						+'<button id="post" type="button" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-ok"></i> Save</button> '
						+'<button id="remove" type="button" class="btn btn-danger btn-sm"><i class="glyphicon glyphicon-remove"></i> Delete</button>'
						+'</div>';
			$('#postarea').html(inner_html);
			
			$('#post').click(function () {
				$(this).attr('disabled','disabled');
				models.message.title = escapeHTML($("#ms-title").val());
	        	models.message.content = escapeHTML($("#ms-text").val());
				models.post();
				
		    });
		    
		    $("#nav-new").addClass("active");
	    	$("#nav-all").removeClass("active");
			$('#messages').empty();
			$('#message').empty();
		},
		
		showMessage : function(){
		    
		    dsMessage.get(models.message.id,function(message) {
			    
			    var innter_html = '<h2>' + escapeHTML(message.title) + '</h2>'
			    				 + '<p class="post-text">' + escapeHTML(message.content) + '</p>'
								 + '<p class="post-date">'+views.toLocaleString(message.date)+'</p>'
								 + '<button type="button" class="btn btn-default btn-sm" id="btn_edit"><i class="glyphicon glyphicon-pencil"></i> Edit</button>';
		        $("#message").html(innter_html);
		        $("#btn_edit").click(function(){
			        location.hash = "/edit/"+message.id;
		        });
			});
			$("#nav-all").removeClass("active");
	    	$("#nav-new").removeClass("active");
			$('#messages').empty();
			$('#postarea').empty();
		},
		
		showEdit : function(){
		    dsMessage.get(models.message.id,function(message) {
		        
				var inner_html = '<p class="post-date">Saved at <span id="ms-postdate">'+views.toLocaleString(message.date)+'</span></p>' 
							+ '<div class="postarea-text">'
							+'<input type="text" id="ms-title" class="form-control" placeholder="Text input" value="'+message.title+'">'
							+'<textarea id="ms-text" class="form-control" rows="10">'+message.content+'</textarea>'
							+'</div>'
							+'<button id="post" type="button" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-ok"></i> Save</button> '
							+'<button id="remove" type="button" class="btn btn-danger btn-sm"><i class="glyphicon glyphicon-remove"></i> Delete</button>'
							+'</div>';
				$('#postarea').html(inner_html);
				$('#post').click(function () {
					models.message.title = escapeHTML($("#ms-title").val());
		        	models.message.content = escapeHTML($("#ms-text").val());
					if(models.message.id != null){		
						$(this).attr('disabled','disabled');
						models.set();
					}
			    });
			    $('#remove').click(function () {
					
					models.remove();
			    });
			});
			$("#nav-all").removeClass("active");
	    	$("#nav-new").removeClass("active");
			$('#messages').empty();
			$('#message').empty();
		},
		
		callbackPost:function(data){
			
			if(data.error!='null'){
				//success
	            location.hash = "/edit/"+data.id;
			}
			else{
				//fail
				alert('saveできませんでした。/n'+data.error);
				
			}
			$('#post').removeAttr('disabled');
			
		},
		callbackSet:function(data){
			
			if(data.error!='null'){
				//success
				dsMessage.get(data.id,function(message) {
	            	$('#ms-postdate').html(views.toLocaleString(message.date));
	            });
			}
			else{
				//fail
				alert('saveできませんでした。/n'+data.error);
				
			}
			$('#post').removeAttr('disabled');
		},
		toLocaleString:function(str){
			var d = new Date();
			d.setTime(eval("Date.UTC("+str+")"));
			return d.toLocaleString();
		}
		
			      
      }
    , controllers = {}
	
	
	views.init();
	
	
};




$(function() {
	
	sharedtext = new sharedtext();
});
function escapeHTML(val) {
    return $('<div>').text(val).html();
};