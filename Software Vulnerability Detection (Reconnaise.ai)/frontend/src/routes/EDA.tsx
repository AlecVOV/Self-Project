import { useEffect, useState } from 'react'
import { Chart as ChartJS, Colors } from 'chart.js/auto';
import type { DatasetOverview, EDAOverview } from '../resources/types'
import PageMetadata from '../components/PageMetadata'
import TopAppBar from '../components/TopAppBar'
import rString from '../resources/string'
import { Pie } from 'react-chartjs-2';

export default function () {
	// Overview data
	let [overview, setOverview] = useState<EDAOverview | null>()
	let [datasets, setDatasets] = useState<DatasetOverview[]>([])

	// Fetch loading and error
	let [loading, setLoading] = useState(true)
	let [error, setError] = useState<Error | null>(null)

	ChartJS.register(Colors)

	useEffect(() => {
		Promise.all([
			fetch(`${rString.backend_url}/eda/overview`).then(response => response.json()),
			fetch(`${rString.backend_url}/eda/datasets`).then(response => response.json())
		])
			.then(([overviewData, datasetsData]) => {
				setOverview(overviewData)
				setDatasets(datasetsData)
			})
			.catch(error => {
				console.error('Error fetching data:', error)
				setError(error)
			})
			.finally(() => setLoading(false))
	}, [])

	if (error) return (<>
		<PageMetadata title={rString.page_title_eda_alt} />
		<TopAppBar title={rString.page_title_eda} />

		<div className='padding'>
			<p className='error'>{rString.msg_error_loading}{error.message}</p>
		</div>
	</>)

	return (<>
		<PageMetadata title={rString.page_title_eda_alt} />
		<TopAppBar title={rString.page_title_eda} />

		{loading && <p className='padding'>{rString.msg_loading}</p>}

		<div className='padding'>
			<article>
				<ul className='list border'>
					{datasets.map((dataset, index) => (
						<li key={dataset.name} className='padding'>
							<i>topic</i>
							<div className='large-text max'>{index + 1}. {dataset.name}</div>
							<a className='button' href={dataset.url}>{rString.button_view_source}</a>
						</li>
					))}
				</ul>
			</article>
		</div>

		<section className='padding'>
			<h2 className='small'>{rString.title_sample_distribution}</h2>

			<div className='grid'>
				<div className='s12 l6 grid'>
					<article className='s12'>
						<h2 className='small'>{overview?.total_samples}</h2>
						<p>{rString.label_samples_total}</p>
					</article>

					<article className='s12'>
						<h2 className='small'>{overview?.vulnerable_samples}</h2>
						<p>{rString.label_samples_vuln}</p>
					</article>

					<article className='s12'>
						<h2 className='small'>{overview?.safe_samples}</h2>
						<p>{rString.label_samples_safe}</p>
					</article>
				</div>

				<article className='s12 l6'>
					<Pie data={{
						labels: [rString.label_vulnerable, rString.label_safe],
						datasets: [{
							label: rString.unit_samples,
							data: [overview?.vulnerable_samples ?? 0, overview?.safe_samples ?? 0],
							borderWidth: 1
						}]
					}} />
				</article>
			</div>
		</section>
	</>)
}
