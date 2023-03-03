<!-- Code credit: https://codesandbox.io/s/naughty-bardeen-6u5gu?file=/App.svelte:0-3737 -->
<script>
	import Selecto from "svelte-selecto";

	const cubes = [];
	
	for (let i = 0; i < 60; ++i) {
		cubes.push(i);
	}
	</script>
	<style>
		.app {
			position: relative;
			min-height: 100%;
			padding: 10px 20px;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}
		
		.container {
			max-width: 800px;
		}
		
		.logo {
			position: relative;
			width: 150px;
			height: 150px;
			margin: 0px auto;
			font-size: 0;
			text-align: left;
		}
		
		.logo img {
			position: relative;
			height: 100%;
			box-sizing: border-box;
		}
		
		.cube {
			display: inline-block;
			border-radius: 5px;
			width: 40px;
			height: 40px;
			margin: 4px;
			background: #eee;
			--color: #4af;
		}
		
		h1, .description {
			text-align: center;
		}
		
		.elements {
			margin-top: 40px;
			border: 2px solid #eee;
		}
		
		.selecto-area {
			padding: 20px;
		}
		
		#selecto1 .cube {
			transition: all ease 0.2s;
		}
		
		.moveable #selecto1 .cube {
			transition: none;
		}
		
		.selecto-area :global(.selected) {
			color: #fff;
			background: var(--color);
		}

		.empty.elements {
			border: none;
		}
	</style>
	<div class="app">
		<div class="container">
			<div class="logo" id="logo">
				<img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
			</div>
			<h1>Select in real time.</h1>
			<p class="description">The <strong>select</strong> event allows you to select a target in real time.</p>
			<Selecto
				dragContainer={".elements"}
				selectableTargets={[".selecto-area .cube"]}
				hitRate={100}
				selectByClick={true}
				selectFromInside={true}
				ratio={0}
				on:select={({ detail: e }) => {
					e.added.forEach(el => {
						el.classList.add("selected");
					});
					e.removed.forEach(el => {
						el.classList.remove("selected");
					});
				}}
			></Selecto>
	
			<div class="elements selecto-area" id="selecto1">
				{#each cubes as cube}
					<div class="cube"></div>
				{/each}
			</div>
			<div class="empty elements"></div>
		</div>
	</div>