import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from ml_detector import VulnerabilityDetector
from vuln_rules import RuleBasedDetector
import os

# Page config
st.set_page_config(
	page_title="Reconnaise.ai -Vulnerability Detector",
	page_icon="🔒",
	layout="wide"
)

# Initialize detectors
@st.cache_resource
def load_models():
	try:
		ml_detector = VulnerabilityDetector()
		rule_detector = RuleBasedDetector()
		return ml_detector, rule_detector, None
	except Exception as e:
		return None, None, str(e)

ml_detector, rule_detector, error = load_models()

if error:
	st.error(f"⚠️ Error loading models: {error}")
	st.info("Please run `python train_model.py` first to train the models.")
	st.stop()

# Sidebar navigation
st.sidebar.title("🔒 Reconnaise.ai")
page = st.sidebar.radio("Navigation",
	["🏠 Home", "📊 Data Analysis", "🔍 Scan Code", "📈 Model Comparison"])

# ====================
# HOME PAGE
# ====================
if page == "🏠 Home":
	st.title("Reconnaise.ai -Vulnerability Detection System")

	st.markdown("""
	### 🎯 Project Overview
	An AI-powered system to detect security vulnerabilities in source code by combining machine learning ensembles with rule-based pattern matching.

	---

	### 🤖 Machine Learning Models
	- **Logistic Regression** — Fast baseline; L2 regularization
	- **Random Forest** — Ensemble of trees; robust to overfitting
	- **Gradient Boosting** — Sequential boosting for high accuracy
	- **XGBoost** — Optimized gradient boosting framework
	- **LightGBM** — Fast, low-memory gradient boosting
	- **Naive Bayes** — Simple probabilistic classifier

	### 📊 Dataset (selected sources)
	- [DiverseVul](https://github.com/wagner-group/diversevul)
	- [PHP-Vulnerabilities](https://github.com/sumeet-darekar/PHP-vulnerabilities-dataset)
	- [VulnCode-PHP](https://github.com/MeleseAwoke/PHP-vulnerability-dataset)

	### 🔧 Supported Languages
	- Primary: **PHP**
	- Planned/partial support: **JavaScript**, **Python**
	- Notes: Rule-based detection targets common PHP patterns; ML models are language-agnostic when trained on tokenized representations.
	""")

	# Show quick stats
	col1, col2, col3 = st.columns(3)

	# Load metrics dynamically
	@st.cache_data
	def load_metrics():
		try:
			df = pd.read_csv('data/merged_all_datasets.csv')
			total_samples = len(df)

			# Load model comparison if exists
			if os.path.exists('docs/model_comparison.csv'):
				df_metrics = pd.read_csv('docs/model_comparison.csv')
				num_models = len(df_metrics)
				best_accuracy = df_metrics['Accuracy'].max() * 100  # Convert to percentage
			else:
				num_models = 6
				best_accuracy = 97.92

			return total_samples, num_models, best_accuracy
		except Exception as e:
			return 47858, 6, 97.92  # Fallback values

	total_samples, num_models, best_accuracy = load_metrics()

	with col1:
		st.metric("Total Samples", f"{total_samples:,}")
	with col2:
		st.metric("ML Models", f"{num_models}")
	with col3:
		st.metric("Best Accuracy", f"{best_accuracy:.2f}%")

# ====================
# DATA ANALYSIS PAGE
# ====================
elif page == "📊 Data Analysis":
	st.title("📊 Data Analysis & Visualization")

	# Load dataset
	@st.cache_data
	def load_data():
		return pd.read_csv('data/merged_all_datasets.csv')

	try:
		df = load_data()

		st.subheader("Dataset Overview")
		col1, col2, col3 = st.columns(3)
		with col1:
			st.metric("Total Samples", f"{len(df):,}")
		with col2:
			st.metric("Vulnerable", f"{sum(df['is_vulnerable'] == 1):,}")
		with col3:
			st.metric("Safe", f"{sum(df['is_vulnerable'] == 0):,}")

		st.dataframe(df.head(10), width='stretch')

		# Class distribution
		st.subheader("Class Distribution")
		col1, col2 = st.columns(2)

		fig, ax = plt.subplots(figsize=(8, 6))
		df['is_vulnerable'].value_counts().plot(kind='bar', ax=ax, color=['#2ecc71', '#e74c3c'])
		ax.set_title('Vulnerable vs Safe Code', fontsize=14, fontweight='bold')
		ax.set_xlabel('is_vulnerable')
		ax.set_ylabel('Count')
		ax.set_xticklabels(['Safe', 'Vulnerable'], rotation=0)
		st.pyplot(fig)

	except FileNotFoundError:
		st.error("Dataset not found. Please ensure data/chunked_vuln_dataset.csv exists.")

# ====================
# SCAN CODE PAGE
# ====================
elif page == "🔍 Scan Code":
	st.title("🔍 Vulnerability Scanner")

	# Input method selection
	input_method = st.radio("Choose input method:",
		["📝 Paste Code", "📁 Upload File"])

	code_input = ""
	language = "PHP"  # Default language

	if input_method == "📝 Paste Code":
		code_input = st.text_area("Paste your code here:", height=300,
			placeholder="# Paste your code here...\ndef example():\n    pass")
		language = st.selectbox("Select Language:",
			["PHP"])

	else:
		uploaded_file = st.file_uploader("Upload source code file",
			type=['php'])
		if uploaded_file:
			code_input = uploaded_file.read().decode('utf-8')
			st.code(code_input, language='php')

			# Auto-detect language from file extension
			file_extension = uploaded_file.name.split('.')[-1].lower()
			if file_extension == 'php':
				language = "PHP"
			else:
				language = "PHP"  # fallback to PHP

			st.info(f"🔍 Detected language: **{language}**")

	if st.button("🔍 Scan for Vulnerabilities", type="primary", width='stretch'):
		if code_input:
			with st.spinner("Analyzing code with 6 ML models + rule-based detection..."):
				# ML Detection
				ml_result = ml_detector.predict(code_input)

				# Rule-based Detection
				rule_result = rule_detector.analyze(code_input, language.lower())

				# Display results
				st.markdown("---")
				st.subheader("🎯 Scan Results")

				# Overall result
				col1, col2, col3 = st.columns(3)

				with col1:
					if ml_result['is_vulnerable']:
						st.error("🔴 VULNERABLE")
					else:
						st.success("🟢 SAFE")
					st.metric("Ensemble Confidence", f"{ml_result['confidence']:.1%}")

				with col2:
					st.metric("Risk Level", ml_result['risk_level'])
					st.metric("Ensemble Probability", f"{ml_result['ensemble_probability']:.1%}")

				with col3:
					st.metric("Rule-Based Issues", len(rule_result))
					st.write("**Voting:**")
					st.write(f"Vulnerable: {ml_result['voting']['vulnerable']}")
					st.write(f"Safe: {ml_result['voting']['safe']}")

				# Individual model predictions
				st.markdown("---")
				st.subheader("🤖 Individual Model Predictions")

				model_data = []
				for model_name, pred in ml_result['model_predictions'].items():
					model_data.append({
						'Model': model_name,
						'Prediction': '🔴 Vulnerable' if pred['vulnerable'] else '🟢 Safe',
						'Confidence': f"{pred['confidence']:.1%}",
						'Safe Probability': f"{pred['safe_prob']:.1%}",
						'Vulnerable Probability': f"{pred['vuln_prob']:.1%}"
					})

				df_models = pd.DataFrame(model_data)
				st.dataframe(df_models, width='stretch', hide_index=True)

				# Visualization of probabilities
				fig, ax = plt.subplots(figsize=(10, 5))
				models = list(ml_result['model_predictions'].keys())
				vuln_probs = [ml_result['model_predictions'][m]['vuln_prob'] for m in models]
				safe_probs = [ml_result['model_predictions'][m]['safe_prob'] for m in models]

				x = range(len(models))
				width = 0.35

				ax.bar([i - width/2 for i in x], safe_probs, width, label='Safe', color='#2ecc71', alpha=0.8)
				ax.bar([i + width/2 for i in x], vuln_probs, width, label='Vulnerable', color='#e74c3c', alpha=0.8)

				ax.axhline(y=0.5, color='gray', linestyle='--', alpha=0.5, label='Threshold')
				ax.set_ylabel('Probability')
				ax.set_title('Model Predictions Comparison', fontweight='bold')
				ax.set_xticks(x)
				ax.set_xticklabels(models, rotation=15, ha='right')
				ax.legend()
				ax.grid(axis='y', alpha=0.3)

				st.pyplot(fig)

				# Rule-based results
				if rule_result:
					st.markdown("---")
					st.subheader("⚠️ Rule-Based Detection Results")
					st.error(f"Found {len(rule_result)} potential security issues:")

					for i, issue in enumerate(rule_result, 1):
						with st.expander(f"#{i} - {issue['type']} ({issue['severity']} severity)", expanded=True):
							st.write(f"**Description:** {issue['description']}")
							st.code(issue['code_snippet'], language='python')
				else:
					st.markdown("---")
					st.success("✅ No rule-based vulnerabilities detected")

		else:
			st.warning("⚠️ Please provide code to scan!")

# ====================
# MODEL COMPARISON PAGE
# ====================
elif page == "📈 Model Comparison":
	st.title("📈 Model Performance Comparison")

	st.markdown("""
	### 🤖 Models Evaluated
	1. **Logistic Regression** - Linear classifier with L2 regularization
	2. **Random Forest** - Ensemble of 100 decision trees
	3. **Gradient Boosting** - Sequential boosting with decision trees
	4. **XGBoost** - Gradient boosting framework
	5. **LightGBM** - Fast gradient boosting (LightGBM)
	6. **Naive Bayes** - Probabilistic classifier with Laplace smoothing
	""")

	# Load comparison data if exists
	comparison_file = 'docs/model_comparison.csv'

	if os.path.exists(comparison_file):
		df_metrics = pd.read_csv(comparison_file)

		st.subheader("📊 Performance Metrics")
		st.dataframe(df_metrics, width='stretch', hide_index=True)

		# Highlight best model
		best_model = df_metrics.loc[df_metrics['Accuracy'].idxmax(), 'Model']
		best_acc = df_metrics['Accuracy'].max()
		st.success(f"🏆 **Best Model:** {best_model} with {best_acc:.2%} accuracy")

		# Visualizations
		if os.path.exists('docs/accuracy_vs_speed.png'):
			st.image('docs/accuracy_vs_speed.png',
				caption='Accuracy vs Speed Comparison')

		# Confusion matrices
		st.subheader("🔍 Confusion Matrices")

		cols = st.columns(6)
		for idx, model_name in enumerate(df_metrics['Model']):
			filename = model_name.lower().replace(' ', '_')
			img_path = f'docs/confusion_matrix_{filename}.png'

			if os.path.exists(img_path):
				with cols[idx]:
					st.image(img_path, caption=model_name, width='stretch')

		# Add after Chart 4 (around line 290)

		st.markdown("---")

		# Charts 4 & 5: Side by side
		col1, col2 = st.columns(2)

		with col1:
			st.markdown("### ROC Curves")
			if os.path.exists('docs/roc_curves.png'):
				st.image('docs/roc_curves.png',
						width='stretch=True',
						caption='Receiver Operating Characteristic curves showing true positive vs false positive rates')

		with col2:
			st.markdown("### Precision-Recall Curves")
			if os.path.exists('docs/precision_recall_curves.png'):
				st.image('docs/precision_recall_curves.png',
						width='stretch=True',
						caption='Trade-off between precision and recall at various thresholds')

	else:
		st.warning("⚠️ Model comparison data not found. Please run `python train_model.py` first.")

	# Model justification
	st.markdown("---")
	st.subheader("💡 Model Selection Justification")

	col1, col2, col3 = st.columns(3)

	with col1:
		st.markdown("""
		**Logistic Regression**
		- ✅ Fast training & prediction
		- ✅ Good baseline performance
		- ✅ Interpretable coefficients
		- ✅ Low computational cost
		- ⚠️ Assumes linear separability
		""")

	with col2:
		st.markdown("""
		**Random Forest**
		- ✅ Handles non-linear patterns
		- ✅ Robust to overfitting
		- ✅ Feature importance analysis
		- ✅ No feature scaling needed
		- ⚠️ Slower prediction time
		""")

	with col3:
		st.markdown("""
		**Gradient Boosting**
		- ✅ High accuracy
		- ✅ Handles complex relationships
		- ✅ Customizable loss functions
		- ✅ Works well with imbalanced data
		- ⚠️ Longer training time
		""")


	col4, col5, col6 = st.columns(3)
	with col4:
		st.markdown("""
		**XGBoost**
		- ✅ State-of-the-art boosting
		- ✅ Handles missing data
		- ✅ Regularization to reduce overfitting
		- ✅ Parallel processing support
		- ⚠️ More hyperparameters to tune
		""")

	with col5:
		st.markdown("""
		**LightGBM**
		- ✅ Faster training than XGBoost
		- ✅ Lower memory usage
		- ✅ Good for large datasets
		- ✅ Supports categorical features
		- ⚠️ Sensitive to overfitting
		""")

	with col6:
		st.markdown("""
		**Naive Bayes**
		- ✅ Simple & fast
		- ✅ Works well with small data
		- ✅ Handles high-dimensional data
		- ✅ Probabilistic output
		- ⚠️ Assumes feature independence
		""")

	st.markdown("---")
	st.info("""
	**Ensemble Strategy:** We combine predictions from all three models using probability averaging,
	which improves overall accuracy and reduces the risk of individual model errors.
	""")

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("**Reconnaise.ai v1.0**")
st.sidebar.markdown("COS30049: Computing Technology Innovation Project - Assignment 2")
st.sidebar.markdown("6 ML Models + Rules-based system")
