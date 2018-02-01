import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../../config'

let redisClient = require('../redis').client;

export const token = ({ required, roles = ['admin', 'user'] } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {

    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)

passport.use('token', new JwtStrategy( {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    function(request){
        var authHeaders = request.headers['authorization'];
        return (authHeaders) ? authHeaders.split(' ')[2] : false;
    },
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, function (accessToken, done) {
        if(accessToken){
          console.log("I FUCKING FOUND IT", accessToken, accessToken.exp > new Date())
            var user = accessToken;
            if(accessToken.exp > new Date()){
                redisClient.del(accessToken.id);
                return done(new Error("token expired"));
            }
            var callback = function(err, response){
              if(err){
                console.log('from redis', err)
                return done(err);
              }
              let user = JSON.parse(response);

              if(user && !user.role){
                user.role = 'user';
              }
              console.log('getting our user', user)
              return done(null, user);
            }
            return redisClient.get(accessToken.id, callback.bind(this))
        }
        return done(new Error("could not validate"));
    }
));
