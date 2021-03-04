import re
import requests
import shutil
import os
from bs4 import BeautifulSoup

baseImagePath = os.path.dirname(os.path.realpath(__file__)) + "/images/"
site = "http://unstablegameswiki.com/index.php?title=Unstable_Unicorns_Base_Deck_(2nd_Edition)_-_Card_Previews"
response = requests.get(site)
soup = BeautifulSoup(response.text, 'html.parser')

cardContainer = soup.find_all('a')

def DownloadCardImage(url, cardName):
    image = requests.get(url, stream=True)
    if image.status_code == 200:
        with open(baseImagePath + cardName, 'wb') as f:
            image.raw.decode_content = True
            shutil.copyfileobj(image.raw, f)

# Download the thumbnail image, and the high res image using the format...
# assets/images/N_CARDNAME.png
# assets/images/N_CARDNAME_thumb.png
# Where N is the ID of the card (arbitrary, we'll just number them in the order they're downloaded)
# and CARDNAME is the name of the card -> cardContainer[8].attrs['title'] = 'UU - Baby Unicorn (Red)'
#
# The thumbnail image is the image in cardContainer. The real image is obtained by following the hyperlink, and going to the URL under the magnify class.
# cardUrl = 'http://unstablegameswiki.com' + cardContainer[8].attrs['href']
# response2 = requests.get(cardUrl)
# soup2 = BeautifulSoup(response2.text, 'html.parser')
#
# cardUrl2 = 'http://unstablegameswiki.com' + soup2.find_all("div", {"class": "magnify"})[0].contents[0].attrs['href']
# response2 = requests.get(cardUrl2)
# soup2 = BeautifulSoup(response2.text, 'html.parser')
# fullImageUrl = 'http://unstablegameswiki.com' + soup2.find_all("div", {"class": "fullImageLink"})[0].contents[0].attrs['href']

# We want cardContainer[8:91] inclusive for the base deck
for i in range(8, 92, 1):
    # Find the card name
    cardName = cardContainer[i].attrs['title']
    cardName = str(i-8) + "_" + cardName[5:]

    # Go to the card page
    cardUrl = 'http://unstablegameswiki.com' + cardContainer[i].attrs['href']
    response2 = requests.get(cardUrl)
    soup2 = BeautifulSoup(response2.text, 'html.parser')

    # Go to the magnified card page
    cardUrl2 = 'http://unstablegameswiki.com' + soup2.find_all("div", {"class": "magnify"})[0].contents[0].attrs['href']
    response2 = requests.get(cardUrl2)
    soup2 = BeautifulSoup(response2.text, 'html.parser')

    # Download the images
    fullImageUrl = 'http://unstablegameswiki.com' + soup2.find_all("div", {"class": "fullImageLink"})[0].contents[0].attrs['href']
    DownloadCardImage(fullImageUrl, cardName)

    thumbnailImageUrl = 'http://unstablegameswiki.com' + cardContainer[i].contents[0].attrs['src']
    DownloadCardImage(thumbnailImageUrl, cardName+"_thumb")
    
    
print("Test!")