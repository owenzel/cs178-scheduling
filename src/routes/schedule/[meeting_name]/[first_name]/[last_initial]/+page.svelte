<script>
	// TODO: Label concepts
	// TODO: Unselect
	// TODO: Location form should be associated with a slot
	// TODO: Location should appear in some kind of legend on the side?
	// TODO: Save & properly retrieve location (persistent storage)
	// TODO (tentative): Add option for virtual location to location form
	// TODO: Add time zone (IF TIME)

	import Modal from "../../../../../lib/components/Modal.svelte";
	import ResponseAlert from "../../../../../lib/components/ResponseAlert.svelte";
	import { Navbar, Button } from "sveltestrap";

	// Access the loaded data
	export let data;

	let curr_locs=['',''];
	let columns = new Array(7);
	let rows = new Array(40);

	const initialUserTime = Date.now();

	let unlabeled;
	// Cannot save until at least one new selection was made
	let newSelectionWasMade = false;

	// Initialize 2D array for state, each containing a map like:
	/*
		{
			selected: bool,
			start_location: string
			end_location string
		}
	*/
	let selection_state = [];

	for (let r = 0; r < rows.length; r++) {
		let selection_state_col = [];
		for (let c = 0; c < columns.length; c++) {
			// TODO: Update to empty strings for start & end location
			selection_state_col.push({
				hovered: false,
				selected: false,
				start_location: '',
				end_location: '',
			});
		}
		selection_state.push(selection_state_col);
	}

	// Update the state array with the fetched selections:
	for (let i = 0; i < data.initialSelections.length; i++) {
		const initialSelection = data.initialSelections[i];
		const row = initialSelection.row;
		const col = initialSelection.column;
		const startLocation = initialSelection.start_location;
		const endLocation = initialSelection.end_location;

		selection_state[row][col].selected = true;
		selection_state[row][col].start_location = startLocation;
		selection_state[row][col].end_location = endLocation;
	}

	let isDrag = false;
	let firstSelectedSlotPos = null;
	let selectedBlockBounds = [[], []];
	let nextForm = false;
	let showLoc = false;
	let formOpen = false;
	
	let locationModal;
	let locationModalEdit;
	let alertColor = '';
	let alertMessage = '';
	let enableAlert = false;

	let times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'];
	let days = ['Sun', 'Mon','Tue','Wed','Thu','Fri','Sat'];

	const beginDrag = () => {
		isDrag = true;
	}
	
	const endDrag = () => {
		let count = 0;
		let broken = false;
		isDrag = false;
		firstSelectedSlotPos = null;
		for (let i = 0; i < rows.length; i++) {
				for (let j = 0; j < columns.length; j++) {
					if (selection_state[i][j].selected && selection_state[i][j].start_location ==''){
						count++;
						broken = true;
						break;
					}
				}
				if (broken) {
					break;
				}
			}
			if (count == 0) {
				if (formOpen) {
					locationModal.show();
				}
				formOpen = false;
			}
	}
	
	const toggle = (r, c) => {
		newSelectionWasMade = true;
		selection_state[r][c].selected = !selection_state[r][c].selected;
	}
	
	const mouseHandler = (r, c) => (e) => {
		console.log(formOpen);
		let broken = false;
		let count = 0;
		if (e.type === 'mousedown') {
			if (selection_state[r][c].start_location == '') {
				if (firstSelectedSlotPos == null) {
					firstSelectedSlotPos = [r, c];
					toggle(r,c);
				}

			}
			else {
				showLoc = false;

			}
			if (!formOpen) {
				locationModal.show();
				formOpen = true;
			}
			for (let i = 0; i < rows.length; i++) {
				for (let j = 0; j < columns.length; j++) {
					if (selection_state[i][j].selected && selection_state[i][j].start_location ==''){
						count++;
						broken = true;
						break;
					}
				}
				if (broken) {
					break;
				}
			}
			if (count == 0) {
				if (formOpen) {
					locationModal.show();
				}
				formOpen = false;
			}
		}
		if (isDrag && firstSelectedSlotPos !== null) {
			// If this is the start of a new drag
			let first_x = firstSelectedSlotPos[0];
			let first_y = firstSelectedSlotPos[1];
			let current_x = r;
			let current_y = c;

			let min_x = Math.min(first_x, current_x);
			let max_x = Math.max(first_x, current_x);
			let min_y = Math.min(first_y, current_y);
			let max_y = Math.max(first_y, current_y);

			unlabeled = [min_x, max_x, min_y, max_y];
			selectedBlockBounds[0] = [min_x, max_x];
			selectedBlockBounds[1] = [min_y, max_y];

			for (let i = min_x; i < max_x + 1; i++) {
				for (let j = min_y; j < max_y + 1; j++) {
					selection_state[i][j].selected = selection_state[first_x][first_y].selected;
				}
			}
		}
	}

	const handleHover = (r, c) => (e) => {
		if (locationModal.shown != true) {
			if (selection_state[r][c].selected){
				curr_locs = [selection_state[r][c].start_location, selection_state[r][c].end_location]
				for (let i = 0; i < rows.length; i++) {
					for (let j = 0; j < columns.length; j++) {
						if (selection_state[i][j].selected &&
							selection_state[r][c].start_location == selection_state[i][j].start_location && 
							selection_state[r][c].end_location == selection_state[i][j].end_location
							&& selection_state[r][c].start_location != '' && selection_state[r][c].end_location != ''){
								selection_state[i][j].hovered = !selection_state[i][j].hovered;
						}
					}
				}
				showLoc = true;
			}
			else {
				showLoc = false;
			}
		}
	}

	const toggleHover = (r, c) => {
		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j < columns.length; j++) {
				if (selection_state[i][j].selected &&
					selection_state[r][c].start_location == selection_state[i][j].start_location && 
					selection_state[r][c].end_location == selection_state[i][j].end_location
					&& selection_state[r][c].start_location != '' && selection_state[r][c].end_location != ''){
						selection_state[i][j].hovered = !selection_state[i][j].hovered;
				}
			}
		}
	}




	// TODO: Update
	function saveLocation (e) {
		formOpen = false;
		locationModal.show();
		const formData = new FormData(e.target);
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
		for (let i = unlabeled[0]; i < unlabeled[1] + 1; i++) {
			for (let j = unlabeled[2]; j < unlabeled[3] + 1; j++) {
				selection_state[i][j].start_location = data["start_location"];
				selection_state[i][j].end_location = data["end_location"];
			}
		}
	}

	async function logUserTime() {
		// Calculate the time the user spent entering input
		const finalUserTime = Date.now();
		const timeElapsedMs = finalUserTime - initialUserTime;
		const timeElapsedSec = timeElapsedMs / 1000;

		// Log the elapsed time
		const response = await fetch('/api/log-user-time', {
				method: 'POST',
				body: JSON.stringify({
					first_name: `${data.first_name}`,
					last_initial: `${data.last_initial}`,
					start_time: initialUserTime / 1000, // epoch time in sec
					end_time: finalUserTime / 1000, // epoch time in sec
					time_elapsed_sec: timeElapsedSec
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			// TODO: Handle success/failure
			await response.json();
	}

	async function saveSelections() {
		try {
			await logUserTime();

			// First "selection" is just first name & last initial
			let selections = [{
				first_name: `${data.first_name}`,
				last_initial: `${data.last_initial}`
			}];

			// Add data items for the other selections
			for (let r = 0; r < rows.length; r++) {
				for (let c = 0; c < columns.length; c++) {
					const slot = selection_state[r][c]
					if (slot.selected == true) {
						let selection = {
							row: r,
							column: c,
							start_location: slot.start_location,
							end_location: slot.end_location,
						}

						selections.push(selection);
					}
				}
			}

			const response = await fetch('/api/save-selections', {
				method: 'POST',
				body: JSON.stringify(selections),
				headers: {
					'content-type': 'application/json'
				}
			});

			await response.json();
			showAlert('success', 'Results were successfully saved!');

		} catch (e) {
			console.log(e);
			showAlert('danger', `There was an error saving your selections: ${e}`);
		}
	}

	async function handleExportToCSV() {
		try {
			const response = await fetch('/api/csv-export', {
				method: 'POST',
			});

			await response.json();

			showAlert('success', 'Results were successfully written to the CSV!');
		} catch (e) {
			showAlert('danger', `There was an error writing the results to the CSV: ${e}`);
		}
	}

	function showAlert(color, message) {
		alertColor = color;
		alertMessage = message;
		enableAlert = true;
	}
	
</script>

<style>
	td {
		background-color: pink;
		width: 100px;
		height: 15px;
		border-right: 1px solid white;
	}

	tr:nth-child(odd) td{
		border-bottom: 1px solid white;
	}

	th {
		position: relative;
		top: 10.5px;
		font-size: 10px;
		padding-bottom: 14px;
	}

	.days {
		padding-bottom: 0px;
		top: -10px;
		font-size: 12px;
	}

	.selected {
		background-color: blue;
	}
	.hovered {
		background-color: rgba(0, 0, 0, 0.5);
	}

</style>

<!-- TODO: Add column headers: days of week -->
<Navbar color="light" light expand="md">
	<Button href="/">Log Out</Button>
	<div>
		<Button on:click={saveSelections} disabled={!newSelectionWasMade} color='success' class="mx-3">
			Save My Selections
		</Button>
		<Button on:click={handleExportToCSV}>[ADMIN ONLY] Export All Results to CSV</Button>
	</div>
</Navbar>

<!-- Alerts -->
<ResponseAlert hidden={!enableAlert} color={alertColor} message={alertMessage} />

<h5 class="instructions">Select the times when you are NOT available.</h5>
<svelte:window on:mousedown={beginDrag} on:mouseup={endDrag} />
<div class="scheduler">
	<table class="calendar">
		{#each times as time}
			<tr class="times">
				<th>{time}</th>
			</tr>
		{/each}
	</table>
	<table class="calendar">
				<tr class="times">
		{#each columns as _column, h}
			<th class="days">{days[h]}</th>
		{/each}
		</tr>
		{#each rows as _row, r}
			<tr on:click={handleHover}>
				{#each columns as _column, c}
					<td on:mousedown={mouseHandler(r , c)} on:mouseenter={mouseHandler(r, c)} on:mouseover={handleHover(r,c)} on:mouseout={handleHover(r,c)} class:selected="{selection_state[r][c].selected}" class:hovered="{selection_state[r][c].hovered}"></td>
				{/each}
			</tr>
		{/each}
	</table>

	<!-- Modal Forms -->
	<Modal bind:this={locationModal} on:show={e => locationModal.shown = e.detail} on:show={()=>nextForm=false}>
		<form class="locform" on:submit={saveLocation}>
		<fieldset id="start" class='{nextForm === false ? '':'hidden'}'>
			<label for="start_location">Where will you be at the START of this time block?</label>
			<input type="text" id="start_location" name="start_location">
			<Button type="button" on:click={()=>nextForm=!nextForm} color="light">Next</Button>
		</fieldset>
		<fieldset id="end" class='{nextForm === true ? '':'hidden'}'>
			<label for="end_location">Where will you be at the END of this time block?</label>
			<input type="text" id="end_location" name="end_location">
			<Button type="submit" color="light">Submit</Button>
		</fieldset>
		</form>
	</Modal>

	<Modal bind:this={locationModalEdit} on:show={e => locationModalEdit.shown = e.detail}>
		<form class="locform" on:submit={saveLocation}>
			<label for="start_location">Where will you be at the START of this time block?</label>
			<input type="text" id="start_location" name="start_location" value="{curr_locs[0]}">
			<label for="end_location">Where will you be at the END of this time block?</label>
			<input type="text" id="end_location" name="end_location" value="{curr_locs[1]}">
			<Button type="submit" color="light">Submit</Button>
		</form>
	</Modal>

	<div class='{showLoc === true ? 'geolabel':'hidden'}'><h3>You are starting at</h3><p>{curr_locs[0]}</p>
		<h3>You are ending at</h3><p>{curr_locs[1]}</p></div>
</div>
