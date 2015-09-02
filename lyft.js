Pickups = new Mongo.Collection('pickups');

//CLIENT
// ============================================================
if (Meteor.isClient) {
  //location starts at 0;
  Session.setDefault('location',[]);
  Session.setDefault('selectedPickup');

  //Request Pickup Helpers
  // ====================================
  Template.requestPickup.helpers({
    location: function () {
      return Session.get('location');
    }
  });

  //Request Pickup Events
  // ====================================
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

  //PENDING Pickups Helpers
  // ====================================
  Template.pendingPickups.helpers({
    pendingPickups: function(){
      return Pickups.find({status: 'pending'});
    }
  });//end pendingPickups template

  //PENDING Pickup Events
  // ====================================
  Template.pendingPickups.events({
    'click button' : function(evt,temp){
      Session.set('selectedPickup', evt.target.name);
      console.log(evt.target.name);
    }
  });//end pendingPickups events

  //SELECTED Pickups Helpers
  // ====================================
  Template.selectedPickup.helpers({
    selectedPickup: function(){
      return Pickups.findOne(Session.get('selectedPickup'));
    }
  });//end selectedPickups template


  //User Accounts
  // ====================================
    Accounts.ui.config({
     passwordSignupFields: "USERNAME_AND_EMAIL"
   });//User Accounts End
}//end Meteor Client

//SERVER
// ============================================================
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
