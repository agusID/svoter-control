import * as firebase from 'firebase/app'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAk2yx6w-BAe54tkbY9ga9cmWTQ8Mc_jvQ',
  authDomain: 'ralali-unsung-hero.firebaseapp.com',
  databaseURL: 'https://ralali-unsung-hero.firebaseio.com',
  projectId: 'ralali-unsung-hero',
  storageBucket: 'ralali-unsung-hero.appspot.com',
  appId: '1:124787742881:web:b0a59cfe1638cdff6638e0'
}

firebase.initializeApp(firebaseConfig)

export const database = firebase.database()
