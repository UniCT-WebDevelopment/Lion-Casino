const { sign } = require('jsonwebtoken');

// Create tokens
// ----------------------------------
const createAccessToken = userId => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '999d',
  });
};

const createRefreshToken = userId => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '999d',
  });
};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, req, accesstoken,utente) => {
  if(utente==null){
    res.send({
      accesstoken,
      email: req.body.email,
      
    });

  }else{
    res.send({
      accesstoken,
      email: req.body.email,
      user:utente,
    });
  }
 
};

const sendRefreshToken = (res, token) => {
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};