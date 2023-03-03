<script>
	import { Form, FormGroup, Input, Button } from 'sveltestrap';
</script>

<h1>ScheduleMe</h1>

<Form method="POST">
	<FormGroup>
		<Input
		  type="text"
		  name="firstName"
		  id="firstName"
		  placeholder="First Name"
		/>
	</FormGroup>
	<FormGroup>
		<Input
		  type="text"
		  name="lastInitial"
		  id="lastInitial"
		  placeholder="Last Initial"
		/>
	</FormGroup>
	<Button color='primary' type='submit'>Sign In</Button>
</Form>