console.log('sourced!');
$(document).ready(function(){
  console.log('jquery was correctly sourced!');
  getBookData();
  function getBookData() {
    $.ajax({
      type: 'GET',
      url: '/books',
      success: function(response) {
        console.log('response', response); //response is an array of book objects
        $('#bookShelf').empty(); // clears the books in the #bookShelf
        for (var i = 0; i < response.length; i++) { //Loops through books
          var currentBook = response[i]; //More legible for code below
          var $newBook = $('<tr>'); //create a new row for each book
          $newBook.data('id', currentBook.id); //adds data ID to the new book object so we can call it later
          $newBook.append('<td><input value="' + currentBook.title + '" class="bookTitle"></td>'); //show user the title
          $newBook.append('<td><input value="' + currentBook.author + '" class="bookAuthor"></td>'); //show user the author
          $newBook.append('<td><input value="' + currentBook.edition + '" class="bookEdition"></td>'); //show user the edition
          $newBook.append('<td><input value="' + currentBook.publisher + '" class="bookPublisher"></td>');//show user the publisher
          $newBook.append('<td><button class="deleteButton">Delete</button>');
          $newBook.append('<td><button class="saveButton">Save</button>') //create a delete button
          $('#bookShelf').prepend($newBook);
        }
      }
    });
  }


  $('#newBookForm').on('submit', function(event){
    event.preventDefault();
    var newBookObject = {};
    var formFields = $(this).serializeArray();

    formFields.forEach(function (field) {
      newBookObject[field.name] = field.value;
    });

    $.ajax({
      type: 'POST',
      url: '/books/new',
      data: newBookObject,
      success: function(response){
        console.log(response);
        getBookData();
        $('#newBookForm > input').val('');
      }
    });
  });

  $('#bookShelf').on('click', '.saveButton', function(){
    var bookIDSave = $(this).parent().parent().data().id;
    //where are we?
    var titleOfBookToSave = $(this).parent().parent().find('.bookTitle').val();
    var authorOfBookToSave = $(this).parent().parent().find('.bookAuthor').val();
    var editionOfBookToSave = $(this).parent().parent().find('.bookEdition').val();
    var publisherOfBookToSave = $(this).parent().parent().find('.bookPublisher').val();
    //create a book objects
    var bookObjectToSave = {
      title: titleOfBookToSave,
      author: authorOfBookToSave,
      edition: editionOfBookToSave,
      publisher: publisherOfBookToSave
    }
    // var bookNewSaveObject =
    console.log('SaveButton has ID: ', bookIDSave);
  $.ajax({
    type: 'PUT', //it's the PG update PUT or PATCH
    url: '/books/save/' + bookIDSave,
    data: bookObjectToSave,// books/delete/48 (where 48 is bookIDDelete)
    success: function(response){
      console.log(response);
      getBookData();
    }//end success
  });//end ajax
  });//end on click


$('#bookShelf').on('click', '.deleteButton', function(){
  var bookIDDelete = $(this).parent().parent().data().id;
  console.log('DeleteButton has ID: ', bookIDDelete);
$.ajax({
  type: 'DELETE',
  url: '/books/delete/' + bookIDDelete, // books/delete/48 (where 48 is bookIDDelete)
  success: function(response){
    console.log(response);
    getBookData();
  }//end success
});//end ajax
});//end on click
});
