const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/whatsapp.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const whatsappProto = grpc.loadPackageDefinition(packageDefinition).whatsapp;

let session;

function sendMessage(call, callback) {
  const metadata = call.metadata.get('x-password');
  //console.log(metadata)
  const password = metadata?.[0];

  if (password !== process.env.WHATSAPP_API_PASSWORD) {
    return callback({
      code: grpc.status.PERMISSION_DENIED,
      message: 'Invalid password',
    });
  }

  const { mobileNumber, text } = call.request;
  const chatId = mobileNumber.endsWith('@c.us') ? mobileNumber : `${mobileNumber}@c.us`;

  session.sendMessage(chatId, text)
    .then(() => callback(null, { ok: true, message: 'Message sent' }))
    .catch(err => callback(null, { ok: false, message: err.message }));
}

function startGrpcServer(whatsappClient) {
  session = whatsappClient;

  const server = new grpc.Server();
  server.addService(whatsappProto.WhatsApp.service, { SendMessage: sendMessage });
  const PORT = process.env.GRPC_PORT || 50051;
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC Server running on port ${PORT}`);
  });
}

module.exports = { startGrpcServer };
