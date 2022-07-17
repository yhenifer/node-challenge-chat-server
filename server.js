const express = require("express");
const cors = require("cors");
const fs = require("fs");
const messages = require("./messages.json");
const bodyParser = require("body-parser");
const { request } = require("http");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

const baseDeDatos = "messages.json";

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

function saveMessageToDatabase(message) {
  messages.push(message);
  fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2));
}

const getMessageById = (request, response) => {
  const id = Number(request.params.id);
  const message = messages.find((message) => id === message.id);
  console.log(message);
  response.send(message);
};

//FUNCTIONS

const postMessage = (request, response) => {
  const newMessage = request.body;
  console.log("request body", request.body);

  if (!request.body.text || !request.body.from) {
    return response.status(400).send("texto vacio");
  }
  newMessage.timeSet = new Date();
  newMessage.id = messages.length;
  saveMessageToDatabase(newMessage);
  response.send(newMessage);
};

const getMessages = (request, response) => {
  response.send(messages);
};

const searchMessage = (request, response) => {
  const text = request.query.text;
  const findText = messages.filter((message) => message.text.includes(text));
  response.send(findText);
};

const findLatest = (request, response) => {
  const text = request.query.text;
  const latest5 = messages.slice(-5);
  response.send(latest5);
};

const deleteMessageById = (request, response) => {
  const id = Number(request.params.id);
  const deleteById = messages.findIndex((message) => message.id === id);
  messages.splice(deleteById, 1);
  response.send("Message Delete");
};

const putMessage = (request, response) => {
  const id = Number(request.params.id);
  const message = messages.find((message) => id === message.id);
  if (message) {
    message.text = request.body.text;
    message.from = request.body.from;
    response.send({
      status: "Your message has been modified!",
      data: message,
    });
  } else {
    response.status(400);
    response.send("Your message has not been modified!");
  }
};

//MIDDLEWARE
app.get("/messages", getMessages);
app.post("/messages", postMessage);
app.get("/messages/search", searchMessage);
app.get("/messages/latest", findLatest);
app.get("/messages/:id", getMessageById);
app.delete("/messages/:id", deleteMessageById);
app.put("/messages/:id", putMessage);

//SERVER
/*app.listen(3000, () => {
  console.log("Listening on port 3000", "http://localhost:3000/");
});*/

//SERVER
app.listen(3000, () => {
  console.log("Listening on port 3000", "http://localhost:3000/");
});
  
 