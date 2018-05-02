import { firebase } from '../config/firebase-admin';
import { Observable } from 'rxjs';

import { User } from '../models';

const auth = firebase.auth();
const database = firebase.database();

const userExists = (email) =>
  Observable.defer(() => auth.getUserByEmail(email))
    .catch(err => {
      return err.code === 'auth/user-not-found'
        ? Observable.of(false)
        : Observable.throw(err);
    });

const createUser = (credentials, params) =>
  Observable.defer(() =>
    auth.createUser(credentials)
  )
  .map(user => new User({...params, uid: user.uid}))
  .flatMap(user => updateUser(user.toParams()));

const updateUser = (userParams) =>
  Observable.defer(() =>
    database.ref(`/users/${userParams.uid}`).set(userParams)
  ).mapTo(new User(userParams));

const deleteUser = (uid) => {
  const deleteUserAuth = Observable.defer(() =>
    auth.deleteUser(uid)
  );

  const deleteUserDb = Observable.defer(() =>
    database.ref(`/users/${uid}`).set(null)
  );

  return Observable.combineLatest(deleteUserAuth, deleteUserDb);
};

const deleteUserByEmail = (email) =>  {
  return Observable.fromPromise(
      auth.getUserByEmail(email)
    )
    .switchMap(u => deleteUser(u.uidInternal));
};

export const FirebaseService = {
  createUser,
  updateUser,
  deleteUser,
  deleteUserByEmail,
  userExists
};
