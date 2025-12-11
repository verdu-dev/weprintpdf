<script lang="ts">
	import OutlineRow from '@/components/OutlineRow.svelte';
	import { TypeWriter } from 'svelte-typewrite';
	import { searchTerm } from '@/lib/stores';
	import Button from '@/components/Button.svelte';

	const words = ['calendarios', 'agendas', 'listas', 'perpétuos'];
</script>

<section id="hero" class="flex flex-col gap-4 pt-8">
	<OutlineRow className="pt-16 pb-8 gap-6 flex flex-col">
		<OutlineRow className="px-6">
			<h1 class="text-[5.5rem] leading-none text-neutral-900 dark:text-neutral-50">
				Personaliza <span
					class="font-medium text-blue-800 dark:text-blue-500 [&>span>span]:font-normal"
				>
					<TypeWriter texts={words} />
				</span>
				<span class="sr-only">calendarios anuales, mensuales, semanales, agendas...</span>
				<br /> y otros imprimibles
			</h1>
		</OutlineRow>

		<OutlineRow className="px-6">
			<p class="max-w-5xl text-xl">
				Calendarios personalizados anuales, mensuales, laborables, festivos, santuario... Ademas
				horaraios, listas, meal planners y mucho más.
			</p>
		</OutlineRow>

		<OutlineRow className="px-6">
			<input
				class="w-full max-w-sm rounded-full bg-neutral-300 px-4 py-2.5 dark:bg-neutral-700"
				type="text"
				placeholder="Calendario anual..."
				bind:value={$searchTerm}
			/>

			<Button>Buscar</Button>
		</OutlineRow>
	</OutlineRow>
</section>
