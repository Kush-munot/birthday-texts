docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin
use nextjs-mongo
db.otps.find()
db.birthdays.find()
db.otps.deleteMany({})
db.birthdays.deleteMany({})
db.birthdays.deleteOne({"phoneNumber":"+917878918744"})
cloudflared tunnel --url http://localhost:3000


initial cron-job code

name: Birthday Reminder Cron Job

on:
  # schedule:
  #   # Run on odd days at 8 AM
  #   - cron: "0 8 1-31/2 * *"
  #   # Run on even days at 7:30 AM
  #   - cron: "30 7 2-30/2 * *"
  schedule:
    # Run every 10 minutes
    - cron: "*/10 * * * *"

  workflow_dispatch: # Allows manual triggering of the workflow

jobs:
  send-birthday-reminders:
    runs-on: ubuntu-latest

    steps:
      - name: Send Birthday Reminders
        run: |
          for i in {1..3}; do
            status_code=$(curl -m 30 -o /dev/null -s -w "%{http_code}" -X GET "https://funny-hounds-vanish.loca.lt/api/12f4094a-remindTodayBirthdays")
            if [ "$status_code" -eq 200 ]; then
              echo "Request successfull with status code 200. Stopping retries."
              break
            else
              echo "Request failed with status code $status_code. Retrying in 10 seconds..."
              sleep 10
            fi
          done

          