'use strict';

const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    BasicCard,
    Button,
    Image,
    LinkOutSuggestion,
    List,
} = require('actions-on-google');

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const dbs = {
    schedule: db.collection('schedule'),
};
const posterGIF = 'https://i.ibb.co/6FmTDc8/DevExpo.gif';
const dscxmspc = 'https://i.ibb.co/DMhtQ9w/Untitled-design-1.png';

const app = dialogflow({
    debug: true,
});

app.intent('Default Welcome Intent', (conv) => {
    var currentDate = new Date();
    var checkDate = new Date('2020-03-13');
    var eventDate = new Date('2020-03-15');

    if (conv.data.menuvisit == 1) {
        conv.ask("Back to Main Menu.");
        if (checkDate > currentDate) {
            conv.ask(new Suggestions(['Register Now', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        } else if (currentDate = eventDate) {
            conv.ask(new Suggestions(['Current Event', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        } else {
            conv.ask(new Suggestions(['Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        }
    }
    else {
        conv.data.menuvisit = 1;
        conv.ask("Hello there. Welcome to DevExpo 2.0, this year's flagship event.");

        if (checkDate > currentDate) {
            conv.ask("As your personal guide I can help you register for the event, see the event schedule and so much more. What can I help you with?");
            conv.ask(new Suggestions(['Register Now', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        } else if (currentDate = eventDate) {
            conv.ask("As your personal guide I can help you check what is the current event, see the event schedule and so much more. What can I help you with?");
            conv.ask(new Suggestions(['Current Event', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        }
        else {
            conv.ask("As your personal guide I can help you check what is the current event, see the event schedule and so much more. What can I help you with?");
            conv.ask(new Suggestions(['Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        }
        conv.ask(new Image({
            url: posterGIF,
            alt: `DevExpo 2.0`,
        }));
    }
});

app.intent('about', (conv) => {
    conv.ask("DevExpo 2.0 will be an all-in-one Developers meet where you can find students from all levels of study coming and networking for the greater good of the society through technology, open for KiiT students only.");
    conv.ask("This will be a two-day event and will be power-packed with some amazing and enthusiastic people, and it'll be a regret to miss it.");
    conv.ask(new BasicCard({
        text: `The event will showcase informative sessions on some of the burning topics in the industry like Azure Cloud, Machine Learning and its applications, Web Technologies and concepts of UI/UX being some of them. There will be exciting networking sessions for the sociable person in you.   \n   \n🛠️: **DSC KIIT** and **MSPC KIIT**   \n📅: **March 14th and 15th, 2020 (Saturday and Sunday)**   \n🗺️: **Auditorium, Architecture Building,  KIIT DU**   \n🕒: **From 10 am**   \n☎️: **Alok Narayan (+91 9199624153), Manish Rath (+91 7978904226)**`,
        title: `DevExpo 2.0`,
        subtitle: `There are a plethora of fun activities planned out for you people and of course, there will be swags and goodies.`,
        image: new Image({
            url: dscxmspc,
            alt: `DevExpo 2.0`,
        }),
        buttons: new Button({
            title: `Check Event Location`,
            url: `https://maps.google.com/?q=20.3484759,85.8172024`,
          }),
        display: 'WHITE',
    }));
    conv.ask(new Suggestions(['FAQ\'s', 'Main Menu', 'Event Schedule', 'Guest Speakers', 'Close this Action']));
});

app.intent('faq', (conv) => {
    conv.ask("The questions here are pretty simple.");
    conv.ask("And so are the answers.");
    
});

app.intent('register', (conv) => {
    var currentDate = new Date();
    var checkDate = new Date('2020-03-13');

    if (checkDate > currentDate) {
        conv.ask("You have to register yourself as an attendee to come to the all fun and all tech two day event of DevExpo.");
        conv.ask("Click on the link below to navigate to the registration page.");
        conv.ask(new LinkOutSuggestion({
            name: 'Registration Page',
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSc1HlEACdihO85vJSwVcHYt3JQEjl2tT3MMDfrs4i-OtRtwqg/viewform?usp=sf_link',
        }));
        conv.ask(new Suggestions(['Main Menu', 'Close this Action']));
    } else {
        conv.ask("Hey buddy. I\'m really sorry but we have closed registrations for this year\'s DevExpo. But we\'re certainly hoping to see you next year.");
        conv.ask("While you\'re here feel free to check out the event schedule and all of our guest speakers for this year.");
    }
    conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);