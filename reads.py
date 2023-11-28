import csv
import json

with open('save.csv', 'r') as file:
    reader = csv.reader(file)
    data = {"rows":len(reader),"cols":len(reader[0]),"table":reader}
    print(json.dumps(data))