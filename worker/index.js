const keys = require('./keys');
const redis = require('redis');

//const express = require('express');

//const app = express();

//app.get('/',(req,res) =>{ res.send({'message':'htting Me?'}); console.log('hitting Me?');})
//app.listen(5000);

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
