from flask import Flask, send_from_directory, render_template, json
from flask import current_app, g

# TODO this is for test
class MyApp:
    def __init__(self, name=''):
        self._name = name
        print('the app is initialized')
        self.say_name()

    def say_name(self):
        print('my name is {0}'.format(self._name))

    def get_name(self):
        return self._name

    def search_product(self, arg):
        dataList = []
        for i in range(10):
            dataList.append({'id': i+1, 'name': '{0}-{1}'.format(arg, i+1)})
        return dataList

    def get_product_info(self, id):
        info = dict()
        reviews = [{'id': i, 'text': '{0} is good. [{1}]'.format(id, i)}  for i in range(5)]
        labels = ['foo' for _ in range(10)]
        info['topReviews'] = reviews
        info['labels'] = labels
        return info

    def searchReview(self, id, term):
        dummy = '{0} of {1} is good'.format(term, id)
        reviews = []
        for i in range(10):
            reviews.append({'id': i, 'text': '{0}-[{1}]'.format(dummy, i)})
        return reviews

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
    return json.jsonify(myApp.searchReview(id, term))