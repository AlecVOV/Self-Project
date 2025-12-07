import { useState } from 'react'
import type { ScanResult } from '../resources/types'
import rString from '../resources/string'
import PageMetadata from '../components/PageMetadata'
import TopAppBar from '../components/TopAppBar'

export default function () {
	// Scan result
	let [result, setResult] = useState<ScanResult | null>(null)

	// Fetch loading and error
	let [loading, setLoading] = useState(false)
	let [error, setError] = useState<Error | null>(null)

	async function handleScan(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setLoading(true)

		const formdata = new FormData(e.currentTarget)
		const code = formdata.get('code') as string
		const lang = formdata.get('lang') as string

		console.log('Code to scan:', code)
		console.log('Language selected:', lang)

		fetch(`${rString.backend_url}/scan/${lang}`, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain', },
			body: code,
		})
			.then(response => response.json())
			.then(data => setResult(data))
			.catch(error => {
				console.error('Error during scan:', error)
				setError(error)
			})
			.finally(() => setLoading(false))
	}

	return (<>
		<PageMetadata title={rString.page_title_input} />
		<TopAppBar title='' />
		<section className='custom-center' id='input-page'>
			<header className='text-center'>
				<div id='underlay' className='shape sunny extra'></div>
				<h1>{rString.app_name}</h1>
				<h2 className='small'>{rString.app_subtitle}</h2>
			</header>

			<div className='medium-space'></div>
			<div className='medium-space'></div>

			<Form onSubmit={handleScan} isLoading={loading} />

			<div className='large-space'></div>

			{result && <Result data={result} />}
			{error && <ScanError error={error} />}
		</section>
	</>)
}

/**
 * Display a form to input source code for scanning
 * @param props A boolean state for loading and a submit handler
 */
function Form({ isLoading, onSubmit }: { isLoading: boolean, onSubmit: React.FormEventHandler<HTMLFormElement> }) {
	return (
		<form id='scan-form' onSubmit={onSubmit}>
			<div className='field textarea label border extra' id='code-input'>
				<textarea autoFocus id='code' name='code'></textarea>
				<label htmlFor='code'>{rString.label_source_code}</label>
			</div>

			<div className='field label suffix border' id='lang-select'>
				<select id='lang' name='lang'>
					<option value='php'>{rString.lang_php}</option>
					<option value='py'>{rString.lang_python}</option>
					<option value='js'>{rString.lang_javascript}</option>
				</select>
				<label htmlFor='lang'>{rString.label_language}</label>
				<i>arrow_drop_down</i>
			</div>

			<button
				className='btn primary large'
				id='analyze-btn'
				disabled={isLoading}
			>{rString.button_detect}</button>
		</form>
	)
}

/**
 * Display the scan result of a source code snippet
 * @param props Scan result data
 */
function Result({ data }: { data: ScanResult }) {
	const {
		ml_based_findings: ml_results,
		// rule_based_findings: rule_results,
	} = data

	return (
		<article className='border' id='result'>
			<h2 className='small'>
				{rString.msg_result_1a}{(ml_results.confidence * 100).toFixed(2)}{rString.msg_result_1b}{' '}
				<strong>{ml_results.is_vulnerable ? rString.label_vulnerable : rString.label_safe}</strong>
			</h2>
			<p className='large-text'>
				{rString.msg_voting_2a}{ml_results.voting.total_models}{rString.msg_voting_2b}
				{ml_results.voting.vulnerable}{rString.msg_voting_2c}
				{ml_results.voting.safe}{rString.msg_voting_2d}
			</p>
		</article>
	)
}

function ScanError({ error }: { error: Error }) {
	return (<article className='border'>
		<h2 className='small error'>{rString.msg_error_scan}</h2>
		<p className='large-text'>{error.message}</p>
	</article>)
}
