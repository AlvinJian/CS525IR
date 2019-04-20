
import glob
import re
import numpy as np
from itertools import product
import pandas as pd
import collections
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords 

class Index(object):
    def __init__(self):
        self._inverted_index_product = {}
        # _documents contains file names of documents
        self._documents_product = []
        self._positional_index = collections.defaultdict(dict)
        self.stop_words = set(stopwords.words('english')) 

    def index_product(self, df_amazon):
        num_files_indexed = 0
        index = Index()

        df_name = df_amazon[['id', 'name']]
        df_name  = df_name.drop_duplicates(keep='first')
        num_files_indexed = len(df_name[['id']])
        self._inverted_index_product = collections.defaultdict(set)
        for i, row in df_name.iterrows():
            content = row['name']
            ids = row['id']
            index_token = index.tokenize(content)
            for term in index_token:
                if term not in self._inverted_index_product:
                    self._inverted_index_product[term] = [ids]
                else:
                    if ids not in self._inverted_index_product[term]:
                        self._inverted_index_product[term].append(ids)
                        self._inverted_index_product[term].sort()

        return num_files_indexed

    # tokenize( text )
    # purpose: convert a string of terms into a list of tokens.
    # convert the string of terms in text to lower case and replace each character in text,
    # which is not an English alphabet (a-z) and a numerical digit (0-9), with whitespace.
    # preconditions: none
    # returns: list of tokens contained within the text
    # parameters:
    #   text - a string of terms
    def tokenize(self, text):
        tokens = []
        lower_text = text.lower()
        regex = r'\b\w+\b'
        tokens = re.findall(regex, lower_text)
        return tokens

    def index_review(self, df_amazon,productID):
        ids = set(df_amazon['id'])
        for productID in ids:
            tempdf = df_amazon.loc[df_amazon['id'] == productID]
            df_review = tempdf[['reviews.rating', 'reviews.text']]
            doc_list = df_review.ix[:, 'reviews.text'].tolist()
            for doc_id,doc in enumerate(doc_list):
                tokens = self.tokenize(doc)
                filtered_reviews = [w for w in tokens if not w in self.stop_words]
                for word_pos,word in enumerate(filtered_reviews):
                    # if(productID not in self._positional_index.keys()):
                    #     self._positional_index[productID] = dict()
                    self._positional_index.setdefault(productID,dict()).setdefault(word,dict()).setdefault(doc_id,set()).add(word_pos)



        return self._positional_index

    # simple boolean and
    def search_product(self, text):
        query_terms = self.tokenize(text)

        result = {}
        for query in query_terms:
            if query not in self._inverted_index_product:
                return []
            else:
                if(len(result)==0):
                    result = set(self._inverted_index_product[query])
                else:
                    result &= set(self._inverted_index_product[query])

        # print(result)
        # print(self._documents_product)
        return result

    def search_review(self,id,query_text):
        query_terms = self.tokenize(query_text)
        matched_index = self._positional_index[id]

        match = dict()
        print("matched index", matched_index)

        for query in query_terms:
            if query not in matched_index.keys():
                match[query] = []
            else:
                match[query] = matched_index[query]
        print(match)
        return pd.Series(get_enough_result(match,query_terms,[])).drop_duplicates(keep='first').values

def get_enough_result(match,query_terms,result, num=10):

    doc_id = match[next(iter(match))].keys()
    print(doc_id)
    for key in match:
        doc_id &=  match[key].keys()
    print("doc id",doc_id)
    position = dict()
    if(len(doc_id)>0):
        for id in doc_id:
            for key in query_terms:
                position.setdefault(id,[]).append(list(match[key][id]))
    print("positions",position)

    for id in position:

        position[id] =[ x for x in product(*position[id])]
    print("positions",position)
    for id in position:
        for permutation in position[id]:
            if(increasing(permutation)):
                result.append(id)
    if(len(result)<num and len(query_terms)>1):

        key_one = tuple(query_terms[1:])
        key_two = tuple(query_terms[:-1])
        first = {k:match[k] for k in key_one if k in match}
        second = {k: match[k] for k in key_two if k in match}
        return result+get_enough_result(first,query_terms[1:],result,num)+get_enough_result(second,query_terms[:-1],result,num)
    else:
        return result

def increasing(permutation):
    for i in range(len(permutation)-1):
        if(permutation[i]+1 == permutation[i+1]):
            continue;
        else:
            return False

    return True









    



def main(args):
    index = Index()
    print("Indexing.........")
    df_amazon = pd.read_csv('Datafiniti_Amazon_Consumer_Reviews_of_Amazon_Products.csv', error_bad_lines=False,encoding='utf-8-sig')
    num_files = index.index_product(df_amazon)
    print("indexed %d files" % num_files)
    #use the search method here will return the product id
    #this method will index the review base on the product id you provided. 
    result = index.index_review(df_amazon,'AVqVGZNvQMlgsOJE6eUY')
    # print(result)
    #search for product
    query = 'fire'
    product_result = index.search_product(query)

    query_review = 'good product'
    print(list(product_result)[0])
    test_product_id = 'AVqVGWLKnnc1JgDc3jF1'
    review_result = index.search_review('AVqVGWLKnnc1JgDc3jF1',query_review)
    print("review result",review_result)

if __name__ == "__main__":
    import sys
    main(sys.argv)