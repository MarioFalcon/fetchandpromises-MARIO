import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { firebaseAuth } from "./firebase.js";

const loginFormElement = document.querySelector("#auth-login-form");
const signupFormElement = document.querySelector("#auth-signup-form");
const logoutButtonElement = document.querySelector(".logout");
const loginGoogleButtonElement = document.querySelector("#googleLogin");

if (loginFormElement) {
  loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginFormElement["email"].value;
    const password = loginFormElement["password"].value;
    await login(email, password);
  });
}

if (signupFormElement) {
  signupFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupFormElement["email"].value;
    const password = signupFormElement["password"].value;
    await signup(email, password);
  });
}

if (logoutButtonElement) {
  logoutButtonElement.addEventListener("click", async () => {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      alert(err);
    }
  });
}

if (loginGoogleButtonElement) {
  loginGoogleButtonElement.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
      const credentials = await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.log(error);
    }
  });
}

/**
 * @param {string} email
 * @param {string} password
 * @return {Promise<void>}
 */
async function signup(email, password) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    console.log("SIGNUP", credentials);
    window.location.replace("/fetchandpromises/index.html");
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case "auth/email-already-in-use":
        alert("Email already in use");
        break;
      case "auth/invalid-email":
        alert("Invalid email");
        break;
      case "auth/weak-password":
        alert("Password is too weak");
        break;
      default:
        alert("Something went wrong");
        break;
    }
  }
}

async function login(email, password) {
  try {
    const credentials = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    console.log("SIGNUP", credentials);
    window.location.replace("/fetchandpromises/index.html");
  } catch (err) {
    alert(err.message);
  }
}

const loggedUrls = ["/fetchandpromises/index.html"];
const publicUrls = [
  "/fetchandpromises/views/login.html",
  "/fetchandpromises/views/signup.html",
];

onAuthStateChanged(firebaseAuth, (user) => {
  const currentPath = window.location.pathname;
  if (user) {
    if (publicUrls.includes(currentPath)) {
      window.location.replace("/fetchandpromises/index.html");
    }
  } else {
    if (loggedUrls.includes(currentPath)) {
      window.location.replace("/fetchandpromises/views/login.html");
    }
  }
});

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   GoogleAuthProvider,
//   signInWithPopup
// } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js'

// import { firebaseAuth } from './firebase.js'

// const loginFormElement = document.querySelector('#auth-login-form')
// const signupFormElement = document.querySelector('#auth-signup-form')
// const logoutButtonElement = document.querySelector('.logout')
// const loginGoogleButtonElement = document.querySelector('#googleLogin')

// async function loginWithGoogle() {
//   try {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(firebaseAuth, provider);
//     console.log('LOGIN WITH GOOGLE', result);
//     window.location.replace('/fetchandpromises/index.html');
//   } catch (err) {
//     alert(err.message);
//   }
// }

// loginGoogleButtonElement.addEventListener('click', loginWithGoogle);

// if (loginFormElement) {
//   loginFormElement.addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const email = loginFormElement['email'].value
//     const password = loginFormElement['password'].value
//     await login(email, password)
//   })
// }

// if (signupFormElement) {
//   signupFormElement.addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const email = signupFormElement['email'].value
//     const password = signupFormElement['password'].value
//     await signup(email, password)
//   })
// }

// if (logoutButtonElement) {
//   logoutButtonElement.addEventListener('click', async () => {
//     try {
//       await signOut(firebaseAuth)
//     } catch (err) {
//       alert(err)
//     }
//   })
// }

// /**
//  * @param {string} email
//  * @param {string} password
//  * @return {Promise<void>}
//  */
// async function signup(email, password) {
//   try {
//     const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password)
//     console.log('SIGNUP', credentials)
//     window.location.replace('/fetchandpromises/index.html')
//   } catch (err) {
//     console.log(err)
//     switch (err.code) {
//       case 'auth/email-already-in-use':
//         alert('Email already in use')
//         break;
//       case 'auth/invalid-email':
//         alert('Invalid email')
//         break;
//       case 'auth/weak-password':
//         alert('Password is too weak')
//         break;
//       default:
//         alert('Something went wrong')
//         break
//     }
//   }
// }

// async function login(email, password) {
//   try {
//     const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password)
//     console.log('SIGNUP', credentials)
//     window.location.replace('/fetchandpromises/index.html')
//   } catch (err) {
//     alert(err.message)
//   }
// }

// const loggedUrls = ['/fetchandpromises/index.html']
// const publicUrls = ['/fetchandpromises/views/login.html', '/fetchandpromises/views/signup.html']

// onAuthStateChanged(firebaseAuth, (user) => {
//   const currentPath = window.location.pathname
//   if (user) {
//     if (publicUrls.includes(currentPath)) {
//       window.location.replace('/fetchandpromises/index.html')
//     }
//   } else {
//     if (loggedUrls.includes(currentPath)) {
//       window.location.replace('/fetchandpromises/views/login.html')
//     }
//   }
// })
