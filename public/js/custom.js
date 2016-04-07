$(function(){
$('#insta_search').keyup(function(){

var search_string = $(this).val();
console.log(search_string);

$.ajax({
  method: 'POST',
  url: '/api/search',
  data: {
  	search_string
  	//Note the parameter in data object must have same name as
  	//in name="search_string"
  },
  dataType: 'json',
  success: function(json_data){
    var data = json_data.hits.hits.map(function(actual_hit){
        return actual_hit;
    });
    console.log(data);
    //Data is acessible outside the scope because of hoisting read ES6 app chptr 1
    $('#searchResults').empty();
    for(var i=0;i<data.length;i++){
    	var html = "";
    	html+= '<div class="col-md-4">';
    	html+= '<a href="/product/'+ data[i]._source._id +'">';
    	html+= '<div class="thumbnail">';
    	html+= '<img src="'+data[i]._source.image+'">';
    	html+= '<div class="caption">';
    	html+= '<h3>'+data[i]._source.name+'</h3>';
    	html+= '<p>'+data[i]._source.category.name+'</p>';
    	html+= '<p>'+data[i]._source.price+'</p>';
    	html+= '</div></div></a></div>';

    	$('#searchResults').append(html);
    }
  },
  error: function(error){
  	console.log(error);
  }  
});
});
});