<script>
	// TODO: Label concepts
	// TODO: Unselect
	// TODO: Location form should be associated with a slot
	// TODO: Location should appear in some kind of legend on the side?
	// TODO: Save & properly retrieve location (persistent storage)
	// TODO (tentative): Add option for virtual location to location form
	// TODO: Add success/error message to let user know that data was saved properly
	// TODO: Add success/error message to let user know that csv was written to
	// TODO: Add time zone (IF TIME)

	import Modal from "../../../../../lib/components/Modal.svelte";
	import { Navbar, Button } from "sveltestrap";

	// Access the loaded data
	export let data;

	let columns = new Array(7);
	let rows = new Array(20);

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
				selected: false,
				start_location: 'test',
				end_location: 'test',
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
	
	let locationModal;
	let times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'];
	
	const beginDrag = () => {
		isDrag = true;
	}
	
	const endDrag = () => {
		isDrag = false;
		firstSelectedSlotPos = null;
		
		// TODO: Open location form & associate it with the given block
	}
	
	const toggle = (r, c) => {
		newSelectionWasMade = true;
		selection_state[r][c].selected = !selection_state[r][c].selected;
	}
	
	const mouseHandler = (r, c) => (e) => {
		console.log('mouse handler');
		if (e.type === 'mousedown') {
			if (firstSelectedSlotPos == null) {
				firstSelectedSlotPos = [r, c];

				toggle(r,c);
			}
			locationModal.show();
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

	// TODO: Update
	function saveLocation (e) {
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

			// TODO: Handle success/failure - show pop up?
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

			// TODO: Handle success/failure - show pop up?
			await response.json();

		} catch (e) {
			console.log(e);
			// TODO: Handle error
		}
	}

	// TODO: Implement
	async function handleExportToCSV() {
		console.log("Export to CSV...");

		try {
			const response = await fetch('/api/csv-export', {
				method: 'POST',
			});

			// TODO: Handle success/failure - show pop up?
			await response.json();
		} catch (e) {

		}
	}

</script>

<style>
	td {
		background-color: pink;
		border: 1px solid white;
		width: 100px;
		height: 30px;
	}

	th {
		position: relative;
		top: -7.5px;
		font-size: 10px;
		padding-bottom: 14px;
		
	}
	.selected {
		background-color: blue;
	}
</style>

<!-- TODO: Add column headers: days of week -->
<Navbar color="light" light expand="md">
	<Button href="/">Log Out</Button>
	<div>
		<Button on:click={saveSelections} disabled={!newSelectionWasMade} color='success' class="mx-3">
			Save My Selections
		</Button>
		<Button on:click={handleExportToCSV}>Export All Results to CSV</Button>
	</div>
</Navbar>
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
		{#each rows as _row, r}
			<tr >
				{#each columns as _column, c}
					<td on:mousedown={mouseHandler(r , c)} on:mouseenter={mouseHandler(r, c)} class:selected="{selection_state[r][c].selected}"></td>
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
</div>
