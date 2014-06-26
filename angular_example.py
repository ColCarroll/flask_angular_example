import os
from sklearn import datasets
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, make_response, jsonify

DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)


def get_model():
    iris = datasets.load_iris()
    return RandomForestClassifier().fit(iris.data, iris.target), list(iris.target_names)


MODEL, LABELS = get_model()


@app.route('/')
def index():
    return make_response(open(os.path.join(DIR, 'templates/index.html')).read())


@app.route('/_model/<float:a>/<float:b>/<float:c>/<float:d>')
def echo(a, b, c, d):
    probs = MODEL.predict_proba([a, b, c, d])[0]
    val = {LABELS[j]: probs[j] for j in range(len(probs))}
    return jsonify(val)


if __name__ == '__main__':
    app.run(debug=True)
