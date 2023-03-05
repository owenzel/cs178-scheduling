<script>
	// TODO: Handle fetched selections
	// TODO: Add time zone


	import Modal from "../../../../../lib/components/Modal.svelte";

	let columns = new Array(7);
	let rows = new Array(20);

	// TODO: Account for a slot being included in a new block (selected or unselected)

	// 2D Array, each containing a map like:
	/*
		{
			selected: bool,
			start_location: string
			end_location string
		}
	*/
	let state_new = [];

	// let state = [];
	let locations = [];

	for (let r = 0; r < rows.length; r++) {
		let new_state_arr = [];
		// let state_arr = [];
		let locations_arr = [];
		for (let c = 0; c < columns.length; c++) {
			// TODO: Update to empty strings for start & end location
			new_state_arr.push({
				selected: false,
				start_location: 'test',
				end_location: 'test',
			});
			// state_arr.push(false);
			locations_arr.push(null);
		}
		// state.push(state_arr);
		locations.push(locations_arr);
		state_new.push(new_state_arr);
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
		// state[r][c] = !state[r][c];
		state_new[r][c].selected = !state_new[r][c].selected;
	}
	
	// TODO: Handle backwards drag
	const mouseHandler = (r, c) => (e) => {
		console.log('mouse handler');
		if (e.type === 'mousedown') {
			if (firstSelectedSlotPos == null) {
				firstSelectedSlotPos = [r, c];

				// selectedBlockBounds[0] = [r, r];
				// selectedBlockBounds[1] = [c, c];

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
					// state[i][j] = state[first_x][first_y];
					state_new[i][j].selected = state_new[first_x][first_y].selected;
				}
			}
		}
	}

	// TODO: Update
	// TODO: Call database function; handle error
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
		let selections = [];

		for (let r = 0; r < rows.length; r++) {
			for (let c = 0; c < columns.length; c++) {
				const slot = state_new[r][c]
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
					<td on:mousedown={mouseHandler(r , c)} on:mouseenter={mouseHandler(r, c)} class:selected="{state_new[r][c].selected}"></td>
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
	<button on:click={saveSelections}>
		Save my selections!
	</button>
</div>
