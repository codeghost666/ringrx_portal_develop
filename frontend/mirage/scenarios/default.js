export default function(server) {
  server.createList('contact', 30);
  server.createList('cdr', 1000);
  server.createList('voicemail', 1000);
  server.createList('phonenumber', 30);
}
