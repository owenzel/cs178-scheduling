<script>
	// import Modal from "../../../../../lib/components/Modal.svelte";
	let columns = new Array(7)
	let rows = new Array(20)
	let state = new Array(rows.length*columns.length).fill(false)
	let isDrag = false
	
	let times = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'];
	
	const beginDrag = () => {
		isDrag = true
	}
	
	const endDrag = () => {
		isDrag = false
	}
	
	const toggle = (r, c) => {
		state[r*columns.length+c] = !state[r*columns.length+c]
	}
	
	const mouseHandler = (r, c) => (e) => {
		if (isDrag || e.type === 'mousedown') {
			toggle(r, c)
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
					<td on:mousedown={mouseHandler(r , c)} on:mouseenter={mouseHandler(r, c)} class:selected="{state[r*columns.length+c]}"></td>
				{/each}
			</tr>
		{/each}
	</table>
	<!-- <Modal/> -->
</div>
