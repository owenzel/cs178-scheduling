<script>
	import { Form, FormGroup, Input, Button } from 'sveltestrap';
</script>

<!-- CONCEPT: Editing: a form to log in (or create a new account) -->

<div class="welcome">
	<h1>sched178</h1>

	<Form class="login" method="POST">
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
			maxlength="1"
			/>
		</FormGroup>
		<Button color='primary' type='submit'>Sign In</Button>
	</Form>
</div>