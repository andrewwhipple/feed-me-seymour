export PORT=80
PROCESSID=$1
kill $PROCESSID
node server.js &