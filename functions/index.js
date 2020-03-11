'use strict';

const {
    dialogflow,
    Suggestions,
    SimpleResponse,
    BasicCard,
    Button,
    Image,
    LinkOutSuggestion,
    List,
    Carousel,
    BrowseCarousel,
    BrowseCarouselItem,
} = require('actions-on-google');

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const loadJsonFile = require('load-json-file');

admin.initializeApp();

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const app = dialogflow({
    debug: true,
});

const posterGIF = 'https://i.ibb.co/6FmTDc8/DevExpo.gif';
const dscxmspc = 'https://i.ibb.co/DMhtQ9w/Untitled-design-1.png';
const faqGIF = 'https://i.ibb.co/238Ghtf/faqgif.gif';

const myoption2 = [
    'This feature is still under development. It might be pushed to release in my future versions.',
    'Sorry! But my developers are too lazy playing games that they decided that they might put this in the next release.',
    'Hey there, this feature just might be available to you in the next update. Stay tuned to get it real quick.',
    'Are you a beta tester? If so, you\'ll be the first one to test this feature if this rolls out. For now please be patient and stay tuned.',
];

const dbs = {
    schedule: db.collection('schedule'),
};

function timeBetween(startTime, endTime) {
    var dt = new Date();
    var dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours() + 5, dt.getMinutes() + 30);


    var s = startTime.split(':');
    var dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(s[0]), parseInt(s[1]));

    var e = endTime.split(':');
    var dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(e[0]), parseInt(e[1]));

    console.log(dt + "--" + dt1 + "--" + dt2);


    if (dt >= dt1 && dt <= dt2)
        return 1;
    else
        return 0;
}

app.intent('new-eggs', (conv) => {
    const factArr = myoption2;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    conv.ask(randomFact);
    conv.ask('Right now I can only help you with any queries regarding DevExpo 2.0.');
    conv.ask(new Suggestions(['Main Menu', 'FAQ\'s', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
});

app.intent('Default Welcome Intent', (conv) => {
    var currentDate = new Date();
    var checkDate = new Date('2020-03-13');
    var opener;

    if (conv.user.storage.actionVisit) {
        opener = "Welcome back to DevExpo 2.0.";
    }
    else {
        conv.user.storage.actionVisit = 1;
        opener = "Hello there. Welcome to DevExpo 2.0, this year's flagship event.";
    }

    if (conv.data.menuvisit == 1) {
        conv.ask("Back to Main Menu.");
        conv.ask("What help can I offer you now?");
        if (checkDate > currentDate) {
            conv.ask(new Suggestions(['Register Now', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        } else {
            conv.ask(new Suggestions(['Current Event', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        }
    }
    else {
        conv.data.menuvisit = 1;
        conv.ask(opener);

        if (checkDate > currentDate) {
            conv.ask("As your personal guide I can help you register for the event, see the event schedule and so much more. What can I help you with?");
            conv.ask(new Suggestions(['Register Now', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
        } else {
            conv.ask("As your personal guide I can help you check what is the current event, see the event schedule and so much more. What can I help you with?");
            conv.ask(new Suggestions(['Current Event', 'Event Schedule', 'Guest Speakers', 'Scavenger Hunt', 'About DevExpo 2.0']));
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
    conv.ask("The questions here are pretty simple. And so are the answers.");
    conv.ask(new SimpleResponse({
        speech: `<speak>I've captured all of those questions, <prosody pitch="100%" rate="0.5" volume="0.7"> and yeah, the silly ones as well </prosody> in the below GIF.</speak>`,
        text: `I've captured all of those questions in the below GIF.`,
    }));
    conv.ask(new Image({
        url: faqGIF,
        alt: `FAQ's`,
    }));
    conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
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
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
    }
});

app.intent('guest speakers', (conv) => {
    var x, t = [];
    return loadJsonFile('speakers.json').then(json => {
        for (let i = 0; i < json.speakers.length; i++) {
            console.log(json.speakers[i].speaker_name);
            x = new BrowseCarouselItem({
                title: `${json.speakers[i].speaker_name}`,
                description: `${json.speakers[i].speaker_desc}`,
                url: `${json.speakers[i].linkedin_url}`,
                image: new Image({
                    url: json.speakers[i].speaker_image,
                    alt: `${json.speakers[i].speaker_name}`,
                }),
            });
            t.push(x);
        }
        conv.ask("Here are all of the Guest Speakers who will be delivering an engaging talk just for you.");
        conv.ask("Click on the card to find and connect with them on LinkedIn.");
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'About DevExpo 2.0', 'Close this Action']));
        conv.ask(new BrowseCarousel({
            items: t,
        }));
    }).catch(e => {
        console.log(e);
    });
});

app.intent('current event', (conv) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var currentDate = year + "-" + month + "-" + date;
    var eventDay1 = '2020-03-14';
    var eventDay2 = '2020-03-15';
    var i, flag = 0;

    if (currentDate === eventDay1) {
        let json = loadJsonFile.sync('sessions1.json');
        for (i = 0; i < json.sessions.length; i++) {
            if (timeBetween(json.sessions[i].session_start_time, json.sessions[i].session_end_time) == 1) {
                flag = 1;
                break;
            }
            console.log(`${i} : ${json.sessions[i].speaker_name}`);
        }
        // console.log(json.sessions[i].speaker_name);
        if (flag == 1) {
            conv.ask(`At this very moment, I've figured that we have a ${json.sessions[i].session_title} by ${json.sessions[i].speaker_name}.`);
            conv.ask('Rendering all that in to a card view in real time. Here you go, ');
            conv.ask(new BasicCard({
                text: `**Event Description :** ${json.sessions[i].session_desc}   \n**By :** ${json.sessions[i].speaker_name} of ${json.sessions[i].speaker_desc}   \n**Event Duration :** ${json.sessions[i].session_total_time}   \n   \n**Track :** ${json.sessions[i].track}`,
                title: `${json.sessions[i].session_title}`,
                image: new Image({
                    url: json.sessions[i].speaker_image,
                    alt: `${json.sessions[i].speaker_name}`,
                }),
                display: 'WHITE',
            }));
            conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        }
        else {
            conv.ask("Hey buddy, I think you\'ve wandering around the wrong place because there are no events going on currently.");
            conv.ask("You can check out the full event schedule and so much more in this Action. What can I help you with?");
            conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        }
    }
    else if (currentDate === eventDay2) {
        let json = loadJsonFile.sync('sessions2.json');
        for (i = 0; i < json.sessions.length; i++) {
            if (timeBetween(json.sessions[i].session_start_time, json.sessions[i].session_end_time) == 1) {
                flag = 1;
                break;
            }
            console.log(`${i} : ${json.sessions[i].speaker_name}`);
        }
        if (flag == 1) {
            conv.ask(`At this very moment, I've figured that we have a session on ${json.sessions[i].session_title} by ${json.sessions[i].speaker_name}.`);
            conv.ask('Rendering all that in to a card view in real time. Here you go, ');
            conv.ask(new BasicCard({
                text: `**Session Description :** ${json.sessions[i].session_desc}   \n**Speaker :** ${json.sessions[i].speaker_name}   \n**Speaker Designation :** ${json.sessions[i].speaker_desc}   \n**Session Duration :** ${json.sessions[i].session_total_time}   \n   \n**Track :** ${json.sessions[i].track}`,
                title: `${json.sessions[i].session_title}`,
                image: new Image({
                    url: json.sessions[i].speaker_image,
                    alt: `${json.sessions[i].speaker_name}`,
                }),
                display: 'WHITE',
            }));
            conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        }
        else {
            conv.ask("Hey buddy, I think you\'ve wandering around the wrong place because there are no events going on currently.");
            conv.ask("You can check out the full event schedule and so much more in this Action. What can I help you with?");
            conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        }
    }
    else {
        conv.ask("Hey Sherlock, although you found me here, there are definitely no events going on today.");
        conv.ask("<speak><par><media xml:id='one' begin='0.5s'><speak>Is that because DevExpo already ended?</speak></media><media begin='one.end' fadeOutDur='2s'><speak><prosody pitch='low' rate='0.4' volume='1.5'>Or has it not started yet?.</prosody></speak></media><media end='5s' soundLevel='+2.28dB' fadeInDur='0.2s' fadeOutDur='0.4s'><audio src='https://actions.google.com/sounds/v1/horror/hallow_wind.ogg'/> </media> </par> Meanwhile, you can check out all of my other features.</speak>");
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
    }
});

app.intent('schedule', (conv) => {
    conv.ask("We are fully loaded with two days of power packed events.");
    conv.ask("Select for which day you want the schedule for, the 14th or the 15th.");
    conv.ask(new Suggestions(['14th March', '15th March']));
});

app.intent('schedule - next', async (conv, { session }) => {
    var t2 = {};
    var x, json, i, nextday, img;

    if (session === "14") {
        conv.ask("The first day of DevExpo is the day of fun. Packed with a ton of engaging fun events.");
        json = loadJsonFile.sync('sessions1.json');
        nextday = "15";
        conv.data.sessionDay = 14;
    }
    else if (session === "15") {
        conv.ask("The second day of DevExpo is the day of technology. We have an awesome lineup of industry expert speakers ready to share their experience and knowledge with you.");
        json = loadJsonFile.sync('sessions2.json');
        nextday = "14";
        conv.data.sessionDay = 15;
    }
    else {
        conv.ask("This one time I wrote a book called 3 Mistakes of my Life. Do you know what was one of them?");
        conv.ask("Not knowing that DevExpo was on the 14th and 15th of March. Now, which day\'s schedule do you wanna look at?");
        conv.ask(new Suggestions(['Day 1', 'Day 2']));
        return;
    }

    conv.ask("Here they are, click on the card to view it in details.");
    for (i = 0; i < json.sessions.length; i++) {
        if (session == "14") {
            img = json.sessions[i].speaker_image;
        }
        else if (session == "15") {
            img = json.sessions[i].speaker_poster;
        }
        x = {
            title: `${json.sessions[i].session_title}`,
            description: `${json.sessions[i].speaker_name} | ${json.sessions[i].session_total_time}`,
            image: new Image({
                url: img,
                alt: `${json.sessions[i].session_title}`,
            }),
        };
        t2[`${json.sessions[i].session_id}`] = x;
    }
    conv.ask(new Carousel({
        items: t2,
    }));
    conv.ask(new Suggestions([`${nextday}th March`, 'Main Menu', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
});

app.intent('schedule - next - detail', async (conv, params, option) => {
    var i, flag = 0, json, img;

    if (conv.data.sessionDay == 14) {
        json = loadJsonFile.sync('sessions1.json');
    }
    else if (conv.data.sessionDay == 15) {
        json = loadJsonFile.sync('sessions2.json');
    }

    for (i = 0; i < json.sessions.length; i++) {
        if (json.sessions[i].session_id === option) {
            flag = 1;
            break;
        }
        console.log(`${i} : ${json.sessions[i].speaker_name}`);
    }
    if (flag == 1) {
        if (conv.data.sessionDay == 14) {
            img = json.sessions[i].speaker_image;
        }
        else if (conv.data.sessionDay == 15) {
            img = json.sessions[i].speaker_poster;
        }
        conv.ask('Rendering the event to a card view in real time.');
        conv.ask(" Here you go, ");
        conv.ask(new BasicCard({
            text: `**Event Description :** ${json.sessions[i].session_desc}   \n**By :** ${json.sessions[i].speaker_name} of ${json.sessions[i].speaker_desc}   \n**Event Duration :** ${json.sessions[i].session_total_time}   \n   \n**Track :** ${json.sessions[i].track}`,
            title: `${json.sessions[i].session_title}`,
            image: new Image({
                url: img,
                alt: `${json.sessions[i].speaker_name}`,
            }),
            display: 'WHITE',
        }));
    }
    else {
        conv.ask("I never knew there were room for the imaginary event that you just cooked up.");
        conv.ask("Oh wait there isn't. So please imagine something feasible or choose from the suggestions below.");
    }
    conv.ask(new Suggestions(['Main Menu', 'All Speakers', 'About DevExpo 2.0', 'Close this Action']));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);