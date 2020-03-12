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
    MediaObject,
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

const videoGIF = 'https://i.ibb.co/6FmTDc8/DevExpo.gif';
const posterGIF = 'https://i.ibb.co/6DBFhwj/Intro-Final.gif';
const dscxmspc = 'https://i.ibb.co/DMhtQ9w/Untitled-design-1.png';
const faqGIF = 'https://i.ibb.co/238Ghtf/faqgif.gif';

const batGIF = 'https://i.ibb.co/k9nxR9c/batman-vs-superman.gif';
const ironmanGIF = ['https://i.ibb.co/9hSKrGC/iron-man-3-armor-equip-animation-by-z-studios-d5kmc8q.gif', 'https://i.ibb.co/2Mwsrcm/this-usually-works-by-zxcv11791-d58cv2o.gif'];
const deadpoolGIF = 'https://i.ibb.co/bLTz7R0/deadpool-likes-to-run-by-zxcv11791-d592l52.gif';

const myoption2 = [
    'This feature is still under development. It might be pushed to release in my future versions.',
    'Sorry! But my developers are too lazy playing games that they decided that they might put this in the next release.',
    'Hey there, this feature just might be available to you in the next update. Stay tuned to get it real quick.',
    'Are you a beta tester? If so, you\'ll be the first one to test this feature if this rolls out. For now please be patient and stay tuned.',
];

const dbs = {
    scavengerHunt: db.collection('scavengerHunt'),
    eastereggHunt: db.collection('eastereggHunt'),
    count: db.collection('count'),
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
        speech: `<speak>I've captured all of those questions, <prosody pitch="+7st" rate="0.5" volume="0.7"> and yeah, the silly ones as well </prosody> in the below GIF.</speak>`,
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
        conv.ask("Click on the button below to navigate to the registration page.");
        conv.ask(new BasicCard({
            text: `Register now to attend the flagship event of DevExpo 2.0`,
            title: `DevExpo 2.0 Registration`,
            image: new Image({
                url: videoGIF,
                alt: `DevExpo 2.0`,
            }),
            buttons: new Button({
                title: `Registration Page`,
                url: `https://docs.google.com/forms/d/e/1FAIpQLSc1HlEACdihO85vJSwVcHYt3JQEjl2tT3MMDfrs4i-OtRtwqg/viewform?usp=sf_link`,
            }),
            display: 'CROPPED',
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
            conv.ask('Rendering all that in to a card view in real time. What else can I help you with?');
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
            conv.ask('Rendering all that in to a card view in real time. What else can I help you with?');
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

    conv.ask("Here they are, select the card to view it in details.");
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
        conv.ask("What else can I help you with?");
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

app.intent('scavenger hunt', async (conv) => {
    if (!conv.user.storage.scavengerHuntVisit || !conv.user.storage.scavengerHunt) {
        conv.ask("<speak><par><media xml:id='one' begin='2s'><speak>Welcome to the land of Indiana Jones.<break time='300ms'/> Here you face <prosody pitch='-5st' rate='0.3'>sharp cryptic challenges <break time='300ms'/> designed to </prosody><prosody pitch='-5st' rate='0.2'>cripple you down.</prosody></speak></media><media end='one.end' soundLevel='+5.28dB' fadeOutDur='0.4s'><audio src='https://actions.google.com/sounds/v1/science_fiction/forboding_resonance.ogg'/> </media> </par> </speak>");
        conv.ask("And obviously there's a prized treasure waiting for you at the finish line. Are you ready for it?");
        conv.ask(new Suggestions(['Yes', 'No']));
        conv.user.storage.scavengerHuntVisit = 1;
    } else if (conv.user.storage.scavengerHunt == 3) {
        conv.ask("I see you have already finished all of the puzzles. Nice going.");
        conv.ask("To redeem your crystal skull, I mean your swags. Enter your details if you haven't.");
        conv.ask(new Suggestions(['Enter Details', 'Main Menu', 'Close this Action']));
    } else {
        conv.ask("Would you like to continue with your quest, Mr. Jones?");
        conv.ask(new Suggestions(['Continue']));
    }
});

app.intent('scavenger hunt - yes', (conv) => {
    if (!conv.user.storage.scavengerHunt) {
        conv.ask("I see we have found one of our heros. Will he be able to crack this down and get to the treasure? Let's see.");
        conv.ask("Here goes the first crypt.");
        conv.ask(new BasicCard({
            text: '**01010111 01101000 01101111 00100000 01101101 01100001 01100100 01100101 00100000 01110100 01101000 01100101 00100000 01000001 01101110 01100111 01110010 01111001 00100000 01000010 01101001 01110010 01100100 01110011 00100000 01100111 01100001 01101101 01100101 00111111**   \n   \n   \nSolve it and tell me the answer.',
            image: new Image({
                url: 'https://i.ibb.co/bgPDr4g/cipher-01.png',
                alt: 'Q1',
            }),
            display: 'WHITE',
        }));
        conv.ask(new Suggestions(['Enter Answer', 'Main Menu', 'Close this Action']));
    }
    else if (conv.user.storage.scavengerHunt == 1) {
        conv.ask("Congratulations on solving the first one. You moved past the treacharous mountains and now are in front of a cave guarded by a wierd creature.");
        conv.ask("<speak>The creature started talking in its own language. <break time='400ms'/> <audio src='https://storage.googleapis.com/devexpo-d9b92.appspot.com/Cipher2.mp3'></audio> <break time='400ms'/> Maybe it was asking for a password. Solve and get it to go past the second crypt.</speak>");
        conv.ask(new BasicCard({
            text: 'Click the button to download what the creature said. Solve it and tell me the answer.',
            buttons: new Button({
                title: "Download",
                url: 'https://storage.googleapis.com/devexpo-d9b92.appspot.com/Cipher2.mp3',
            }),
            image: new Image({
                url: 'https://i.ibb.co/7nDYKwb/cipher-02.png',
                alt: 'Q2',
            }),
            display: 'WHITE',
        }));
        conv.ask(new Suggestions(['Enter Answer', 'Main Menu', 'Close this Action']));
    }
    else if (conv.user.storage.scavengerHunt == 2) {
        conv.ask("Inside the dark cave you found a bottle.");
        conv.ask("In the bottle was a parchment. On it was written something.");
        conv.ask(new Image({
            url: 'https://i.ibb.co/XZ8fH9C/Some-wierd-text.png',
            alt: 'Q3',
        }));
        conv.ask(new Suggestions(['Enter Answer', 'Main Menu', 'Close this Action']));
    }
    else if (conv.user.storage.scavengerHunt == 3) {
        conv.ask("I see you have already finished all of the puzzles. Nice going.");
        conv.ask("To redeem your crystal skull, I mean your swags. Enter your details if you haven't.");
        conv.ask(new Suggestions(['Enter Details', 'Main Menu', 'Close this Action']));
    }

});

app.intent('enter answer - answer', async (conv, { any }) => {
    var answer = any.toLowerCase();
    if (answer.includes('rovio')) {
        conv.user.storage.scavengerHunt = 1;
        conv.ask("You got it champ. Solving the first of many ciphers, you move forward the treacharous mountains. What comes next?");
        conv.ask("Go back to the Scavenger Hunt to find out.");
        conv.ask(new Suggestions(['Scavenger Hunt', 'Main Menu', 'Close this Action']));
    } else if (conv.user.storage.scavengerHunt == 1 && answer.includes('bill gates')) {
        conv.ask("Wow that was really awesome. Even it took me months to learn that language. The creature now let's you go inside the cave. What do you find inside the dark cave?");
        conv.ask("Go back to the Scavenger Hunt to find out.");
        conv.ask(new Suggestions(['Scavenger Hunt', 'Main Menu', 'Close this Action']));
        conv.user.storage.scavengerHunt = 2;
    } else if (conv.user.storage.scavengerHunt == 2 && answer.includes('david craves')) {
        conv.ask("There's our hero. You solved the map, followed it and found the crystal skull. Welcome back to the real world Mr. Jones.");
        conv.ask("To redeem your crystal skull for swags you need to enter your details below. Click on the suggestion to continue.");
        conv.ask(new Suggestions(['Enter Details', 'Main Menu', 'Close this Action']));
        conv.user.storage.scavengerHunt = 3;
    } else {
        conv.ask("Nope that's not it. I'm smart enough not to give away crystal skulls to just about everyone.");
        conv.ask("Please try again. Or you can even check out all of my other features.");
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
    }
});

app.intent('enter details - final', async (conv, { name, roll }) => {
    if (conv.user.storage.scavengerHunt == 3 && !conv.user.storage.eastereggHunt) {
        const countRef = dbs.count.doc('scavengerCount');
        const nextCount = await countRef.get();
        var count = nextCount.data().count + 1;
        await countRef.update({ count: count });
        await dbs.scavengerHunt.doc(`user ${count}`).set({ name: name, roll: roll });
        conv.ask("I have saved your details. I'll pass it on to someone who'll give you your crystal skull.");
        conv.ask("Make sure to attend DevExpo 2.0 to get it. Until then, what can I help you with?");
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        conv.user.storage.scavengerHunt = 0;
    } else if ((conv.user.storage.eastereggHunt == 3 && conv.user.storage.scavengerHunt != 3) || (conv.user.storage.eastereggHunt == 3 && !conv.user.storage.scavengerHunt)) {
        const countRef = dbs.count.doc('eastereggCount');
        const nextCount = await countRef.get();
        var count = nextCount.data().count + 1;
        await countRef.update({ count: count });
        await dbs.eastereggHunt.doc(`user ${count}`).set({ name: name, roll: roll });
        conv.ask("I have saved your details. I'll pass it on to someone who'll give you your cool swag.");
        conv.ask("Make sure to attend DevExpo 2.0 to get it. Until then, what can I help you with?");
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        conv.user.storage.eastereggHunt = 0;
    } else if (conv.user.storage.eastereggHunt == 3 && conv.user.storage.scavengerHunt == 3) {
        conv.ask("You have found yourself in a deadlock situation. That is because you've been too greedy to fill in your details the first time you solved something.")
        conv.ask("As being too greedy is really bad for a person, I'd go ahead and wipe out all your progress so that you have to start fresh. But you already are a step ahead of everyone. Use that wisely. What do you want to know about now?");
        conv.ask(new Suggestions(['Scavenger Hunt', 'Easter Eggs', 'Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
        conv.user.storage.scavengerHunt = 0;
        conv.user.storage.eastereggHunt = 0;
    } else {
        conv.ask("Uh no! Another freeloader. Make sure you complete the quest or find an easter egg before trying to enter details because I can handle cheaters very well.");
        conv.ask("Complete the Scavenger Hunt and then try again.");
        conv.ask(new Suggestions(['Scavenger Hunt', 'Easter Eggs', 'Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
    }
});

app.intent('marvel dc easter egg', async (conv, { quotes }) => {
    conv.user.storage.eastereggHunt = 3;
    if (quotes === "batman") {
        conv.ask("Batman seems happy that you've used your intelligence to reach here.");
        conv.ask(new Image({
            url: batGIF,
            alt: 'batman',
        }));
    } else if (quotes === "iron man") {
        conv.ask("Ironman isn't at home, but JARVIS made sure to give him your regards.");
        const gifArr = ironmanGIF;
        const gifIndex = Math.floor(Math.random() * gifArr.length);
        const randomGIF = gifArr[gifIndex];
        conv.ask(new Image({
            url: randomGIF,
            alt: 'ironman',
        }));
    } else if (quotes === "deadpool") {
        conv.ask(new SimpleResponse({
            speech: "<speak>Deadpool doesn't give a <say-as interpret-as='expletive'>fuck</say-as> when he sees you. But, </speak>",
            text: "Deadpool doesn't give a f**k when he sees you. But, ",
        }));
        conv.ask(new Image({
            url: deadpoolGIF,
            alt: 'deadpool',
        }));
    }
    conv.ask("We'd like to appreciate that by awarding you with some awesome swags. Please enter your details now. Click on the suggestions to continue.");
    conv.ask(new Suggestions(['Enter Details', 'Main Menu', 'Close this Action']));
});

app.intent('mission impossible easter egg', async (conv) => {
    if (!conv.user.storage.miVisit) {
        conv.user.storage.miVisit = 1;
        conv.ask("You've got to the dark side of the quest. Feel free to go back if you're not steel hearted. This isn't for the feeble minded as well.");
        conv.ask(new SimpleResponse({
            speech: "Listen closely, your mission, should you choose to accept it, is to find a member of the DevExpo team named Manish, get a secret file from him. Decrypt it to get a password. Find another member of the DevExpo team named Amrit and get the encrypted file from him. Open it using the password from earlier. Follow the instructions from there. As always, should you or any of your IM Force be caught or killed, the Secretary will disavow any knowledge of your actions. This message will self-destruct in five seconds. Good luck,",
            text: "Listen closely, ",
        }));
        conv.ask(new Image({
            url: 'https://thumbs.gfycat.com/NiceUnrulyAmericanblackvulture-size_restricted.gif',
            alt: 'timer',
        }));
        conv.ask(new Suggestions(['Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']))
    } else {
        conv.ask("This message was self destructed.");
        conv.ask("For now you can find other easter eggs and complete the scavenger hunt to win goodies. Or else I can help you with any other queries regarding DevExpo 2.0.");
        conv.ask(new Suggestions(['Scavenger Hunt', 'Easter Eggs', 'Main Menu', 'Event Schedule', 'Guest Speakers', 'About DevExpo 2.0', 'Close this Action']));
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);