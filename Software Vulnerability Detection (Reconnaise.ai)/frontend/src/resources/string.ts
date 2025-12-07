const rString = {
	backend_url: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000",

	// MARK: Application metadata
	app_name: "Reconnaise.ai",
	app_subtitle: "AI-Powered Software Vulnerability Detection!",
	team_name: "G2 MotorOla",
	unit_code: "COS30049",
	unit_name: "Computing Technology Innovation Project",
	assignment_title: "Assignment 3",
	assignment_subtitle: "Full-Stack Web Development for AI Application in Cybersecurity Scenarios",

	// MARK: Navigation labels
	nav_label_eda: "EDA",
	nav_label_input: "Input",
	nav_label_model: "Model",
	nav_label_team: "Team",

	// MARK: Buttons
	button_detect: "Detect vulnerabilities",
	button_view_source: "View source",

	// MARK: Page titles
	page_title_input: "Try it out!",
	page_title_model: "Model Overview",
	page_title_team: "Meet the Team",
	page_title_eda: "Exploratory Data Analysis",
	page_title_eda_alt: "EDA",

	// MARK: Heading titles
	title_performance_comparison: "Performance comparison",
	title_confusion_matrices: "Confusion matrices",
	title_roc_pr_curves: "ROC and Precision-Recall Curves",
	title_feature_importance: "Feature Importance",
	title_sample_distribution: "Sample distribution",

	// MARK: Labels
	label_feature_importance: "Feature Importance",
	label_samples_total: "Samples in total",
	label_samples_vuln: "Vulnerable samples",
	label_samples_safe: "Safe samples",
	label_source_code: "Source code",
	label_language: "Programming Language",
	label_sort: "Sort by",
	label_vulnerable: "vulnerable",
	label_safe: "safe",

	// MARK: Messages
	msg_error_loading: "Loading error: ",
	msg_error_scan: "Error during scan",
	msg_loading: "Loading...",

	// MARK: Sorting
	sort_by_prefix: "Sort by ",
	sort_asc: "ascending",
	sort_desc: "descending",

	// MARK: Alt texts
	alt_logo: "Reconnaise.ai logo",
	alt_confusion_matrix: "Confusion matrix for ",

	// MARK: Units
	unit_seconds: " seconds",
	unit_samples: "Samples",

	// MARK: Chart titles
	chart_title_accuracy: "Model Accuracy Comparison",
	chart_title_precision_recall: "Precision vs Recall trade-off",
	chart_title_f1: "Model F1 Score Comparison",
	chart_title_training_time: "Model Training Time Comparison",
	chart_title_feature_importance: "Feature Importance for ",

	// MARK: Metrics
	metric_accuracy: "Accuracy",
	metric_precision: "Precision",
	metric_recall: "Recall",
	metric_f1_score: "F1 Score",
	metric_training_time: "Training Time",

	// MARK: Enum - Programming languages
	lang_php: "PHP",
	lang_python: "Python",
	lang_javascript: "JavaScript",

	// MARK: Input page
	msg_result_1a: "I am ",
	msg_result_1b: "% confident that this code is ",
	msg_voting_2a: "Out of ",
	msg_voting_2b: " AI models used, ",
	msg_voting_2c: " find this code vulnerable, ",
	msg_voting_2d: " find this code safe",
}

export default rString
