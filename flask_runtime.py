from flask import Flask, send_from_directory, render_template

# TODO this is for test
class MyApp:
    def __init__(self, name=''):
        self._name = name

    def say_name(self):
        print('my name is {0}'.format(self._name))

    def get_name(self):
        return self._name

myApp = MyApp("review_app")
runtime = Flask(__name__, static_folder='client-app/build/static', template_folder='client-app/build')

@runtime.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    runtime.run(use_reloader=True, port=5000, threaded=True)