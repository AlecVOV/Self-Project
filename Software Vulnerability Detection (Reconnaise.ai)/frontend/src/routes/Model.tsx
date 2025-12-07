import { useEffect, useState, useMemo } from 'react'
import { Bar, Bubble } from 'react-chartjs-2'
import { Chart as ChartJS, Colors } from 'chart.js'
import type { ModelDescription, ModelFI, ModelMetrics, SortMetric } from '../resources/types'
import rString from '../resources/string'
import PageMetadata from '../components/PageMetadata'
import TopAppBar from '../components/TopAppBar'

export default function () {
	// Model data
	let [models, setModels] = useState<ModelDescription[]>([])
	let [comparison, setComparison] = useState<ModelMetrics[]>([])
	let [FIComparison, setFIComparison] = useState<ModelFI[]>([])

	// Model sorting
	let [sortBy, setSortBy] = useState<SortMetric>('accuracy')
	let [isSortAscending, setIsSortAscending] = useState(true)

	// Fetch loading and error
	let [loading, setLoading] = useState(true)
	let [error, setError] = useState<Error | null>(null)

	// Colours
	ChartJS.register(Colors);

	useEffect(() => {
		Promise.all([
			fetch(`${rString.backend_url}/models/descriptions`).then(response => response.json()),
			fetch(`${rString.backend_url}/models/comparison`).then(response => response.json()),
			fetch(`${rString.backend_url}/models/feature-importances`).then(response => response.json())
		])
			.then(([modelsData, comparisonData, featureImportanceData]) => {
				setModels(modelsData)
				setComparison(comparisonData)
				setFIComparison(featureImportanceData)
			})
			.catch(error => {
				console.error('Error fetching data:', error)
				setError(error)
			})
			.finally(() => setLoading(false))
	}, [])

	const sortedComparison = useMemo(() => {
		return sortModelsByMetrics([...comparison], sortBy, isSortAscending)
	}, [comparison, sortBy, isSortAscending])

	if (error) return (<>
		<PageMetadata title={rString.page_title_model} />
		<TopAppBar title={rString.page_title_model} />

		<div className='padding'>
			<p className='error'>{rString.msg_error_loading}{error.message}</p>
		</div>
	</>)

	return (<>
		<PageMetadata title={rString.page_title_model} />
		<TopAppBar title={rString.page_title_model} />

		{loading && <p>{rString.msg_loading}</p>}

		<div className='grid padding'>
			{models && models.map((model, index: number) => (
				<ModelDescriptionCard model={model} key={index} />
			))}
		</div>

		<section className='padding'>
			<h3 className='small'>{rString.title_performance_comparison}</h3>

			<SortToolbar sortBy={sortBy} setSortBy={setSortBy} isAscending={isSortAscending} setIsAscending={setIsSortAscending} />

			<p>{rString.sort_by_prefix}{sortBy}, {isSortAscending ? rString.sort_asc : rString.sort_desc}</p>

			<div className='grid'>
				{sortedComparison && sortedComparison.map((metrics, index: number) => (
					<ModelMetricsCard metrics={metrics} key={index} />
				))}
			</div>
		</section>

		<section className='padding grid'>
			<article className='s12 l6 white'>
				<Bar data={{
					labels: sortedComparison.map(m => m.model),
					datasets: [{
						label: rString.metric_accuracy,
						data: sortedComparison.map(m => m.accuracy),
					}]
				}} options={{
					aspectRatio: 1.5,
					plugins: {
						title: { display: true, text: rString.chart_title_accuracy }
					},
					scales: {
						y: {
							min: Math.min(...sortedComparison.map(m => m.accuracy)) - 0.01,
							max: Math.max(...sortedComparison.map(m => m.accuracy)) + 0.01,
						}
					}
				}} />
			</article>
			<article className='s12 l6 white'>
				<Bubble data={{
					datasets: sortedComparison.map(m => ({
						label: m.model,
						data: [{ x: m.precision, y: m.recall, r: 10 }],
					}))
				}} options={{
					aspectRatio: 1.5,
					plugins: {
						title: { display: true, text: rString.chart_title_precision_recall }
					},
					scales: {
						x: {
							title: { display: true, text: rString.metric_precision },
							min: Math.min(...sortedComparison.map(m => m.precision)) - 0.01,
							max: Math.max(...sortedComparison.map(m => m.precision)) + 0.01
						},
						y: {
							title: { display: true, text: rString.metric_recall },
							min: Math.min(...sortedComparison.map(m => m.recall)) - 0.01,
							max: Math.max(...sortedComparison.map(m => m.recall)) + 0.01
						}
					}
				}} />
			</article>
			<article className='s12 l6 white'>
				<Bar data={{
					labels: sortedComparison.map(m => m.model),
					datasets: [{
						label: rString.metric_f1_score,
						data: sortedComparison.map(m => m.f1_score),
					}]
				}} options={{
					aspectRatio: 1.5,
					plugins: {
						title: { display: true, text: rString.chart_title_f1 }
					},
					scales: {
						y: {
							min: Math.min(...sortedComparison.map(m => m.f1_score)) - 0.01,
							max: Math.max(...sortedComparison.map(m => m.f1_score)) + 0.01,
						}
					}
				}} />
			</article>
			<article className='s12 l6 white'>
				<Bar data={{
					labels: sortedComparison.map(m => m.model),
					datasets: [{
						label: rString.metric_training_time,
						data: sortedComparison.map(m => m.training_time),
					}]
				}} options={{
					aspectRatio: 1.5,
					plugins: {
						title: { display: true, text: rString.chart_title_training_time }
					},
					scales: { y: { type: 'logarithmic' } }
				}} />
			</article>
		</section>

		<section className='padding'>
			<h3 className='small'>{rString.title_confusion_matrices}</h3>
			<div className='grid'>
				{models && models.map((model, index: number) => (
					<ConfusionMatrixCard model={model} key={index} />
				))}
			</div>
		</section>

		<section className='padding'>
			<h3 className='small'>{rString.title_roc_pr_curves}</h3>
			<div className='grid'>
				<article className='no-padding s12 m6'>
					<img
						className='responsive'
						src={`${rString.backend_url}/docs/roc_curves.png`}
						alt='' />
				</article>
				<article className='no-padding s12 m6'>
					<img
						className='responsive'
						src={`${rString.backend_url}/docs/precision_recall_curves.png`}
						alt='' />
				</article>
			</div>
		</section>

		<section className='padding'>
			<h3 className='small'>{rString.title_feature_importance}</h3>
			{FIComparison && FIComparison.map((fi, index: number) => (
				<article className='s12 l6 white' key={index}>
					<Bar data={{
						labels: Object.keys(fi.feature_importances),
						datasets: [{
							label: rString.label_feature_importance,
							data: Object.values(fi.feature_importances),
						}]
					}} options={{
						aspectRatio: 1.5,
						plugins: {
							title: { display: true, text: `${rString.chart_title_feature_importance} - ${fi.model}` }
						},
						scales: { y: { min: 0, type: 'logarithmic' } }
					}} />
				</article>
			))}
		</section>
	</>)
}

/**
 * Display a model's description as a card
 */
function ModelDescriptionCard({ model }: { model: ModelDescription }) {
	return <article className='s12 m6'>
		<h3 className='small'>
			<i>automation</i>
			{' '}{model.name}
		</h3>
		<p>{model.desc}</p>
	</article>
}

/**
 * Display a toolbar to sort models by their metrics
 */
function SortToolbar(
	{ sortBy, setSortBy, isAscending, setIsAscending }: {
		sortBy: SortMetric,
		setSortBy: (n: SortMetric) => void,
		isAscending: boolean,
		setIsAscending: (b: boolean) => void
	}
) {
	return (<section className='grid'>
		<div className='s12 m6 l4 field label suffix border'>
			<select name='metric_to_sort' id='metric_to_sort'
				value={sortBy}
				onChange={e => setSortBy(e.target.value as SortMetric)}>
				<option value='accuracy'>{rString.metric_accuracy}</option>
				<option value='precision'>{rString.metric_precision}</option>
				<option value='recall'>{rString.metric_recall}</option>
				<option value='f1_score'>{rString.metric_f1_score}</option>
				<option value='training_time'>{rString.metric_training_time}</option>
			</select>
			<label htmlFor=''>{rString.label_sort}</label>
			<i>arrow_drop_down</i>
		</div>{' '}

		<nav className='s12 m6 l4'>
			<label className='switch icon'>
				<input type='checkbox' defaultChecked={isAscending} onChange={(e) => setIsAscending(e.target.checked)} />
				<span>
					<i>arrow_downward</i>
					<i>arrow_upward</i>
				</span>
			</label>

			<p>{isAscending ? rString.sort_asc : rString.sort_desc}</p>
		</nav>
	</section>)
}

/**
 * Display a model's metrics as a card
 */
function ModelMetricsCard({ metrics }: { metrics: ModelMetrics }) {
	return <article className='s12 m6 l4'>
		<h4 className='small'>{metrics.model}</h4>
		<ul>
			<li>{rString.metric_accuracy}: {(metrics.accuracy * 100).toFixed(3)}%</li>
			<li>{rString.metric_precision}: {(metrics.precision * 100).toFixed(3)}%</li>
			<li>{rString.metric_recall}: {(metrics.recall * 100).toFixed(3)}%</li>
			<li>{rString.metric_f1_score}: {(metrics.f1_score * 100).toFixed(3)}%</li>
			<li>{rString.metric_training_time}: {metrics.training_time.toFixed(3)}{rString.unit_seconds}</li>
		</ul>
	</article>
}

/**
 * Display a model's confusion matrix in a card
 */
function ConfusionMatrixCard({ model }: { model: ModelDescription }) {
	return <article className='s12 m6 l4 no-padding'>
		<div className='padding'>
			<h4 className='small'>{model.name}</h4>
		</div>
		<img
			src={`${rString.backend_url}/${model.confusion_matrix}`}
			alt={`${rString.alt_confusion_matrix}${model.name}`}
			style={{ maxWidth: '100%', height: 'auto' }} />
	</article>
}

/**
 * Sort a list of models by a given metric
 * @param data Array of model metrics
 * @param metric The metric to sort
 * @param ascending Ascending (true) or Descending (false)
 * @returns Sorted array
 */
function sortModelsByMetrics(data: ModelMetrics[], metric: SortMetric, ascending: boolean) {
	return data.sort((a, b) => ascending ? a[metric] - b[metric] : b[metric] - a[metric])
}
