
# coding: utf-8

import requests
import numpy as np
import mglearn
import sys
from sklearn.feature_extraction.text import CountVectorizer
import os
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

subscription_key = "0e8a7b1d9f114e67b56a2c46b7aae4ed"
assert subscription_key

experts_path = sys.argv[1]
experts = {}
for root, dirs, files in os.walk(experts_path):
    i = 0
    documents = {'documents' : []}
    for file in files:
        file_dir = root + file
        f = open(file_dir,'r')
        document = {}
        i = i + 1
        experts[str(i)] = file[:-4]
        document['id'] = str(i)
        document['language'] = 'en'
        document['text'] = f.read()
        documents['documents'].append(document)
f.close()


input_path = sys.argv[2]
f = open(input_path, 'r')
document = {}
document['id'] = '0'
document['language'] = 'en'
document['text'] = f.read()
documents['documents'].insert(0, document)
f.close()

text_analytics_base_url = "https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/"
key_phrase_api_url = text_analytics_base_url + "keyPhrases"
headers = {'Ocp-Apim-Subscription-Key': subscription_key}
response = requests.post(key_phrase_api_url, headers=headers, json=documents)
key_phrases = response.json()

text_train = []
for document in key_phrases['documents']:
    key_phrase = ", ".join(document["keyPhrases"])
    text_train.append(key_phrase)

vectorizer=CountVectorizer()
tfidf_vectorizer = TfidfVectorizer(max_df=0.65, min_df=2, stop_words='english')
transformer=TfidfTransformer()
tfidf=transformer.fit_transform(tfidf_vectorizer.fit_transform(text_train))
SimMatrix = (tfidf * tfidf.T).A

# experts={'1':'Banker', '2':'Banker','3':'Banker','4':'Banker','5':'Banker','6':'Medical','7':'Medical','8':'Medical','9':'Medical','10':'Medical',
         # '11':'Civil Engineer','12':'Civil Engineer','13':'Civil Engineer','14':'Civil Engineer','15':'Test Engineer','16':'Test Engineer','17':'Test Engineer','18':'Test Engineer'}


output = SimMatrix.tolist()[0]
print(experts[str(output.index(sorted(output)[-2]))])

