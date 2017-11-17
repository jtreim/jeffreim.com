$(document).ready(function(){
 $("#add-game-name").change(function(){
  if($("#add-game-name").val() && $('#add-game-url').val()){
   $('#add-game-btn').prop('disabled', false);
  }else{
   $('#add-game-btn').prop('disabled', true);
  }
 });

 $("#add-game-url").change(function(){
  if($("#add-game-url").val() && $("#add-game-name").val()){
   $("#add-game-btn").prop('disabled', false);
  }else{
   $('#add-game-btn').prop('disabled', true);
  }
 });

 $("#add-game-btn").click(function(e){
  var submit = {
   title: $("#add-game-name").val(),
   picUrl: $("#add-game-picurl").val(),
   url: $("#add-game-url").val(),
   added_by: $("#add-game-author").val(),
   description: $("#add-game-description").val()
  };

  $("#add-game-name").val("");
  $("#add-game-picurl").val("");
  $("#add-game-url").val("");
  $("#add-game-author").val("");
  $("#add-game-description").val("");
  $('#add-game-btn').prop('disabled', true);

  $.ajax({
   url: '/add-game',
   type: 'POST',
   data: submit,
   dataType: 'json',
   success: function(){
    console.log('Got success back!');
   }
  });
 });

 $("#search-input").change(function(){
  if($("#search-input").val()){
   $("#search-btn").prop('disabled', false);
  }else{
   $("#search-btn").prop('disabled', true);
  } 
 });

 $("#search-btn").click(function(){
  var search = $("#search-input").val();
  $.getJSON("/search/query?q=" + search, function(data){
   $("#search-results").empty();
   if(!data.length){
    $("#search-results").append(
     $("<p></p>")
      .text("I couldn't find anything...")
      .addClass("lame"));
   }
   $.each(data, function(i, item){
    var game = $("<div></div>").addClass("game-info");
    var imghref = $("<a></a>").attr("href", data[i].url);
    
    var img = $("<img>").attr("src", "/images/default-game.png");
    var picUrl = data[i].picUrl;
    if(picUrl && picUrl != ""){
     img.attr("src", picUrl);
    }
    
    imghref.append(img);
    game.append(imghref);
    
    var a = $("<a>").attr("href", data[i].url);
    a.text(data[i].title);
    game.append(a);
    
    var p = $("<p></p>").text(data[i].description);
    game.append(p);
    $("#search-results").append(game);
   });
  });
 });
});
