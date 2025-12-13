<script lang="ts">
	import OutlineRow from '@/components/OutlineRow.svelte';
	import Link from '@/components/Link.svelte';
</script>

<section id="hero" class="flex flex-col gap-4 pt-8">
	<OutlineRow className="pt-16 pb-8 gap-6 flex flex-col">
		<OutlineRow className="px-6">
			<h1 class="text-[5.5rem] leading-none text-neutral-900 dark:text-neutral-50">
				Calendario <span
					class="font-medium text-blue-800 dark:text-blue-500 [&>span>span]:font-normal"
				>
					mensual
				</span>
				<br /> personalizable
			</h1>
		</OutlineRow>

		<OutlineRow className="px-6">
			<p class="max-w-5xl text-xl">
				Calendarios personalizados anuales, mensuales, laborables, festivos, santuario...
				Ademas horaraios, listas, meal planners y mucho más.
			</p>
		</OutlineRow>

		<OutlineRow className="px-6 py-2">
			<Link href="#crear">Crear calendario</Link>
		</OutlineRow>
	</OutlineRow>
</section>
