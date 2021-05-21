import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';


export const goggleInit = () => {
  GoogleSignin.configure({
      iosClientId: '246561308651-kbopfvbf84f8mlkfm9tfo6166grdvs09.apps.googleusercontent.com'
    }
  );
};



export const loginGoogle = async () => {
  // await signOutGoogle();
  try {
    await GoogleSignin.hasPlayServices();
    let res = await GoogleSignin.signIn();
    return res?.user || null
  } catch (error) {
    console.log('ERROR', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      // console.log('user cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      // console.log('operation (e.g. sign in) is in progress already')
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      // console.log('play services not available or outdated')
    } else {
      // some other error happened
    }
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.error(error);
  }
};

