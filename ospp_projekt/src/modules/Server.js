import React, { useState } from 'react';
//denna kod har såhär många kommentarer för att förklara vad den gör åt de som är obekanta med react

//Keywordet export behövs för att exportera element. Också, lägg märke till syntaxen för funktioner

export const ServerMessages = () => {

    // Dessa är hooks, eller mera exakt, dessa är state hooks. Funktionen useState() returnerar en tupel som består av ett objekt samt
    // en funktion för att uppdatera det objektet. Dessa kan döpas till vad som helst, men kutym är att döpa de till 'objekt' och 'setObjekt'
    // Det finns andra sorters hooks är state hooks

    const [messages, setMessages] = useState(["Message1", "Message2"]);
    const [newMessage, setNewMessage] = useState("");

    // State hooks tillåter oss att spara variabler i funktioner även efter att vi returnerat från dem. När vi skriver react så returnerar våra
    // funktioner ofta element vi vill rendera

    // Denna funktion, som kallas nere vid 'Message = <input...', är en så kallad event handler. Den körs varje gång inputmeddelandet 'Message'
    // ändras. Specifikt så kallar den på setNewMessage, alltså den uppdaterar värdet på 'newMessage'. 'event' är inparametern som implicit ges 
    // av 'onChange' funktionen längre ner, den kan egentligen heta vad som helst. 

    const writeMessage = (event) => {
        setNewMessage(event.target.value);
    }

    return (

        // Eftersom vi vill kalla denna kodsnutt i 'App.js' så måste den ha ett namn, i detta fall "ServerMessages". Detta är ett s.k. parent 
        // element. Parent elements måste börja med versal. 

        <div className="ServerMessages">

        {/* (Detta kodformat krävs innanför JSX, d.v.s. innanför displayade element) */}
        {/* Denna kodsnutt gör att vi kan skriva ut alla strängar i 'messages' */}

        <h1>{messages.map(message => {
            return <div>{message}</div>;
        })}</h1>

            {/* I en inputlåda kan man skriva saker. För att de ska displayas måste vi specificera value. I detta fall är det 'newMessage'. 
                'onChange' är ett så kallat event */}

            Message = <input type="text" onChange={writeMessage} value={newMessage} />

            {/* Slutligen har vi 'onClick', ett till sorts event. Till skillnad från 'onChange' så kallar vi inte på en namngiven funktion 
                här, utan i stället så använder vi en anonym funktion (Det spelar ingen roll, i 'onChange' hade vi lika gärna kunna stoppat in 

                (event) => {
                    setNewMessage(event.target.value);
                }

                i stället för att kalla på 'writeMessage' som gör samma sak, så det är helt en smaksak vilken du föredrar.)

                Det som vår anonyma funktion gör är helt enkelt att konkatenera in vårt nya meddelande bland de gamla, och 
                återställer 'newMessage' till "". Notera att vi aldrig explicit begär programmet skriva ut meddelandet, utan att
                kodsnutten

                <h1>{messages.map(message => {
                    return <div>{message}</div>;
                })}</h1> 
                
                körs automatiskt utan input från oss. */}

            <button onClick={() => {setMessages(messages.concat([newMessage])); 
                                    setNewMessage("")}}>Send!</button>
        </div>
    );
}

