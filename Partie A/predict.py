from sklearn import datasets
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import json, sys

iris = datasets.load_iris()
log_reg = LogisticRegression(max_iter=1000)
scaler = StandardScaler()
scaler.fit(iris.data)
X_train_scaled = scaler.transform(iris.data)
log_reg.fit(X_train_scaled, iris.target)

sepal_length, sepal_width, petal_length, petal_width = map(float, sys.argv[1:])
scaled_input = scaler.transform([[sepal_length, sepal_width, petal_length, petal_width]])

class_probabilities = log_reg.predict_proba(scaled_input)[0]

class_probabilities_dict = {class_name: probability for class_name, probability in zip(iris.target_names, class_probabilities)}

print(json.dumps({'class_probabilities': class_probabilities_dict}))
