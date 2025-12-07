"""
Export additional visualization data from model comparison notebook.
Automated version of model_comparison.ipynb for Docker builds.
"""

import joblib
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for Docker
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import roc_curve, auc, precision_recall_curve, average_precision_score
from sklearn.model_selection import train_test_split

print("="*70)
print("GENERATING MODEL COMPARISON VISUALIZATIONS")
print("="*70)

# Load all models
print("\n📊 Loading models...")
models = {
    'Logistic Regression': joblib.load('models/model_logistic_regression.joblib'),
    'Random Forest': joblib.load('models/model_random_forest.joblib'),
    'Gradient Boosting': joblib.load('models/model_gradient_boosting.joblib'),
    'XGBoost': joblib.load('models/model_xgboost.joblib'),
    'LightGBM': joblib.load('models/model_lightgbm.joblib'),
    'Naive Bayes': joblib.load('models/model_naive_bayes.joblib')
}
vectorizer = joblib.load('models/vectorizer.joblib')
print(f"✓ Loaded {len(models)} models")

# Load comparison results
df_comparison = pd.read_csv('docs/model_comparison.csv')

# ========== MARK: ROC CURVES ==========
print("\n📈 Generating ROC curves...")

# Load test data
df = pd.read_csv('data/balanced_merged_dataset.csv')
X_train, X_test, y_train, y_test = train_test_split(
    df['code'], df['is_vulnerable'], test_size=0.2, random_state=42, stratify=df['is_vulnerable']
)
X_test_vec = vectorizer.transform(X_test)

plt.figure(figsize=(12, 10))
colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']
line_styles = ['-', '--', '-.', ':', '-', '--']

for idx, (model_name, model) in enumerate(models.items()):
    # Get probability predictions
    if hasattr(model, 'predict_proba'):
        y_pred_proba = model.predict_proba(X_test_vec)[:, 1]
    else:
        y_pred_proba = model.decision_function(X_test_vec)

    # Calculate ROC curve
    fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
    roc_auc = auc(fpr, tpr)

    # Plot
    plt.plot(fpr, tpr, color=colors[idx], linestyle=line_styles[idx],
             linewidth=2.5, label=f'{model_name} (AUC = {roc_auc:.4f})',
             marker='o', markevery=20, markersize=6)

# Plot diagonal (random classifier)
plt.plot([0, 1], [0, 1], 'k--', linewidth=2, alpha=0.4,
         label='Random Classifier (AUC = 0.5000)')

# Styling
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate', fontsize=13, fontweight='bold', labelpad=10)
plt.ylabel('True Positive Rate', fontsize=13, fontweight='bold', labelpad=10)
plt.title('ROC Curves - All Models Comparison\n(Higher curve = Better performance)',
          fontsize=16, fontweight='bold', pad=20)
plt.legend(loc='lower right', fontsize=11, framealpha=0.95, edgecolor='black')
plt.grid(True, alpha=0.3, linestyle='--', linewidth=0.8)
plt.tight_layout()
plt.savefig('docs/roc_curves.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ Saved docs/roc_curves.png")
plt.close()

# ========== MARK: PRECISION-RECALL CURVES ==========
print("\n📈 Generating precision-recall curves...")
plt.figure(figsize=(12, 10))

for idx, (model_name, model) in enumerate(models.items()):
    # Get probability predictions
    if hasattr(model, 'predict_proba'):
        y_pred_proba = model.predict_proba(X_test_vec)[:, 1]
    else:
        y_pred_proba = model.decision_function(X_test_vec)

    # Calculate Precision-Recall curve
    precision, recall, thresholds = precision_recall_curve(y_test, y_pred_proba)
    avg_precision = average_precision_score(y_test, y_pred_proba)

    # Plot
    plt.plot(recall, precision, color=colors[idx], linestyle=line_styles[idx],
             linewidth=2.5, label=f'{model_name} (AP = {avg_precision:.4f})',
             marker='s', markevery=20, markersize=6)

# Add baseline (random classifier for this dataset)
baseline = sum(y_test) / len(y_test)
plt.axhline(y=baseline, color='k', linestyle='--', linewidth=2, alpha=0.4,
            label=f'Baseline (Random) = {baseline:.4f}')

# Add F1-Score contours
f_scores = np.linspace(0.2, 0.9, num=8)
for f_score in f_scores:
    x = np.linspace(0.01, 1)
    y = f_score * x / (2 * x - f_score)
    y = y[y >= 0]
    plt.plot(x[:len(y)], y, color='gray', alpha=0.2, linestyle=':', linewidth=1)
    plt.annotate(f'F1={f_score:.1f}', xy=(0.9, y[min(45, len(y)-1)] + 0.02),
                 fontsize=8, alpha=0.4)

# Styling
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('Recall', fontsize=13, fontweight='bold', labelpad=10)
plt.ylabel('Precision', fontsize=13, fontweight='bold', labelpad=10)
plt.title('Precision-Recall Curves - All Models Comparison\n(Closer to top-right = Better)',
          fontsize=16, fontweight='bold', pad=20)
plt.legend(loc='lower left', fontsize=11, framealpha=0.95, edgecolor='black')
plt.grid(True, alpha=0.3, linestyle='--', linewidth=0.8)
plt.tight_layout()
plt.savefig('docs/precision_recall_curves.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ Saved docs/precision_recall_curves.png")
plt.close()

print("\n" + "="*70)
print("✅ ALL VISUALIZATIONS GENERATED SUCCESSFULLY")
print("="*70)
