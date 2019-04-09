from flask import Flask, send_from_directory, render_template, json

# TODO this is for test
class MyApp:
    def __init__(self, name=''):
        self._name = name

    def say_name(self):
        print('my name is {0}'.format(self._name))

    def get_name(self):
        return self._name

    def search_product(self, arg):
        # return ['{0}-{1}'.format(arg, i+1) for i in range(10)]
        dataList = []
        for i in range(10):
            dataList.append({'id': i+1, 'name': '{0}-{1}'.format(arg, i+1)})
        return dataList

myApp = MyApp("review_app")
runtime = Flask(__name__, static_folder='client-app/build/static', template_folder='client-app/build')

@runtime.route('/')
def index():
    return render_template('index.html')

@runtime.route('/api/searchProduct/<arg>')
def search_product(arg):
    return json.jsonify(myApp.search_product(arg))

if __name__ == '__main__':
    runtime.run(use_reloader=True, port=5000, threaded=True)