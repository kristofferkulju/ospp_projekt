// Synch input values between tabs (Name, LobbyID) so that they remain persistent
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('name-input')) {
      const nameInputValue = event.target.value;
      document.querySelectorAll('.name-input').forEach(input => input.value = nameInputValue);
    } else if (event.target.classList.contains('lobbyID-input')) {
      const lobbyIDInputValue = event.target.value;
      document.querySelectorAll('.lobbyID-input').forEach(input => input.value = lobbyIDInputValue);
    }
});

// JavaScript function to switch tabs
function toggleTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab.${tabName}`).classList.add('active');

  const contents = document.querySelectorAll('.content');
  contents.forEach(content => content.classList.remove('active'));
  document.querySelector(`.content.${tabName}`).classList.add('active');
}
  
function spectateLobby() {
    const name = document.querySelector('.content.join .name-input').value;
    const lobbyID = document.querySelector('.content.join .lobbyID-input').value;
    console.log(`User '${name}' is spectating lobby '${lobbyID}'`);
    //window.location.href = 'http://192.168.50.163:3000/'; // Navigate to new window
    return null;
};

function joinLobby() {
    const name = document.querySelector('.content.join .name-input').value;
    const lobbyID = document.querySelector('.content.join .lobbyID-input').value;
    console.log(`User '${name}' joined lobby '${lobbyID}'`);
    //window.location.href = 'http://192.168.50.163:3001/'; // Navigate to new window
    return null;
};

function createLobby() {
    const lobbyProperties = {};
    lobbyProperties["creator"] = document.querySelector('.content.join .name-input').value;
    lobbyProperties["lobbyID"] = document.querySelector('.content.join .lobbyID-input').value;
    lobbyProperties["spectatorsAllowed"] = document.querySelector('.content.settings .allowSpectators').checked;
    lobbyProperties["maxPlayers"] = document.querySelector('.content.settings .maxplayers').value;

    console.log(lobbyProperties);
    //window.location.href = 'http://192.168.50.163:3002/'; // Navigate to new window
    return null;
};