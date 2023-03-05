<script>
	import { Form, FormGroup, Input, Button } from 'sveltestrap';
</script>


<div class="w-50 text-center mx-auto">
	<h1>ScheduleMe</h1>

	<Form method="POST">
		<FormGroup>
			<Input
			type="text"
			name="firstName"
			id="firstName"
			placeholder="First Name"
			required
			/>
		</FormGroup>
		<FormGroup>
			<Input
			type="text"
			name="lastInitial"
			id="lastInitial"
			placeholder="Last Initial"
			required
			/>
		</FormGroup>
		<Button color='primary' type='submit'>Sign In</Button>
	</Form>
</div>