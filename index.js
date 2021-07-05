
// posting: <user name> -> <message>
// reading: <user name>
// following: <user name> follows <another user>
// wall: <user name> wall

const readline = require('readline-sync')
const fs = require('fs')

const data = readData('data.json')

function readData(fileName) {
  let data

  try {
    const rawData = fs.readFileSync(fileName)
    data = JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading file', err)
  }

  return data
}

const saveData = () => {
  try {
    const dataAsString = JSON.stringify(data, null, 2);
    fs.writeFileSync('data.json', dataAsString);
  } catch (err) {
    console.error('Error saving data', err)
  }
}

const formatPost = ({ text, timestamp }, username) => {
  const date = new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '');

  return `${username} at ${date}:
    ${text}
  `
}

const reading = (username) => {
  if (username in data) {
    return data[username].posts.map(post => formatPost(post, username)).join('\n')
  } else {
    return `No username with name ${username}`
  }
}

const post = (username, message) => {
  data[username].posts.push({ text: message, timestamp: Date.now() })
  saveData();
  return `Post as ${username} ${message}`;
}

const mainLoop = () => {
  let hasInputs = true
  while (hasInputs) {
    let command = readline.question("What do you want to do? ");
    const parts = command.split(" ");

    if (parts.length === 1) {
      if (parts[0].match(/quit/i)) {
        hasInputs = false
        console.log('Bye bye')
      } else {
        // Reading: <user name>
        console.log(reading(parts[0]));
      }
    } else if (parts.length == 2 && parts[1] === "wall") {
      // wall: <user name> wall
    } else if (parts.length >= 3 && parts[1] === "->") {
      // posting: <user name> -> <message>
      const [username, _, ...messageParts] = parts;
      const message = messageParts.join(" ");
      console.log(post(username, message));
    } else if (parts.length == 3 && parts[1] === "follows") {
      // following: <user name> follows <another user>
    } else {
      console.log("You are a terrible person. Write a proper command.");
    }
  }
};

mainLoop();
