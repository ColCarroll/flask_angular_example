import os
from sklearn import datasets
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, make_response, jsonify, request

DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)


def get_model():
    iris = datasets.load_iris()
    return RandomForestClassifier(n_estimators=100).fit(iris.data, iris.target), list(iris.target_names)


MODEL, LABELS = get_model()


@app.route('/')
def index():
    return make_response(open(os.path.join(DIR, 'templates/index.html')).read())

# _model/<float:a>/<float:b>/<float:c>/<float:d>
@app.route('/api/predict')
def echo():
    a = request.args.get('sepal_length')
    b = request.args.get('sepal_width')
    c = request.args.get('petal_length')
    d = request.args.get('petal_width')
    probs = MODEL.predict_proba(map(float, [a, b, c, d]))[0]
    val = {LABELS[j]: probs[j] for j in range(len(probs))}
    return jsonify(val)


if __name__ == '__main__':
    app.run(debug=True)
