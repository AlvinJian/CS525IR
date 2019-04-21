from flask import Flask, send_from_directory, render_template, json
from flask import current_app, g
from flask import request
import pandas as pd
from indexer import Index, default_reviews
import pickle
from sklearn.model_selection import cross_val_score
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer

class MyApp:
    def __init__(self, name=''):
        self._name = name
        print('the app is initialized')
        # self.say_name()
        self.index = Index()
        self.df_amazon = pd.read_csv('Datafiniti_Amazon_Consumer_Reviews_of_Amazon_Products.csv', \
            error_bad_lines=False,encoding='utf-8-sig')
        num_files = self.index.index_product(self.df_amazon)
        print("indexed %d files" % num_files)
        self.index.index_review(self.df_amazon)

        # init predict
        filename1 = "xgboost.pkl"
        filename2 = "randomForest.pkl"
        filename3 = "word_vectorize.pkl"
        filename4 = "char_vectorize.pkl"
        with open(filename1, "rb") as f1:
            self.xgboostModel = pickle.load(f1)
        with open(filename3, "rb") as f2:
            self.word_vectorizer = pickle.load(f2)
        with open(filename4, "rb") as f3:
            self.char_vectorizer = pickle.load(f3)

    def say_name(self):
        print('my name is {0}'.format(self._name))

    def get_name(self):
        return self._name

    def search_product(self, query):
        # dataList = []
        # for i in range(10):
        #     dataList.append({'id': i+1, 'name': '{0}-{1}'.format(arg, i+1)})
        return self.index.search_product(query)

    def get_product_info(self, id):
        info = dict()
        # reviews = [{'id': i, 'text': '{0} is good. [{1}]'.format(id, i)}  for i in range(5)]
        labels = self.index.top_frequency_words(id)
        # info['topReviews'] = reviews
        info['labels'] = labels
        review_txt = default_reviews(id, self.df_amazon)
        info['topReviews'] = [{'text': txt} for txt in review_txt]
        # print(info['topReviews'])
        return info

    def search_review(self, id, term):
        # dummy = '{0} of {1} is good'.format(term, id)
        # reviews = []
        # for i in range(10):
        #     reviews.append({'id': i, 'text': '{0}-[{1}]'.format(dummy, i)})
        review_text = self.index.search_review(id, term)
        print('# of reviews={0}'.format(len(review_text)))
        reviews = [{'text': txt} for txt in review_text]
        return reviews

    def predict_score(self, id, text):
        test1 = text
        test1 = [test1]
        test1_word = self.word_vectorizer.transform(test1)
        test1_char = self.char_vectorizer.transform(test1)
        test1_features = hstack([test1_char, test1_word])
        test1_features = test1_features.tocsr()
        result = self.xgboostModel.predict(test1_features)
        return {'score': float(result)}

runtime = Flask(__name__, static_folder='client-app/build/static', template_folder='client-app/build')

def get_app_instance():
    if "app" not in current_app.extensions.keys():
        current_app.extensions["app"] = MyApp("review_app")
    return current_app.extensions["app"]

@runtime.route('/')
def index():
    get_app_instance()
    return render_template('index.html')

@runtime.route('/api/searchProduct/<arg>')
def search_product(arg):
    myApp = get_app_instance()
    return json.jsonify(myApp.search_product(arg))

@runtime.route('/api/getProductInfo/<product_id>')
def get_product_info(product_id):
    myApp = get_app_instance()
    return json.jsonify(myApp.get_product_info(product_id))

@runtime.route('/api/searchReview/<id>/<term>')
def search_review(id, term):
    myApp = get_app_instance()
    return json.jsonify(myApp.search_review(id, term))

@runtime.route('/api/predictScore/<id>', methods=['POST'])
def predict_score(id):
    s = request.data.decode("utf-8")
    text = json.loads(s)['text']
    myApp = get_app_instance()
    return json.jsonify(myApp.predict_score(id, text))