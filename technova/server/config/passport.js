import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Role from '../models/Role.js';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('===== GOOGLE LOGIN =====');
          console.log('Google ID:', profile.id);
          console.log('Name:', profile.displayName);
          console.log('Email:', profile.emails?.[0]?.value);

          // Existing Google user
          let user = await User.findOne({
            googleId: profile.id,
          }).populate('role');

          if (user) {
            console.log('Existing Google user found');
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;

          if (!email) {
            throw new Error('Google account email not found');
          }

          // Existing email user
          user = await User.findOne({
            email,
          }).populate('role');

          if (user) {
            console.log('Linking Google account to existing user');

            user.googleId = profile.id;

            if (!user.avatar && profile.photos?.length) {
              user.avatar = profile.photos[0].value;
            }

            await user.save();

            return done(null, user);
          }

          // Find client role
          let clientRole = await Role.findOne({
            name: 'client',
          });

          if (!clientRole) {
            console.log('Role "client" not found. Creating it...');
            clientRole = await Role.create({
              name: 'client',
              permissions: ['view_services', 'create_projects', 'manage_profile'],
            });
          }

          // Create user
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || '',
            role: clientRole._id,
            isVerified: true,
            status: 'active',
          });

          console.log('New Google user created');

          return done(null, user);
        } catch (error) {
          console.error('GOOGLE AUTH ERROR');
          console.error(error);

          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).populate('role');

      done(null, user);
    } catch (error) {
      console.error('Deserialize Error:', error);
      done(error, null);
    }
  });
};

export default configurePassport;