/**
 * Represents a menu item in the navigation bar or elsewhere.
 */
export interface MenuItem {
	href: string;
	icon: string;
	label: string;
	weight?: number;
}

/**
 * Props for navigation components (rail/bar).
 */
export interface NavigationProps {
	routes: MenuItem[];
}

/**
 * Props for the application top bar.
 */
export interface AppBarProps {
	title: string;
}

/**
 * Props for page metadata component.
 */
export interface PageMetadataProps {
	title: string;
	description?: string;
}

/**
 * Represents the result of a software vulnerability detection.
 */
export interface ScanResult {
	ml_based_findings: {
		is_vulnerable: boolean,
		confidence: number,
		ensemble_probability: number,
		weighted_probability: number,
		voting: {
			vulnerable: number,
			safe: number,
			total_models: number,
			decision: string,
		},
		model_predictions: {
			[key: string]: {
				vulnerable: boolean,
				confidence: number,
				safe_prob: number,
				vuln_prob: number,
			}
		},
		risk_level: string,
	},
	rule_based_findings: Array<object>,
}

/**
 * Represents a team member's information.
 */
export interface Member {
	name: string
	studentID: string
	persona: string[]
}

export interface DatasetOverview {
	name: string,
	url: string,
}

export interface EDAOverview {
	total_samples: number,
	vulnerable_samples: number,
	safe_samples: number,
}

/**
 * Represents a model's description details.
 */
export interface ModelDescription {
	name: string,
	desc: string,
	confusion_matrix: string,
}

/**
 * Represents the performance metrics of a model.
 */
export interface ModelMetrics {
	model: string,
	accuracy: number,
	precision: number,
	recall: number,
	f1_score: number,
	training_time: number,
}

export interface ModelFI {
	model: string;
	feature_importances: {
		[feature: string]: number;
	};
}

/**
 * Represents sorting metrics for models.
 */
export type SortMetric = 'accuracy' | 'precision' | 'recall' | 'f1_score' | 'training_time';
