import joblib
from pipeline_utilities import *
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer

pca_sag = joblib.load('pca_model_sag.joblib')
pca_cor = joblib.load('pca_model_cor.joblib')
pca_ax = joblib.load('pca_model_ax.joblib')

model_sag = joblib.load('classifier_sag.joblib')
model_cor = joblib.load('classifier_cor.joblib')
model_ax = joblib.load('classifier_ax.joblib')

pipeline_sag = Pipeline([
    ('reshape', FunctionTransformer(image_processor, kw_args={'desired_height':256,'desired_width':256})),
    ('hog', FunctionTransformer(get_hog_features, validate=False)),
    ('pca', pca_sag),
    ('clf', model_sag),
])

pipeline_cor = Pipeline([
    ('reshape', FunctionTransformer(image_processor)),
    ('hog', FunctionTransformer(get_hog_features, validate=False)),
    ('pca', pca_cor),
    ('clf', model_cor),
])

pipeline_ax = Pipeline([
    ('reshape', FunctionTransformer(image_processor)),
    ('hog', FunctionTransformer(get_hog_features, validate=False)),
    ('pca', pca_ax),
    ('clf', model_ax),
])

model_view = joblib.load('viewpoint_classifier.joblib')
pipeline_view = Pipeline([
    ('reshape', FunctionTransformer(image_square)),
    ('clf', model_view),
])

joblib.dump(pipeline_sag, './pipelines/pipeline_sag.joblib')
joblib.dump(pipeline_cor, './pipelines/pipeline_cor.joblib')
joblib.dump(pipeline_ax, './pipelines/pipeline_ax.joblib')
joblib.dump(pipeline_view, './pipelines/pipeline_view.joblib')