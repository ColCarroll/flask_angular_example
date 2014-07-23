import os
from sklearn import datasets
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, make_response, jsonify, request, Response

DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)


def get_model():
    iris = datasets.load_iris()
    return RandomForestClassifier(n_estimators=1000).fit(iris.data, iris.target), list(iris.target_names)


MODEL, LABELS = get_model()


@app.route('/')
def index():
    return make_response(open(os.path.join(DIR, 'index.html')).read())


@app.route('/api/predict')
def predict():
    a = request.args.get('sepal_length', 0)
    b = request.args.get('sepal_width', 0)
    c = request.args.get('petal_length', 0)
    d = request.args.get('petal_width', 0)
    try:
        probs = MODEL.predict_proba(map(float, [a, b, c, d]))[0]
    except ValueError:
        probs = (1. / len(LABELS) for _ in LABELS)
    val = {"data": [{"label": label, "prob": prob} for label, prob in zip(LABELS, probs)]}
    return jsonify(val)


if __name__ == '__main__':
    app.run()
