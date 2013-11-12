var todoView = Backbone.View.extend({
  el: '.todo',
  events: {
    'keypress input' : 'addTask',
    'click #close' : 'deleteItem',
    'click input[type=checkbox]' : 'toggleComplete',
    'click #clear-completed' : 'clearCompleted'
  },
  initialize: function(){
    this.collection = new Tasks();
  },
  textTemplate: _.template('<li class="topcoat-list__item"><label class="topcoat-checkbox">\
      <input type="checkbox">\
      <div class="topcoat-checkbox__checkmark"></div></label>\
      <span id="close">&#10005;</span>\
      <span class="title"><%= task %></span>\
    </li>'),
  mediaTemplate: _.template('<li class="topcoat-list__item"><label class="topcoat-checkbox">\
      <input type="checkbox">\
      <div class="topcoat-checkbox__checkmark"></div></label>\
      <span id="close">&#10005;</span>\
      <span class="title"><%= title %></span><br><iframe width="560" height="315" src="http://www.youtube.com/embed/<%= task %>" frameborder="0" allowfullscreen></iframe>\
    </li>'),
  pictureTemplate: _.template('<li class="topcoat-list__item"><label class="topcoat-checkbox">\
      <input type="checkbox">\
      <div class="topcoat-checkbox__checkmark"></div></label>\
      <span id="close">&#10005;</span>\
      <span class="title"><%= title %></span><br><img class="pageImg" src="<%= image %>">\
    </li>'),
  render: function(userInput,media){
    var item;
    if(userInput.match(/youtu/)){
      var videoId = this.getVideoId(userInput);
      var that = this;
      this.getVideoTitle(videoId).done(function(data){
        item = that.mediaTemplate({task:videoId, title: data['entry']['title']['$t']});
        $('.topcoat-list__container').append(item);
      });
    } else if(media) {
      var that = this;
      this.getPageInfo(userInput).done(function( msg ) {
        console.log(msg.length)
        var title = msg.match(/<title>(.+)<\/title>/)[1];
        var openGraphImage = msg.match(/<meta property="og:image" content="(.+)"/);
        var firstImage = msg.match(/src=['|"](.+(jpg|png|gif))['|"]/);
        var image;
        if(openGraphImage && openGraphImage[1]){
          image = openGraphImage[1];
        } else {
          if(Array.isArray(firstImage)){
            image = firstImage[1];
          } else {
            image = firstImage;
          }
        }
        console.log(image);
        $('.topcoat-list__container').append(that.pictureTemplate({title: title, image: image}));
      });
    } else {
      item = this.textTemplate({task:userInput});
      $('.topcoat-list__container').append(item);
    }
  },
  getVideoId: function(url){
    return url.slice(-11);
  },
  getVideoTitle: function(id){
    var url = 'http://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=json';
    return $.ajax({
      url: url,
      dataType: 'json'
    })
  },
  getPageInfo: function(url){
    return $.ajax({
      url: '/getPageInfo',
      method: 'POST',
      data: { url: url }
    })
  },
  addTask: function(e){
    if(e.which === 13){
      var userInput = e.currentTarget.value;
      if(userInput === '') return;
      //add to collection
      var link = this.createNewListItem(userInput);
      $(e.target).val('');
      this.render(userInput,link);
   }
  },
  createNewListItem: function(title){
    var link = false;
    if(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(title)){
      link = true;
    };
    var task = new Task({title:title,link:link});
    this.collection.add(task);  
    return link;
  },
  deleteItem: function(e){
    //remove from collection
    var userInput = $(e.currentTarget).closest('li').find('.title').text();
    var item = this.collection.where({title:userInput})
    this.collection.remove(item);
    $(e.currentTarget).closest('li').remove();
  },
  toggleComplete: function(e){
    $(e.currentTarget).closest('li').find('.title').toggleClass('strikeout');
    var userInput = $(e.currentTarget).closest('li').find('.title').text();
    var item = this.collection.where({title:userInput});
    item[0].attributes.completed = !item[0].attributes.completed;
  },
  clearCompleted: function(){
    this.removeFromCollection();
    this.removeFromDom();
  },
  removeFromCollection: function(){
    var item = this.collection.where({completed:true});
    item.forEach(function(listItem){
      listItem.destroy();
    });
  },
  removeFromDom: function(){
    $('li').each(function(i,elem){
      if($(elem).find('input[type=checkbox]').prop("checked")){
        $(elem).remove();
      }
    });
  }
});

var Task = Backbone.Model.extend({
  defaults: {
    title: '',
    link: false,
    completed: false
  }
});

var Tasks = Backbone.Collection.extend({
  model:Task
});

$(document).ready(function(){
  new todoView();
});
