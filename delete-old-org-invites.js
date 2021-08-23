var axios = require('axios');


// get and cancel all pending GitHub Organization invitations with http get request
var github_org_invitations = function(org, token) {
  axios({
    method: 'get',
    baseURL: 'https://api.github.com/',
    url: 'orgs/' + org + '/invitations',
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(function (response) {
    response.data.forEach(function(invitation) {
      console.log(invitation.id, invitation.created_at);

      if (should_be_expired(invitation.created_at)) {
        console.log(invitation.id, invitation.created_at, 'should be expired');
        cancel_github_org_invitation(org, token, invitation.id);
      }

    })
  })
  .catch(function (error) {
    console.log(error);
  });
}

// get and cancel all failed GitHub Organization invitations with http get request
var failed_github_org_invitations = function(org, token) {
  axios({
    method: 'get',
    baseURL: 'https://api.github.com/',
    url: 'orgs/' + org + '/failed_invitations',
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(function (response) {
    response.data.forEach(function(invitation) {
      console.log(invitation.id, invitation.created_at);

      if (should_be_expired(invitation.created_at)) {
        console.log(invitation.id, invitation.created_at, 'should be expired');
        cancel_github_org_invitation(org, token, invitation.id);
      }

    })
  })
  .catch(function (error) {
    console.log(error);
  });
}


// cancel github organization invitation  with http delete request
var cancel_github_org_invitation = function(org, token, id) {
  console.log("Cancelling Invitation: ", id);

  axios({
    method: 'delete',
    baseURL: 'https://api.github.com/',
    url: 'orgs/' + org + '/invitations/' + id,
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// check if date is greater than 7 days
var should_be_expired = function(date) {
  var inviteDate = Date.parse(date);
  var today = new Date();
  var seven_days_ago = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  seven_days_ago = Date.parse(seven_days_ago);

  if (inviteDate < seven_days_ago) {
    return true
  } else {
    return false;
  }
}

//In order to cancel an organization invitation, the authenticated user must be an organization owner.
github_org_invitations("orgName", "<yourToken>");
failed_github_org_invitations("orgName", "<yourToken>");;  // this is the org that has failed invitations  
