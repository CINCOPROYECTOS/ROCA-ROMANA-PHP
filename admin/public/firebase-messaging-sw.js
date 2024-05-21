importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
 const firebaseConfig = {apiKey:'AIzaSyB-LpruG0IYIy2u826beNoKq5IRFRfnFsI',
authDomain:'rocar-8a8bc.firebaseapp.com',
projectId:'rocar-8a8bc',
storageBucket:'rocar-8a8bc.appspot.com',
messagingSenderId:'687488546096',
appId:'1:687488546096:web:26c8cb58f8902fef5ec4f5',
measurementId:'G-8BK26QXVM6',
 };
if (!firebase.apps.length) {
 firebase.initializeApp(firebaseConfig);
 }
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
console.log(payload);
 var title = payload.data.title;
var options = {
body: payload.data.body,
icon: payload.data.icon,
data: {
 time: new Date(Date.now()).toString(),
 click_action: payload.data.click_action
 }
};
return self.registration.showNotification(title, options);
 });
self.addEventListener('notificationclick', function(event) {
 var action_click = event.notification.data.click_action;
event.notification.close();
event.waitUntil(
clients.openWindow(action_click)
 );
});