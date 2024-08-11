docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin
use nextjs-mongo
db.otps.find()
db.otps.deleteMany({})