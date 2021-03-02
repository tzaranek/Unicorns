# {
#     "0" :
#     {
#         "name" : "Baby Unicorn (Red)",
#         "class" : "Baby Unicorn",
#         "count" : 1
#     }
# }

import os

baseDeckPath = os.path.dirname(os.path.realpath(__file__)) + "/../assets/rules/BaseDeck.txt"

cnt = 0
with open("deck.json", 'w') as f:
    with open(baseDeckPath, 'r') as deck:
        f.write("{")
        for line in deck:
            strings = line.split('\t')
            f.write('"' + str(cnt) + '" : ')
            cnt += 1

            f.write('{')
            f.write('"name" : "' + strings[0] + '",')
            f.write('"class" : "' + strings[1] + '",')
            f.write('"count" : "' + strings[2].strip('\n') + '"')
            f.write('},')

    f.write("}")

