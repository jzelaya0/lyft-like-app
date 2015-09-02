Pickups = new Mongo.Collection('pickups');
if (Meteor.isClient) {
  //location starts at 0;
  Session.setDefault(['location']);

  Template.requestPickup.helpers({
    location: function () {
      return Session.get('location');
    }
  });

  Template.requestPickup.events({
    'click button': function () {
      //get the client's coordinates when the button is clicked
      function handleSuccess(position) {
        var location = [position.coords.longitude, position.coords.latitude];
        console.log(position.coords);
        Session.set('location', location);
        Pickups.insert({
          location: location,
          owner: Meteor.userId(),
          username: Meteor.user().username,
          createdAt: new Date(),
          status: 'pending'
        });
      }
      function handleError(err) {
        console.log(err);
      }
      window.navigator.geolocation.getCurrentPosition(handleSuccess,handleError);


    }//end click event
  });//end requestPickup template

  Template.pendingPickups.helpers({
    pendingPickups: function(){
      return Pickups.find({status: 'pending'});
    }
  });//end pendingPickups template

    Accounts.ui.config({
     passwordSignupFields: "USERNAME_ONLY"
   });//User Accounts End
}//end Meteor Client

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
