#/usr/bin/python3
def month_converter(monthInput):
    months = ['jan', 'fe', 'mar', 'avr', 'mai', 'juin', 'jui', 'aou', 'sep', 'oct', 'nov', 'dec']
    for i in range(len(months)):
        if (monthInput.lower().startswith(months[i])):
            return i + 1
    raise ValueError(monthInput+' not found')

import pandas as pd
df = pd.read_json (r'output/meetups.json')
df.to_csv (r'output/meetups.csv', index = None)
meetupDescriptions = pd.read_csv(r"output/meetups.csv")
meetupDescriptions = meetupDescriptions[["meetupid", "description"]]
meetupTitles = pd.read_csv(r"input/events.csv")
meetupTitles['place'] = meetupTitles['place'].apply(lambda x: x.replace("\n", " ").strip())
meetupTitles['month']  = meetupTitles['month'].apply(lambda x: month_converter(x))
meetupTitles.to_csv(r'output/events2.csv')
meetupJoin = pd.merge(meetupTitles,meetupDescriptions, on="meetupid", how='right')
#Pandas merge converts int to float
cols = ['day','month','year']
for col in cols:
   meetupJoin[col] = meetupJoin[col].apply(lambda x: int(x) if x == x else "")
meetupJoin.to_csv(r'output/meetups_full.csv', index = False, header=True)