import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from "react-native-fbsdk";

export const loginFB = async () => {
  // await FBLogout()
  return new Promise((resolve, reject) => {
    LoginManager.logInWithPermissions(["public_profile", 'email', 'user_likes']).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
          reject({message: 'Login cancelled'});
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              if (data) {
                const infoRequest = new GraphRequest(
                  '/me?fields=name,email,picture.type(large)',
                  null,
                  _responseInfoCallback(resolve, reject),
                );
                new GraphRequestManager().addRequest(infoRequest).start();
              }
            }
          )
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
        reject(error);
      }
    );
  });
};

const _responseInfoCallback = (resolve, reject) => (error, result) => {
  if (error) {
    console.log('Error posting data: ', error);
    reject(error);
  } else {
    resolve(result);
  }
};

export const FBLogout = () => {
  AccessToken.getCurrentAccessToken().then(
    (data) => {
      if (data) {
        let logout = new GraphRequest(
          "me/permissions/",
          {
            accessToken: data.accessToken,
            httpMethod: 'DELETE'
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
            }
          });
        new GraphRequestManager().addRequest(logout).start();
      }
    }
  )

};
