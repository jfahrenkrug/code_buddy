Snippets = new Meteor.Collection("snippets");

if (Meteor.is_client) {
  Template.snippets.snippets = function() {
    var query = Snippets.find({});
    
    query.observe({
      added: function(snippet) {
        window.setTimeout(highlightSyntax, 200);
      },
      changed: function(snippet) {
        window.setTimeout(highlightSyntax, 200);
      }
    }); 

    return query;
  };

  Template.snippet.events = {
    'click input.update': function() {
      Snippets.update(this._id, {$set: {title: $('#' + this._id + '-title').val(), 
                                         code: $('#' + this._id + '-code').val(), 
                                       syntax: $('#' + this._id + '-syntax').val()}});
    },

    'click input.edit': function() {
      $('#editor').toggle();
      if ($('#editor').is(":visible")) {
        $('#edit-button').val("Hide Editor");
      } else {
        $('#edit-button').val("Show Editor");
      }
    }
  };

  Template.languages.langs = function() {
    var snippet = Snippets.findOne({});
    var selected_syntax = null;
    
    if (snippet) {
      selected_syntax = snippet.syntax;
    }
    
    return langs(selected_syntax);
  };
  
  Template.languages.id_is = function (id) {
    console.log (this.id + ' --- ' + id);
    return this.id === id;
  };

}

if (Meteor.is_server) {
  Meteor.startup(function() {
    if (Snippets.find().count() === 0) {
      Snippets.insert({title: "test.js", code: "function foo() {\n  alert('Hello World');\n}", syntax: "js"});
    }
  });
}
