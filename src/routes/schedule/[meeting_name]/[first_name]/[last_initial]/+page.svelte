<script>
	// TODO: Location form should be associated with a slot
	// TODO: Location should appear in some kind of legend on the side?
	// TODO: Save & properly retrieve location (persistent storage)
	// TODO: Save selections to csv that we can export
	// TODO: Add option for virtual location to location form
	// TODO: Add success/error message to let user know that data was saved properly
	// TODO: Update styling to be consistent (use Bootstrap?)
	// TODO: Add time zone (IF TIME)


	import Modal from "../../../../../lib/components/Modal.svelte";
	import { Button } from "sveltestrap";

	// Access the loaded data
	export let data;

	let columns = new Array(7);
	let rows = new Array(20);

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
	
	let child;
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
		const formData = new FormData(e.target);
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
		submissions.push(data);
	}

	async function saveSelections() {
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
	}

	// TODO: Implement
	function handleExportToCSV() {
		console.log("Export to CSV...");
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
<Button href="/">Log Out</Button>
<Button on:click={handleExportToCSV}>Export All Results to CSV</Button>
<svelte:window on:mousedown={beginDrag} on:mouseup={endDrag} />
<div class="scheduler">
	<h1>My Event</h1>
	<br>
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
	<button on:click={child.show}>
		Show
	</button>
	<!-- Modal Forms -->
	<!-- TODO: Fix end location not submitting -->
	<Modal bind:this={child} on:show={e => child.shown = e.detail} on:show={()=>nextForm=false}>
	<form class="locform" on:submit|preventDefault={saveLocation}>
	<fieldset id="start" class='{nextForm === false ? '':'hidden'}'>
		<label for="start_location">Where will you start?</label>
		<input type="text" id="start_location" name="start_location">
		<button on:click={()=>nextForm=!nextForm}>Next</button>
	</fieldset>
	<fieldset id="end" class='{nextForm === true ? '':'hidden'}'>
		<label for="end_location">Where will you end?</label>
		<input type="text" id="end_location" name="end_location">
		<button type="submit" on:click={child.show}>Submit</button>
	</fieldset>
	</form>
	</Modal>
	<button on:click={saveSelections} disabled={!newSelectionWasMade}>
		Save my selections!
	</button>
</div>
