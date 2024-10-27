// ws-server.js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let clients = [];


server.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (message) => {
    console.log('Received:', message);
  });
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');


function broadcastUpdate(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Mock: Simulate status update every few seconds
setInterval(() => {
    const sampleUpdate = {
        id: 1,
        status: 'ongoing',
        title: 'Updated Server Outage Status',
        service: 'API',
        updates: ['Status changed to ongoing'],
    };
    broadcastUpdate(sampleUpdate);
}, 5000);
