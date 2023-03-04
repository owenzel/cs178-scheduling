<script>
	import Modal from "../../../../../lib/components/Modal.svelte";
	let columns = new Array(7)
	let rows = new Array(20)
	let state = new Array(rows.length*columns.length).fill(false)
	let isDrag = false
	let nextForm = false
	
	let child;
	let submissions = [];
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

	function saveSelection(e) {
		const formData = new FormData(e.target);
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		submissions.push(data);
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
	<button on:click={child.show}>
		Show
	</button>
	<!-- Modal Forms -->
	<Modal bind:this={child} on:show={e => child.shown = e.detail} on:show={()=>nextForm=false}>
	<form class="locform" on:submit|preventDefault={saveSelection}>
	<fieldset id="start" class='{nextForm === false ? '':'hidden'}'>
		<label for="startloc">Where will you start?</label>
		<input type="text" id="startloc" name="startloc">
		<button on:click={()=>nextForm=!nextForm}>Next</button>
	</fieldset>
	<fieldset id="end" class='{nextForm === true ? '':'hidden'}'>
		<label for="startloc">Where will you end?</label>
		<input type="text" id="startloc" name="startloc">
		<button type="submit" on:click={child.show}>Submit</button>
	</fieldset>
	</form>
	</Modal>
	<button>
		Save my selections!
	</button>
</div>
