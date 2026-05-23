const {ccclass, property} = cc._decorator;

@ccclass
export default class FirebaseConfig extends cc.Component {

    onLoad() {
        if (typeof firebase === 'undefined') {
            console.log("Firebase undefined, loading CDN...");
            this.loadFirebaseScripts(() => {
                this.initFirebase();
            });
        }
        else {
            this.initFirebase();
        }
    }

    loadFirebaseScripts(callback: () => void) {
        const urls = [
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js",
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"
        ];

        let loadedCount = 0;
        urls.forEach(url => {
            let script = document.createElement('script');
            script.src = url;
            script.async = false;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === urls.length) {
                    console.log("Firebase CDN successfully loaded");
                    callback();
                }
            };
            document.head.appendChild(script);
        });
    }

    initFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyCwm3CxNgRldx1ewwPXOL4MrMg-Z9TOMyw",
            authDomain: "web-mario-6423f.firebaseapp.com",
            databaseURL: "https://web-mario-6423f-default-rtdb.firebaseio.com/",
            projectId: "web-mario-6423f",
            storageBucket: "web-mario-6423f.firebasestorage.app",
            messagingSenderId: "1035173117039",
            appId: "1:1035173117039:web:2bcc9fd6841abe015a219a"
        };

        if (!firebase.apps.length) {
            const app = firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized");
        }
    }
}