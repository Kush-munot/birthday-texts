docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin
use nextjs-mongo
db.otps.find()
db.birthdays.find()
db.otps.deleteMany({})
db.birthdays.deleteMany({})
db.birthdays.deleteOne({"phoneNumber":"+917046444344"})
cloudflared tunnel --url http://localhost:3000