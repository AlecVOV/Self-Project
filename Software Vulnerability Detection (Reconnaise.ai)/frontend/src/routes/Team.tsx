import { useEffect, useState } from 'react'
import rString from '../resources/string'
import type { Member } from '../resources/types'
import PageMetadata from '../components/PageMetadata'
import TopAppBar from '../components/TopAppBar'

export default function () {
	// Team member data
	let [members, setMembers] = useState<Member[]>([])

	// Fetch loading and error
	let [loading, setLoading] = useState(true)
	let [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		fetch(`${rString.backend_url}/team/members`)
			.then(res => res.json())
			.then(data => setMembers(data))
			.catch(error => {
				console.error('Error fetching team members:', error)
				setError(error)
			})
			.finally(() => setLoading(false))
	}, [])

	if (error) return (<>
		<PageMetadata title={rString.page_title_team} />
		<TopAppBar title={rString.page_title_team} />

		<div className='padding'>
			<p className='error'>{rString.msg_error_loading}{error.message}</p>
		</div>
	</>)

	return (<>
		<PageMetadata title={rString.page_title_team} />
		<TopAppBar title={rString.page_title_team} />

		{loading && <p className='padding'>{rString.msg_loading}</p>}

		<section className='padding grid'>
			{members.map(member => (
				<MemberCard member={member} key={member.studentID} />
			))}
		</section>
	</>)
}

/**
 * Display a team member's information as a card
 */
function MemberCard({ member }: { member: Member }) {
	return (<article className='no-padding s12 l6' key={member.studentID}>
		<div className='grid no-space'>
			<div className='s12 m4 l3'>
				<img className='responsive' src={getMemberPFP(member.studentID)} />
			</div>
			<div className='s12 m8 l9 padding'>
				<h5>{member.name}</h5>
				<p>{member.studentID}@student.swin.edu.au</p>
				<ul>
					{member.persona.map((item, index) => (<li key={index}>{item}</li>))}
				</ul>
			</div>
		</div>
	</article>)
}

/**
 * Get the profile picture URL for a team member
 * @param studentID Student ID number
 * @returns An API path where the profile picture is located
 */
function getMemberPFP(studentID: string) {
	return `${rString.backend_url}/pics/pfp-${studentID}.webp`
}
