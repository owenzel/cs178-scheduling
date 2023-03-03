<!-- code credit: https://svelte.dev/repl/801ec208ac3a44a5880ea4c31703b39f?version=3.45.0 -->

<script>
	let columns = new Array(5)
	let rows = new Array(3)
	let state = new Array(rows.length*columns.length).fill(false)
	let isDrag = false
	
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
		width: 80px;
		height: 80px;
		background-color: pink;
	}
	.selected {
		background-color: blue;
	}
</style>

<svelte:window on:mousedown={beginDrag} on:mouseup={endDrag} />
<table>
	{#each rows as _row, r}
		<tr>
			{#each columns as _column, c}
				<td on:mousedown={mouseHandler(r, c)} on:mouseenter={mouseHandler(r, c)} class:selected="{state[r*columns.length+c]}"></td>
			{/each}
		</tr>
	{/each}
</table>
