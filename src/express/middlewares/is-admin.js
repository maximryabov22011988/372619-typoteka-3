'use strict';

const isAdmin = (req, res, next) => {
  const {user} = req.session;

  if (!user || (user && !user.isAdmin)) {
    return res.redirect(`/login`);
  }

  return next();
};

module.exports = isAdmin;
