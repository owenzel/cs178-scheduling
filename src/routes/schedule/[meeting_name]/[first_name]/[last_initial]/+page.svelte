<script>
	let columns = new Array(7)
	let rows = new Array(20)
	// let state = new Array(rows.length*columns.length).fill(false)
	let state = []
	for (let r = 0; r < rows.length; r++) {
		let arr = []
		for (let c = 0; c < columns.length; c++) {
			arr.push(false);
		}
		state.push(arr)
	}
	let isDrag = false
	let firstSelectedSlotPos = null
	
	let times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'];
	
	const beginDrag = () => {
		isDrag = true
	}
	
	const endDrag = () => {
		isDrag = false
		firstSelectedSlotPos = null
	}
	
	const toggle = (r, c) => {
		state[r][c] = !state[r][c]
	}
	
	const mouseHandler = (r, c) => (e) => {
		if (e.type === 'mousedown') {
			if (firstSelectedSlotPos == null) {
				firstSelectedSlotPos = [r, c]
				console.log(firstSelectedSlotPos)
				toggle(r,c)
			}
		}
		if (isDrag && firstSelectedSlotPos !== null) {
			// If this is the start of a new drag
			let first_x = firstSelectedSlotPos[0]
			let first_y = firstSelectedSlotPos[1]
			let current_x = r
			let current_y = c

			let min_x = Math.min(first_x, current_x)
			let max_x = Math.max(first_x, current_x)
			let min_y = Math.min(first_y, current_y)
			let max_y = Math.max(first_y, current_y)

			for(let i = min_x; i < max_x + 1; i++) {
				for (let j = min_y; j < max_y + 1; j++) {
					state[i][j] = state[first_x][first_y]
				}
			}
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
					<td on:mousedown={mouseHandler(r , c)} on:mouseenter={mouseHandler(r, c)} class:selected="{state[r][c]}"></td>
				{/each}
			</tr>
		{/each}
	</table>
	<!-- <Modal/> -->
</div>
