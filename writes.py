import csv
import sys
import ast
import json

input = ast.literal_eval(sys.argv[1])
fixed = json.reads(input)
with open('save.csv', 'w') as file:
    writer = csv.writer(file)
    for row in fixed:
        writer.writerow(row)

sys.stdout.flush()