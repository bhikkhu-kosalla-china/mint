var dict_pre_searching=false;
var dict_pre_search_curr_word="";
var dict_search_xml_http=null;

function dict_search(word){
    $("#pre_search_result").hide();
	if(!localStorage.searchword){
		localStorage.searchword="";
	}
	let oldHistory=localStorage.searchword;
	let arrOldHistory=oldHistory.split(",");
	let isExist=false;
	for(let i=0;i<arrOldHistory.length;i++){
		if(arrOldHistory[i]==word){
			isExist=true;
		}
	}
	if(!isExist){
		localStorage.searchword=word+","+oldHistory;
	}
	
    
    $.get("dict_lookup.php",
    {
      op:"search",
      word:word
    },
    function(data,status){
        $("#dict_search_result").html(data);
        $("#dict_list").html($("#dictlist").html());
        $("#dictlist").html("");
    });
}


function dict_pre_search(word){
	if(dict_pre_searching==true){return;}
	dict_pre_searching=true;
	dict_pre_search_curr_word=word;

    $.get("dict_lookup.php",
    {
      op:"pre",
      word:word
    },
    function(data,status){
        dict_pre_searching=false;
        dict_pre_search_curr_word="";
        $("#pre_search_word_content").html(data);
        $("#pre_search_result").css("display","block");
    });
	
}

function dict_pre_word_click(word){
    $("#dict_ref_search_input").val(word);
    $("#pre_search_result").hide();
	dict_search(word);
}

function dict_input_change(obj){
	dict_pre_search(obj.value);
}

function dict_input_onfocus(){
	if($("#dict_ref_search_input").val()==""){
		dict_show_history();
	}
}


function dict_input_keyup(e,obj){
	var keynum
	var keychar
	var numcheck
	
	if($("#dict_ref_search_input").val()==""){
		dict_show_history();
		return;
	}
	if(window.event) // IE
	  {
	  keynum = e.keyCode
	  }
	else if(e.which) // Netscape/Firefox/Opera
	  {
	  keynum = e.which
	  }
	var keychar = String.fromCharCode(keynum)
	if(keynum==13){
		dict_search(obj.value);
	}
	else{
        dict_input_split(obj.value);
        if(obj.value.indexOf("+")==-1){
		
		    dict_pre_search(obj.value); 
        }
        else{
            dict_input_split(obj.value);
            $("#pre_search_result").hide();
        }

	}
}

function dict_input_split(word){
	if(word.indexOf("+")>=0){
		var wordParts=word.split("+");
		var strParts="";
		for(var i in wordParts){
			strParts+="<a onclick='dict_search(\""+wordParts[i]+"\")'>"+wordParts[i]+"</a>";
		}
		$("#input_parts").html(strParts);
	}
	else{
        $("#input_parts").html("");
	}
		
}

function dict_show_history(){
	if(!localStorage.searchword){
		localStorage.searchword="";
	}
	var arrHistory=localStorage.searchword.split(",");
	var strHistory="";
	if(arrHistory.length>0){
		strHistory+="<a onclick=\"cls_word_search_history()\">清空历史记录</a>";
	}
	for(var i=0;i<arrHistory.length;i++){
		var word=arrHistory[i];
		strHistory+="<div class='dict_word_list'>";
		strHistory+="<a onclick='dict_pre_word_click(\""+word+"\")'>"+word+"</a>";
		strHistory+="</div>";
	}
	$("#dict_ref_search_result").html(strHistory);	
}

function cls_word_search_history(){
	localStorage.searchword="";
	$("#dict_ref_search_result").html("");

}
