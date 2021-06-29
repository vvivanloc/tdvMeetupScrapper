#/usr/bin/python3
import pandas as pd
df = pd.read_json (r'output/meetups.json')
df.to_csv (r'output/meetups.csv', index = None)
meetupDescriptions = pd.read_csv(r"output/meetups.csv")
meetupDescriptions = meetupDescriptions[["meetupid", "description"]]
meetupTitles = pd.read_csv(r"input/events.csv")
meetupJoin = pd.merge(meetupTitles,meetupDescriptions, on="meetupid", how='right')
meetupJoin.to_csv(r'output/meetups_full.csv', index = False, header=True)